import express from 'express';
import cors from 'cors';
import db from './db.js';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { authenticateAdmin, authenticateUser, JWT_SECRET } from './middleware/auth.js';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGINS 
	? process.env.CORS_ORIGINS.split(',') 
	: ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps, curl, or server-to-server)
		if (!origin) return callback(null, true);
		
		// If CORS_ORIGINS is set to '*', allow all origins (e.g. for a fully public API)
		if (allowedOrigins.includes('*')) return callback(null, true);

		if (allowedOrigins.indexOf(origin) === -1) {
			const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	},
	credentials: true
}));
app.use(express.json());

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000,
	message: { error: 'Too many requests, please try again later.' }
});
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: { error: 'Too many login attempts, please try again later.' }
});

app.use('/api/admin', authenticateAdmin);
app.use('/api', apiLimiter);

// API data is dynamic — never let browsers/tabs cache it so the storefront
// and admin app always reflect the latest live edits.
app.use('/api', (req, res, next) => {
	res.set('Cache-Control', 'no-store');
	next();
});

app.use('/assets/uploads', express.static(path.join(__dirname, '../web/static/assets/uploads')));
app.use('/assets', express.static(path.join(__dirname, '../web/static/assets')));

const upload = multer({ storage: multer.memoryStorage() });

// --- Image storage helpers ---
// Uploads are staged under uploads/_staging/ and relocated into their slug-based
// tree when the owning entity (category/product/tile) is saved. This keeps the
// folder structure aligned with slugs, and lets a slug rename move a whole
// subtree without orphaning files.
const UPLOADS_ROOT = path.join(__dirname, '../web/static/assets/uploads');
const WEB_STATIC = path.join(__dirname, '../web/static');

function safeFolder(name) {
	const clean = String(name || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)+/g, '');
	if (!clean || clean === '.' || clean === '..') {
		throw new Error('Invalid folder slug');
	}
	return clean;
}

function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

function moveFileSync(src, dest) {
	const absSrc = path.resolve(src);
	const absDest = path.resolve(dest);
	if (absSrc === absDest) return;
	if (!fs.existsSync(absSrc)) return;
	ensureDir(path.dirname(absDest));
	try {
		fs.renameSync(absSrc, absDest);
	} catch (err) {
		fs.copyFileSync(absSrc, absDest);
		fs.unlinkSync(absSrc);
	}
}

// Moves an image (highres + thumb) into targetDir naming it <base>.webp /
// <base>-thumb.webp, then rewrites its stored URLs. No-op if already in place.
function relocateImage(uid, targetDir, base) {
	if (!uid) return;
	const img = db.prepare('SELECT uid, high_res_url, thumb_url, alt_text, type FROM images WHERE uid = ?').get(uid);
	if (!img) return;

	const highName = `${base}.webp`;
	const thumbName = `${base}-thumb.webp`;
	const highTarget = path.join(UPLOADS_ROOT, targetDir, highName);
	const thumbTarget = path.join(UPLOADS_ROOT, targetDir, thumbName);

	moveFileSync(path.join(WEB_STATIC, img.high_res_url), highTarget);
	moveFileSync(path.join(WEB_STATIC, img.thumb_url), thumbTarget);

	const highUrl = `/assets/uploads/${targetDir}/${highName}`;
	const thumbUrl = `/assets/uploads/${targetDir}/${thumbName}`;
	if (img.high_res_url !== highUrl || img.thumb_url !== thumbUrl) {
		db.prepare('UPDATE images SET high_res_url = ?, thumb_url = ? WHERE uid = ?').run(highUrl, thumbUrl, uid);
	}
}

// Rewrites every image URL whose path starts with oldPrefix to start with newPrefix.
// Used after a folder rename so DB paths follow the moved files.

// Deletes any image records (and their files) that are no longer referenced by
// any products, categories, or layout tiles, unless they were uploaded in the last hour.
function cleanOrphanImages() {
	try {
		const orphans = db.prepare(`
			SELECT uid, high_res_url, thumb_url 
			FROM images i
			LEFT JOIN products p ON i.uid = p.imageId
			LEFT JOIN product_gallery pg ON i.uid = pg.imageId
			LEFT JOIN categories c ON i.uid = c.imageId
			LEFT JOIN layout_tiles lt ON i.uid = lt.imageId
			WHERE p.id IS NULL 
			  AND pg.productId IS NULL 
			  AND c.id IS NULL 
			  AND lt.id IS NULL
		`).all();
		
		const delStmt = db.prepare('DELETE FROM images WHERE uid = ?');
		
		for (const img of orphans) {
			const highresDisk = path.join(__dirname, '../web/static', img.high_res_url);
			const thumbDisk = path.join(__dirname, '../web/static', img.thumb_url);
			
			// If file exists, check its age. We keep recent uploads (e.g. < 1 hr) so we 
			// don't delete images mid-form-submission.
			if (fs.existsSync(highresDisk)) {
				const stats = fs.statSync(highresDisk);
				const ageHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
				if (ageHours < 1) continue; 
				fs.unlinkSync(highresDisk);
			}
			if (fs.existsSync(thumbDisk)) {
				fs.unlinkSync(thumbDisk);
			}
			
			// Execute delete after disk cleanup
			delStmt.run(img.uid);
		}
	} catch (e) {
		console.error('Orphan image cleanup failed:', e);
	}
}

// Recursively removes empty directories within a target directory
function removeEmptyDirectories(dir) {
    if (!fs.existsSync(dir)) return;
    if (dir === UPLOADS_ROOT) return; // Don't delete the root
    
    const files = fs.readdirSync(dir);
    if (files.length > 0) {
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                removeEmptyDirectories(fullPath);
            }
        });
    }
    
    // Re-check if it's empty after cleaning children
    if (fs.readdirSync(dir).length === 0) {
        try {
            fs.rmdirSync(dir);
        } catch (err) {}
    }
}

function rewriteImageUrlsPrefix(oldPrefix, newPrefix) {
	const images = db.prepare('SELECT uid, high_res_url, thumb_url FROM images').all();
	const update = db.prepare('UPDATE images SET high_res_url = ?, thumb_url = ? WHERE uid = ?');
	for (const img of images) {
		const high = img.high_res_url.startsWith(oldPrefix) ? newPrefix + img.high_res_url.slice(oldPrefix.length) : img.high_res_url;
		const thumb = img.thumb_url.startsWith(oldPrefix) ? newPrefix + img.thumb_url.slice(oldPrefix.length) : img.thumb_url;
		if (high !== img.high_res_url || thumb !== img.thumb_url) {
			update.run(high, thumb, img.uid);
		}
	}
}

// Moves a product's cover + gallery images into uploads/<category>/<productId>/,
// with the cover named example.webp and gallery images under listing/.
function relocateProductImages(product) {
	const folder = `${safeFolder(product.categoryId)}/${safeFolder(product.id)}`;
	const gallery = db.prepare('SELECT imageId FROM product_gallery WHERE productId = ? ORDER BY displayOrder ASC').all(product.id);
	const imageIds = [];
	if (product.imageId) imageIds.push(product.imageId);
	for (const g of gallery) {
		if (g.imageId && !imageIds.includes(g.imageId)) imageIds.push(g.imageId);
	}
	for (const uid of imageIds) {
		const isCover = uid === product.imageId;
		relocateImage(uid, isCover ? folder : `${folder}/listing`, isCover ? 'example' : uid);
	}
}

// --- Public Endpoints (for Web) ---

app.get('/api/tiles', (req, res) => {
	try {
		const tiles = db.prepare(`
			SELECT t.id, t.title as name, i.thumb_url as image
			FROM layout_tiles t
			LEFT JOIN images i ON t.imageId = i.uid
			ORDER BY t.id ASC
		`).all();
		
		const getCats = db.prepare('SELECT categoryId FROM layout_tile_categories WHERE tileId = ?');
		
		tiles.forEach(t => {
			t.id = String(t.id); // Web expects string ID
			t.categoryIds = getCats.all(t.id).map(c => c.categoryId);
		});
		res.json(tiles);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/categories', (req, res) => {
	try {
		const categories = db.prepare(`
			SELECT c.id, c.name, i.thumb_url as image 
			FROM categories c 
			JOIN images i ON c.imageId = i.uid
		`).all();
		res.json(categories);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/products', (req, res) => {
	try {
		const { categoryId, tileId, q, limit } = req.query;
		let query = `
			SELECT p.id, p.title, TRIM(COALESCE(c.name, '')) || ' Saree' as subtitle, p.subtitle as details, p.categoryId, p.color, p.rating, p.mrp, p.salePrice, p.stock, i.thumb_url as image 
			FROM products p 
			JOIN categories c ON p.categoryId = c.id
			JOIN images i ON p.imageId = i.uid 
			WHERE 1=1
		`;
		const params = [];

		if (categoryId) {
			query += ' AND p.categoryId = ?';
			params.push(categoryId);
		}

		if (tileId) {
			const cats = db.prepare('SELECT categoryId FROM layout_tile_categories WHERE tileId = ?').all(tileId).map(c => c.categoryId);
			if (cats.length > 0) {
				const placeholders = cats.map(() => '?').join(',');
				query += ` AND p.categoryId IN (${placeholders})`;
				params.push(...cats);
			} else {
				// No categories assigned to this tile, return empty
				query += ' AND 1=0';
			}
		}

		if (q) {
			query += ' AND (p.title LIKE ? OR p.subtitle LIKE ? OR c.name LIKE ?)';
			params.push(`%${q}%`, `%${q}%`, `%${q}%`);
		}

		if (limit) {
			query += ' LIMIT ?';
			params.push(Number(limit));
		}

		const products = db.prepare(query).all(...params);
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/products/:id', (req, res) => {
	try {
		const product = db.prepare(`
			SELECT p.id, p.title, TRIM(COALESCE(c.name, '')) || ' Saree' as subtitle, p.subtitle as details, p.categoryId, p.color, p.rating, p.mrp, p.salePrice, p.stock, i.thumb_url as image, i.high_res_url as highResImage 
			FROM products p 
			JOIN categories c ON p.categoryId = c.id
			JOIN images i ON p.imageId = i.uid 
			WHERE p.id = ?
		`).get(req.params.id);
		
		if (product) {
			// Fetch full gallery
			product.gallery = db.prepare(`
				SELECT i.high_res_url as url, i.thumb_url, i.alt_text as alt 
				FROM product_gallery pg 
				JOIN images i ON pg.imageId = i.uid 
				WHERE pg.productId = ? 
				ORDER BY pg.displayOrder ASC
			`).all(req.params.id);
			
			res.json(product);
		} else {
			res.status(404).json({ error: 'Product not found' });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/orders', (req, res) => {
	try {
		const orderSchema = z.object({
			customerName: z.string().min(1),
			email: z.string().email(),
			phone: z.string().min(10),
			address: z.string().min(1),
			city: z.string().min(1),
			state: z.string().min(1),
			pin: z.string().min(1),
			total: z.number().min(0),
			items: z.array(z.object({
				id: z.string(),
				quantity: z.number().int().min(1),
				price: z.number().min(0).optional()
			})).min(1)
		});

		const parsed = orderSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
		}
		const { customerName, email, phone, address, city, state, pin, total, items } = parsed.data;
		
		const insertOrder = db.prepare(`
			INSERT INTO orders (customerName, email, phone, address, city, state, pin, total, status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
		`);
		
		const insertItem = db.prepare(`
			INSERT INTO order_items (orderId, productId, productName, quantity, price)
			VALUES (?, ?, ?, ?, ?)
		`);
	
		const getStock = db.prepare(`
			SELECT id, title, stock, salePrice FROM products WHERE id = ?
		`);

		const updateStock = db.prepare(`
			UPDATE products 
			SET stock = MAX(0, stock - ?), sold = sold + ? 
			WHERE id = ?
		`);

		const productsMeta = {};
		for (const item of items) {
			const product = getStock.get(item.id);
			if (!product) {
				return res.status(400).json({ error: `Product not found: ${item.id}` });
			}
			if (product.stock < item.quantity) {
				return res.status(400).json({ error: `Insufficient stock for ${product.title} (only ${product.stock} left)` });
			}
			productsMeta[item.id] = { title: product.title, price: product.salePrice };
		}

		const transaction = db.transaction(() => {
			const result = insertOrder.run(customerName, email, phone, address, city, state, pin, total);
			const orderId = result.lastInsertRowid;
		
			// Deduct stock for each item and log order items
			for (const item of items) {
				updateStock.run(item.quantity, item.quantity, item.id);
				insertItem.run(orderId, item.id, productsMeta[item.id].title, item.quantity, productsMeta[item.id].price);
			}
		
			return orderId;
		});

		const orderId = transaction();
		res.json({ id: orderId, message: 'Order created successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/orders', authenticateUser, (req, res) => {
	try {
		const rawOrders = db.prepare('SELECT * FROM orders WHERE email = ? ORDER BY createdAt DESC').all(req.user.email);
		const getItems = db.prepare(`
			SELECT oi.productId as id, oi.productName as title, oi.quantity, oi.price, 
			       p.subtitle, p.mrp, i.thumb_url as image, p.stock
			FROM order_items oi
			LEFT JOIN products p ON oi.productId = p.id
			LEFT JOIN images i ON p.imageId = i.uid
			WHERE oi.orderId = ?
		`);
		
		const orders = rawOrders.map(o => {
			const items = getItems.all(o.id);
			return {
				id: o.id,
				total: o.total,
				status: o.status,
				createdAt: o.createdAt,
				items: items
			};
		});
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/orders/:id/cancel', authenticateUser, (req, res) => {
	try {
		const { id } = req.params;
		const order = db.prepare('SELECT * FROM orders WHERE id = ? AND email = ?').get(id, req.user.email);
		if (!order) {
			return res.status(404).json({ error: 'Order not found' });
		}
		if (order.status !== 'pending') {
			return res.status(400).json({ error: 'Cannot cancel an order that is already ' + order.status });
		}
		
		db.prepare('UPDATE orders SET status = "cancelled" WHERE id = ?').run(id);
		
		// Optionally restore stock
		const items = db.prepare('SELECT productId, quantity FROM order_items WHERE orderId = ?').all(id);
		const updateStock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
		const transaction = db.transaction(() => {
			for (const item of items) {
				updateStock.run(item.quantity, item.productId);
			}
		});
		transaction();

		res.json({ message: 'Order cancelled successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/auth/login', authLimiter, (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}
		
		if (email === 'admin@kalharam.example' && password === 'demo1234') {
			const token = jwt.sign({ name: 'Admin', email, role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
			return res.json({ token, message: 'Logged in successfully' });
		}
		
		const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
		}
		
		const isMatch = bcrypt.compareSync(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
		}
		
		const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
		return res.json({ token, message: 'Logged in successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/auth/signup', (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ error: 'Name, email, and password are required' });
		}
		if (password.length < 8) {
			return res.status(400).json({ error: 'Password must be at least 8 characters long' });
		}
		
		const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existingUser) {
			return res.status(400).json({ error: 'An account with this email already exists' });
		}
		
		const hashedPassword = bcrypt.hashSync(password, 10);
		const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
		const info = stmt.run(name, email, hashedPassword);
		
		const token = jwt.sign({ id: info.lastInsertRowid, name, email, role: 'user' }, JWT_SECRET, { expiresIn: '12h' });
		res.json({ token, message: 'Account created successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// --- Admin Endpoints (for App) ---

app.get('/api/admin/orders', (req, res) => {
	try {
		const rawOrders = db.prepare('SELECT id, customerName, email, phone, address, city, state, pin, total, status, createdAt FROM orders ORDER BY createdAt DESC').all();
		const getItems = db.prepare('SELECT productId, productName, quantity, price FROM order_items WHERE orderId = ?');
		
		// Map backend orders to app expected format
		const orders = rawOrders.flatMap(o => {
			const items = getItems.all(o.id);
			return items.map((item, index) => ({
				id: `${o.id}-${index}`, // composite ID for UI if needed, or just o.id
				orderId: o.id,
				customer: o.customerName,
				email: o.email,
				phone: o.phone,
				address: o.address,
				city: o.city,
				state: o.state,
				pin: o.pin,
				item: item.productName,
				productId: item.productId,
				qty: item.quantity,
				total: item.price * item.quantity,
				status: o.status === 'pending' ? 'new' : o.status,
				time: o.createdAt
			}));
		});
		
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.put('/api/admin/orders/:id/status', (req, res) => {
	try {
		const { status } = req.body;
		
		const transaction = db.transaction(() => {
			const order = db.prepare('SELECT status FROM orders WHERE id = ?').get(req.params.id);
			if (!order) throw new Error('Order not found');
			
			// If moving to cancelled, refund stock
			if (status === 'cancelled' && order.status !== 'cancelled') {
				const items = db.prepare('SELECT productId, quantity FROM order_items WHERE orderId = ?').all(req.params.id);
				const updateStock = db.prepare('UPDATE products SET stock = stock + ?, sold = MAX(0, sold - ?) WHERE id = ?');
				for (const item of items) {
					updateStock.run(item.quantity, item.quantity, item.productId);
				}
			}
			
			db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
		});
		
		transaction();
		res.json({ message: 'Order status updated' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/admin/products', (req, res) => {
	try {
		const products = db.prepare(`
			SELECT p.id, p.title as name, p.categoryId as category, p.subtitle as details, p.color, p.salePrice as price, p.mrp as offerPrice, 
				   p.stock, p.sold, p.demand, p.deadStockDays, p.createdAt, p.imageId, i.thumb_url as image, '#f4f4f5' as imageTone
			FROM products p 
			JOIN images i ON p.imageId = i.uid 
		`).all();
		
		for (const p of products) {
			const gallery = db.prepare('SELECT imageId FROM product_gallery WHERE productId = ? ORDER BY displayOrder ASC').all(p.id);
			p.images = gallery.map(g => g.imageId);
		}
		
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/admin/tiles', (req, res) => {
	try {
		const tiles = db.prepare(`
			SELECT t.id, t.title, t.imageId, i.thumb_url as image
			FROM layout_tiles t
			LEFT JOIN images i ON t.imageId = i.uid
			ORDER BY t.id ASC
		`).all();
		const getCats = db.prepare('SELECT categoryId FROM layout_tile_categories WHERE tileId = ?');
		tiles.forEach(t => t.categoryIds = getCats.all(t.id).map(c => c.categoryId));
		res.json(tiles);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.put('/api/admin/tiles/:id', (req, res) => {
	try {
		const { title, imageId, categoryIds } = req.body;
		db.prepare('UPDATE layout_tiles SET title = ?, imageId = ? WHERE id = ?').run(
			title, imageId || null, req.params.id
		);
		db.prepare('DELETE FROM layout_tile_categories WHERE tileId = ?').run(req.params.id);
		const insertCat = db.prepare('INSERT INTO layout_tile_categories (tileId, categoryId) VALUES (?, ?)');
		for (const catId of categoryIds || []) {
			insertCat.run(req.params.id, catId);
		}
		relocateImage(imageId, safeFolder(`tile-${req.params.id}`), 'example');
		
		cleanOrphanImages();
		removeEmptyDirectories(UPLOADS_ROOT);
		res.json({ message: 'Tile updated successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.put('/api/admin/products/:id', (req, res) => {
	try {
		const id = req.params.id;
		const updates = req.body;
		
		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ error: 'No fields provided for update' });
		}

		// Enforce price sanity regardless of which field shape is sent
		const current = db.prepare('SELECT salePrice, mrp FROM products WHERE id = ?').get(id);
		let nextPrice = current?.salePrice ?? null;
		let nextOffer = current?.mrp ?? null;
		
		const allowedColumns = {
			title: 'title',
			subtitle: 'subtitle',
			categoryId: 'categoryId',
			color: 'color',
			salePrice: 'salePrice',
			mrp: 'mrp',
			stock: 'stock',
			sold: 'sold',
			demand: 'demand',
			deadStockDays: 'deadStockDays',
			imageId: 'imageId'
		};

		for (const [key, value] of Object.entries(updates)) {
			let dbCol = allowedColumns[key];
			if (dbCol === 'salePrice') nextPrice = value;
			if (dbCol === 'mrp') nextOffer = value;
		}
		
		if (nextPrice != null && nextOffer != null && Number(nextPrice) > Number(nextOffer)) {
			return res.status(400).json({ error: 'Sale price cannot be greater than MRP' });
		}

		// Dynamically construct SET clause
		const fields = [];
		const values = [];
		let galleryImages = null;
		
		for (const [key, value] of Object.entries(updates)) {
			if (key === 'galleryImages') {
				galleryImages = value;
				continue;
			}

			if (!(key in allowedColumns)) continue;
			
			const dbCol = allowedColumns[key];
			fields.push(`${dbCol} = ?`);
			values.push(value);
		}

		values.push(id);

		const oldProduct = db.prepare('SELECT categoryId FROM products WHERE id = ?').get(id);

		const transaction = db.transaction(() => {
			if (fields.length > 0) {
				const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
				db.prepare(query).run(...values);
			}

			if (Array.isArray(galleryImages)) {
				db.prepare('DELETE FROM product_gallery WHERE productId = ?').run(id);
				const insertGallery = db.prepare('INSERT OR IGNORE INTO product_gallery (productId, imageId, displayOrder) VALUES (?, ?, ?)');
				galleryImages.forEach((gImgId, index) => {
					if (gImgId) insertGallery.run(id, gImgId, index);
				});
			}
		});
		
		transaction();

		const product = db.prepare('SELECT id, categoryId, imageId FROM products WHERE id = ?').get(id);

		// If the product moved to another category, relocate its folder tree
		if (oldProduct && oldProduct.categoryId !== product.categoryId) {
			const oldFolder = `${safeFolder(oldProduct.categoryId)}/${safeFolder(product.id)}`;
			const newFolder = `${safeFolder(product.categoryId)}/${safeFolder(product.id)}`;
			const oldDir = path.join(UPLOADS_ROOT, oldFolder);
			const newDir = path.join(UPLOADS_ROOT, newFolder);
			if (fs.existsSync(oldDir) && !fs.existsSync(newDir)) {
				fs.renameSync(oldDir, newDir);
				rewriteImageUrlsPrefix(`/assets/uploads/${oldFolder}/`, `/assets/uploads/${newFolder}/`);
			}
		}

		// Relocate any staged/new images into the product's slug folder
		relocateProductImages(product);

		
		cleanOrphanImages();
		removeEmptyDirectories(UPLOADS_ROOT);
		res.json({ message: 'Product updated successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/admin/products', (req, res) => {
	try {
		const { id, title, subtitle, categoryId, color, stock, rating, mrp, salePrice, imageId, galleryImages } = req.body;

		if (salePrice != null && mrp != null && Number(salePrice) > Number(mrp)) {
			return res.status(400).json({ error: 'Sale price cannot be greater than MRP' });
		}
		
		const transaction = db.transaction(() => {
			const stmt = db.prepare(`
				INSERT INTO products (id, title, subtitle, categoryId, color, stock, rating, mrp, salePrice, imageId)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`);
			
			stmt.run(id, title, subtitle, categoryId, color || null, stock !== undefined ? stock : 10, rating || 4.5, mrp, salePrice, imageId);

			if (galleryImages && galleryImages.length > 0) {
				const insertGallery = db.prepare('INSERT INTO product_gallery (productId, imageId, displayOrder) VALUES (?, ?, ?)');
				// imageId is index 0. The rest are 1, 2, 3...
				insertGallery.run(id, imageId, 0);
				galleryImages.forEach((gImgId, index) => {
					if (gImgId !== imageId) {
						insertGallery.run(id, gImgId, index + 1);
					}
				});
			}
		});

		transaction();

		// Relocate staged uploads into the product's slug folder
		relocateProductImages(db.prepare('SELECT id, categoryId, imageId FROM products WHERE id = ?').get(id));

		res.json({ message: 'Product created successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/admin/images', (req, res) => {
	try {
		const images = db.prepare('SELECT uid, high_res_url, thumb_url, alt_text, type FROM images ORDER BY uid DESC').all();
		res.json(images);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/admin/images/upload', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No image file provided' });
		}

		const altText = req.body.alt_text || 'Uploaded Image';
		const imgType = req.body.type || 'general';
		const uid = 'img_' + crypto.randomBytes(8).toString('hex');
		const filename = `${uid}.webp`;

		const stagingDir = path.join(UPLOADS_ROOT, '_staging');
		ensureDir(stagingDir);
		const highresPath = path.join(stagingDir, filename);
		const thumbPath = path.join(stagingDir, `${uid}-thumb.webp`);

		// Convert to webp and save highres (max 1600x1600)
		await sharp(req.file.buffer)
			.resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 85 })
			.toFile(highresPath);

		// Convert to webp and save thumb (max 600x600)
		await sharp(req.file.buffer)
			.resize(600, 600, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 75 })
			.toFile(thumbPath);

		const highresUrl = `/assets/uploads/_staging/${filename}`;
		const thumbUrl = `/assets/uploads/_staging/${uid}-thumb.webp`;

		db.prepare('INSERT INTO images (uid, high_res_url, thumb_url, alt_text, type) VALUES (?, ?, ?, ?, ?)')
		  .run(uid, highresUrl, thumbUrl, altText, imgType);

		res.json({ uid, high_res_url: highresUrl, thumb_url: thumbUrl, alt_text: altText, type: imgType });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.delete('/api/admin/images/:uid', (req, res) => {
	try {
		const uid = req.params.uid;
		
		// Unset this image from categories and tiles first if it is set
		db.prepare("UPDATE categories SET imageId = '' WHERE imageId = ?").run(uid);
		db.prepare("UPDATE layout_tiles SET imageId = NULL WHERE imageId = ?").run(uid);

		const prodCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE imageId = ?').get(uid).count;
		const galCount = db.prepare('SELECT COUNT(*) as count FROM product_gallery WHERE imageId = ?').get(uid).count;
		const tileCount = db.prepare('SELECT COUNT(*) as count FROM layout_tiles WHERE imageId = ?').get(uid).count;

		if (prodCount > 0 || galCount > 0 || tileCount > 0) {
			return res.status(400).json({ error: 'Cannot delete image that is currently in use by products or tiles.' });
		}

		const img = db.prepare('SELECT uid, high_res_url, thumb_url, alt_text, type FROM images WHERE uid = ?').get(uid);
		if (!img) {
			return res.status(404).json({ error: 'Image not found' });
		}

		db.prepare('DELETE FROM images WHERE uid = ?').run(uid);

		const highresDisk = path.join(__dirname, '../web/static', img.high_res_url);
		const thumbDisk = path.join(__dirname, '../web/static', img.thumb_url);

		if (fs.existsSync(highresDisk)) fs.unlinkSync(highresDisk);
		if (fs.existsSync(thumbDisk)) fs.unlinkSync(thumbDisk);

		res.json({ message: 'Image deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/admin/raw-categories', (req, res) => {
	try {
		const categories = db.prepare('SELECT id, name, imageId FROM categories').all();
		res.json(categories);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/admin/categories', (req, res) => {
	try {
		const { id, name, imageId } = req.body;
		db.prepare('INSERT INTO categories (id, name, imageId) VALUES (?, ?, ?)').run(id, name, imageId);
		relocateImage(imageId, safeFolder(id), 'example');
		res.json({ message: 'Category created' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.put('/api/admin/categories/:id', (req, res) => {
	try {
		const { name, imageId, id: newId } = req.body;
		const oldId = req.params.id;

		const oldCat = db.prepare('SELECT id, imageId FROM categories WHERE id = ?').get(oldId);
		if (!oldCat) return res.status(404).json({ error: 'Category not found' });
		const oldImageId = oldCat?.imageId;

		// Resolve the final id: the front-end auto-generates a slug from the name,
		// so editing the name may also change the id (slug).
		const finalId = newId && newId !== oldId ? newId : oldId;

		if (finalId !== oldId) {
			const conflict = db.prepare('SELECT id FROM categories WHERE id = ?').get(finalId);
			if (conflict) {
				return res.status(400).json({ error: 'A category with this ID already exists' });
			}
			if (!/^[a-z0-9-]+$/.test(finalId)) {
				return res.status(400).json({ error: 'Category ID may only contain lowercase letters, numbers and hyphens' });
			}
		}

		const transaction = db.transaction(() => {
			if (finalId !== oldId) {
				// Insert a new row under the new id, repoint all references, then drop the old row.
				// (Doing it this way keeps the SQLite foreign-key constraints satisfied.)
				db.prepare('INSERT INTO categories (id, name, imageId) VALUES (?, ?, ?)').run(finalId, name, imageId);
				db.prepare('UPDATE products SET categoryId = ? WHERE categoryId = ?').run(finalId, oldId);

				// Repoint layout tiles that reference the old category id
				db.prepare('INSERT OR IGNORE INTO layout_tile_categories (tileId, categoryId) SELECT tileId, ? FROM layout_tile_categories WHERE categoryId = ?').run(finalId, oldId);
				db.prepare('DELETE FROM layout_tile_categories WHERE categoryId = ?').run(oldId);

				db.prepare('DELETE FROM categories WHERE id = ?').run(oldId);
			} else {
				db.prepare('UPDATE categories SET name = ?, imageId = ? WHERE id = ?').run(name, imageId, oldId);
			}
		});

		transaction();

		// If the slug changed, move the whole slug folder (category cover plus every
		// nested product folder) so nothing is orphaned, then point image URLs at it.
		if (finalId !== oldId) {
			const oldFolder = safeFolder(oldId);
			const newFolder = safeFolder(finalId);
			const oldDir = path.join(UPLOADS_ROOT, oldFolder);
			const newDir = path.join(UPLOADS_ROOT, newFolder);
			if (fs.existsSync(oldDir) && !fs.existsSync(newDir)) {
				fs.renameSync(oldDir, newDir);
				rewriteImageUrlsPrefix(`/assets/uploads/${oldFolder}/`, `/assets/uploads/${newFolder}/`);
			}
		}

		// If oldImageId was replaced or removed, clean it up if no longer used anywhere
		if (oldImageId && oldImageId !== imageId) {
			cleanOrphanImages();
			removeEmptyDirectories(UPLOADS_ROOT);
		}

		// Move the (possibly new) cover into its slug folder
		relocateImage(imageId, safeFolder(finalId), 'example');

		res.json({ message: 'Category updated', id: finalId });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.delete('/api/admin/categories/:id', (req, res) => {
	try {
		const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE categoryId = ?').get(req.params.id);
		if (count.count > 0) {
			return res.status(400).json({ error: 'Cannot delete category with existing products.' });
		}

		const cat = db.prepare('SELECT imageId FROM categories WHERE id = ?').get(req.params.id);
		const imageId = cat?.imageId;

		db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);

		// Clean up category image if no longer used anywhere else
		if (imageId) {
			cleanOrphanImages();
			removeEmptyDirectories(UPLOADS_ROOT);
		}

		res.json({ message: 'Category deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

const server = app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`\nError: port ${PORT} is already in use.`);
		console.error('Another backend instance is already running (check for a leftover terminal/`node server.js` process).');
		console.error(`Stop it first, then start again, or use a different port:\n  PORT=3001 node server.js`);
		process.exit(1);
	}
	console.error('Backend failed to start:', err);
	process.exit(1);
});
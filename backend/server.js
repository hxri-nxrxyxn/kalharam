import express from 'express';
import cors from 'cors';
import db from './db.js';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// --- Public Endpoints (for Web) ---

app.get('/api/tiles', (req, res) => {
	try {
		const tiles = db.prepare(`
			SELECT t.id, t.title as name, i.thumb_url as image, t.categoryIds
			FROM layout_tiles t
			LEFT JOIN images i ON t.imageId = i.uid
			ORDER BY t.id ASC
		`).all();
		
		// parse JSON
		tiles.forEach(t => {
			t.id = String(t.id); // Web expects string ID
			t.categoryIds = JSON.parse(t.categoryIds || '[]');
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
			SELECT p.id, p.title, p.subtitle, p.categoryId, p.color, p.rating, p.mrp, p.salePrice, i.thumb_url as image 
			FROM products p 
			JOIN images i ON p.imageId = i.uid 
			WHERE 1=1
		`;
		const params = [];

		if (categoryId) {
			query += ' AND p.categoryId = ?';
			params.push(categoryId);
		}

		if (tileId) {
			const tile = db.prepare('SELECT categoryIds FROM layout_tiles WHERE id = ?').get(tileId);
			if (tile) {
				const cats = JSON.parse(tile.categoryIds || '[]');
				if (cats.length > 0) {
					const placeholders = cats.map(() => '?').join(',');
					query += ` AND p.categoryId IN (${placeholders})`;
					params.push(...cats);
				} else {
					// No categories assigned to this tile, return empty
					query += ' AND 1=0';
				}
			}
		}

		if (q) {
			query += ' AND (p.title LIKE ? OR p.subtitle LIKE ?)';
			params.push(`%${q}%`, `%${q}%`);
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
			SELECT p.id, p.title, p.subtitle, p.categoryId, p.color, p.rating, p.mrp, p.salePrice, i.thumb_url as image, i.high_res_url as highResImage 
			FROM products p 
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
		const { customerName, email, phone, address, city, state, pin, total, items } = req.body;
		
		const insertOrder = db.prepare(`
			INSERT INTO orders (customerName, email, phone, address, city, state, pin, total, items)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);
		
		const updateStock = db.prepare(`
			UPDATE products 
			SET stock = MAX(0, stock - ?), sold = sold + ? 
			WHERE id = ?
		`);

		const transaction = db.transaction(() => {
			const result = insertOrder.run(customerName, email, phone, address, city, state, pin, total, JSON.stringify(items));
			
			// Deduct stock for each item
			for (const item of items) {
				updateStock.run(item.quantity, item.quantity, item.id);
			}
			
			return result.lastInsertRowid;
		});

		const orderId = transaction();
		res.json({ id: orderId, message: 'Order created successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// --- Admin Endpoints (for App) ---

app.get('/api/admin/orders', (req, res) => {
	try {
		const rawOrders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
		
		// Map backend orders to app expected format
		const orders = rawOrders.flatMap(o => {
			const items = JSON.parse(o.items || '[]');
			return items.map((item, index) => ({
				id: `${o.id}-${index}`, // composite ID for UI if needed, or just o.id
				orderId: o.id,
				customer: o.customerName,
				item: item.title,
				productId: item.id,
				qty: item.quantity,
				total: item.price * item.quantity,
				status: o.status,
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
			const order = db.prepare('SELECT items, status FROM orders WHERE id = ?').get(req.params.id);
			if (!order) throw new Error('Order not found');
			
			// If moving to cancelled, refund stock
			if (status === 'cancelled' && order.status !== 'cancelled') {
				const items = JSON.parse(order.items || '[]');
				const updateStock = db.prepare('UPDATE products SET stock = stock + ?, sold = MAX(0, sold - ?) WHERE id = ?');
				for (const item of items) {
					updateStock.run(item.quantity, item.quantity, item.id);
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
				   p.stock, p.sold, p.demand, p.deadStockDays, p.createdAt, i.thumb_url as image, '#f4f4f5' as imageTone
			FROM products p 
			JOIN images i ON p.imageId = i.uid 
		`).all();
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/admin/tiles', (req, res) => {
	try {
		const tiles = db.prepare(`
			SELECT t.id, t.title, t.imageId, t.categoryIds, i.thumb_url as image
			FROM layout_tiles t
			LEFT JOIN images i ON t.imageId = i.uid
			ORDER BY t.id ASC
		`).all();
		tiles.forEach(t => t.categoryIds = JSON.parse(t.categoryIds || '[]'));
		res.json(tiles);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.put('/api/admin/tiles/:id', (req, res) => {
	try {
		const { title, imageId, categoryIds } = req.body;
		db.prepare('UPDATE layout_tiles SET title = ?, imageId = ?, categoryIds = ? WHERE id = ?').run(
			title, imageId || null, JSON.stringify(categoryIds || []), req.params.id
		);
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

		// Dynamically construct SET clause
		const fields = [];
		const values = [];
		
		for (const [key, value] of Object.entries(updates)) {
			// map front-end keys to DB columns
			let dbCol = key;
			if (key === 'name') dbCol = 'title';
			if (key === 'details') dbCol = 'subtitle';
			if (key === 'category') dbCol = 'categoryId';
			if (key === 'price') dbCol = 'salePrice';
			if (key === 'offerPrice') dbCol = 'mrp'; // In current mock, MRP acts as original price, salePrice is actual price
			// 'stock', 'sold', 'demand', 'deadStockDays', 'imageId' match exactly

			fields.push(`${dbCol} = ?`);
			values.push(value);
		}

		values.push(id);
		
		const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
		db.prepare(query).run(...values);
		
		res.json({ message: 'Product updated successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post('/api/admin/products', (req, res) => {
	try {
		const { id, title, subtitle, categoryId, color, rating, mrp, salePrice, imageId, galleryImages } = req.body;
		
		const transaction = db.transaction(() => {
			const stmt = db.prepare(`
				INSERT INTO products (id, title, subtitle, categoryId, color, rating, mrp, salePrice, imageId)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`);
			
			stmt.run(id, title, subtitle, categoryId, color || null, rating || 4.5, mrp, salePrice, imageId);

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
		res.json({ message: 'Product created successfully' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get('/api/admin/images', (req, res) => {
	try {
		const images = db.prepare('SELECT * FROM images ORDER BY uid DESC').all();
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

		const highresPath = path.join(__dirname, '../web/static/assets/uploads/highres', filename);
		const thumbPath = path.join(__dirname, '../web/static/assets/uploads/thumbnails', filename);

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

		const highresUrl = `/assets/uploads/highres/${filename}`;
		const thumbUrl = `/assets/uploads/thumbnails/${filename}`;

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
		
		const catCount = db.prepare('SELECT COUNT(*) as count FROM categories WHERE imageId = ?').get(uid).count;
		const prodCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE imageId = ?').get(uid).count;
		const galCount = db.prepare('SELECT COUNT(*) as count FROM product_gallery WHERE imageId = ?').get(uid).count;
		const tileCount = db.prepare('SELECT COUNT(*) as count FROM layout_tiles WHERE imageId = ?').get(uid).count;

		if (catCount > 0 || prodCount > 0 || galCount > 0 || tileCount > 0) {
			return res.status(400).json({ error: 'Cannot delete image that is currently in use.' });
		}

		const img = db.prepare('SELECT * FROM images WHERE uid = ?').get(uid);
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
		res.json({ message: 'Category created' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.put('/api/admin/categories/:id', (req, res) => {
	try {
		const { name, imageId } = req.body;
		db.prepare('UPDATE categories SET name = ?, imageId = ? WHERE id = ?').run(name, imageId, req.params.id);
		res.json({ message: 'Category updated' });
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
		db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
		res.json({ message: 'Category deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
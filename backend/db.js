import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_PATH || join(__dirname, 'kalharam.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
	CREATE TABLE IF NOT EXISTS images (
		uid TEXT PRIMARY KEY,
		high_res_url TEXT NOT NULL,
		thumb_url TEXT NOT NULL,
		alt_text TEXT,
		type TEXT
	);

	CREATE TABLE IF NOT EXISTS categories (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		imageId TEXT NOT NULL,
		FOREIGN KEY(imageId) REFERENCES images(uid)
	);

	CREATE TABLE IF NOT EXISTS products (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		subtitle TEXT NOT NULL,
		categoryId TEXT NOT NULL,
		color TEXT,
		rating REAL NOT NULL,
		mrp REAL NOT NULL,
		salePrice REAL NOT NULL,
		imageId TEXT NOT NULL, -- Primary Image
		stock INTEGER DEFAULT 10,
		sold INTEGER DEFAULT 0,
		demand INTEGER DEFAULT 0,
		deadStockDays INTEGER,
		createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(categoryId) REFERENCES categories(id),
		FOREIGN KEY(imageId) REFERENCES images(uid)
	);

	CREATE TABLE IF NOT EXISTS product_gallery (
		productId TEXT NOT NULL,
		imageId TEXT NOT NULL,
		displayOrder INTEGER DEFAULT 0,
		PRIMARY KEY (productId, imageId),
		FOREIGN KEY(productId) REFERENCES products(id),
		FOREIGN KEY(imageId) REFERENCES images(uid)
	);

	CREATE TABLE IF NOT EXISTS layout_tiles (
		id INTEGER PRIMARY KEY CHECK (id >= 1 AND id <= 18),
		title TEXT NOT NULL,
		imageId TEXT,
		FOREIGN KEY(imageId) REFERENCES images(uid)
	);

	CREATE TABLE IF NOT EXISTS layout_tile_categories (
		tileId INTEGER NOT NULL,
		categoryId TEXT NOT NULL,
		PRIMARY KEY (tileId, categoryId),
		FOREIGN KEY(tileId) REFERENCES layout_tiles(id) ON DELETE CASCADE,
		FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS orders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		customerName TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT NOT NULL,
		address TEXT NOT NULL,
		city TEXT NOT NULL,
		state TEXT NOT NULL,
		pin TEXT NOT NULL,
		total REAL NOT NULL,
		status TEXT DEFAULT 'pending',
		createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS order_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		orderId INTEGER NOT NULL,
		productId TEXT NOT NULL,
		productName TEXT NOT NULL,
		quantity INTEGER NOT NULL,
		price REAL NOT NULL,
		FOREIGN KEY(orderId) REFERENCES orders(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		role TEXT DEFAULT 'user',
		createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS banners (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		desktopImageId TEXT NOT NULL,
		mobileImageId TEXT,
		linkUrl TEXT,
		displayOrder INTEGER DEFAULT 0,
		isActive INTEGER DEFAULT 1,
		createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(desktopImageId) REFERENCES images(uid),
		FOREIGN KEY(mobileImageId) REFERENCES images(uid)
	);
`);

// Migration logic removed

// Simple seeding function if tables are empty
function seedData() {
	const tileCount = db.prepare('SELECT COUNT(*) as count FROM layout_tiles').get();
	if (tileCount.count < 18) {
		const insertTile = db.prepare('INSERT OR IGNORE INTO layout_tiles (id, title, imageId) VALUES (?, ?, NULL)');
		for (let i = 1; i <= 18; i++) {
			insertTile.run(i, `Tile ${i}`);
		}
	}

	const bannerCount = db.prepare('SELECT COUNT(*) as count FROM banners').get();
	if (bannerCount.count === 0) {
		// Ensure default images exist in images table
		const insertImg = db.prepare('INSERT OR IGNORE INTO images (uid, high_res_url, thumb_url, alt_text, type) VALUES (?, ?, ?, ?, ?)');
		insertImg.run('img_banner_1_desktop', '/assets/types/banner-1.webp', '/assets/types/banner-1.webp', 'Festive Silk Collection', 'banner');
		insertImg.run('img_banner_1_mobile', '/assets/types/mobile-banner-1.webp', '/assets/types/mobile-banner-1.webp', 'Festive Silk Collection Mobile', 'banner');
		insertImg.run('img_banner_2_desktop', '/assets/types/banner-2.webp', '/assets/types/banner-2.webp', 'Exclusive Handloom Sarees', 'banner');
		insertImg.run('img_banner_2_mobile', '/assets/types/mobile-banner-2.webp', '/assets/types/mobile-banner-2.webp', 'Exclusive Handloom Sarees Mobile', 'banner');

		const insertBanner = db.prepare('INSERT INTO banners (title, desktopImageId, mobileImageId, linkUrl, displayOrder, isActive) VALUES (?, ?, ?, ?, ?, ?)');
		insertBanner.run('Festive Silk Collection', 'img_banner_1_desktop', 'img_banner_1_mobile', '', 1, 1);
		insertBanner.run('Exclusive Handloom Sarees', 'img_banner_2_desktop', 'img_banner_2_mobile', '', 2, 1);
	}

	const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
	if (catCount.count > 0) return; // DB has data already
	
	console.log('Database initialized (Empty).');
}

seedData();

export default db;
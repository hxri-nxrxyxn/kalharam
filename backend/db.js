import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'kalharam.db');
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
		categoryIds TEXT NOT NULL DEFAULT '[]', -- JSON array of category IDs this tile pulls from
		FOREIGN KEY(imageId) REFERENCES images(uid)
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
		items TEXT NOT NULL, -- JSON string of cart items
		status TEXT DEFAULT 'pending',
		createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
	);
`);

// Migration helper to expand layout_tiles limit from 8 to 18 if needed
try {
	const tableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='layout_tiles'").get()?.sql;
	if (tableSql && tableSql.includes('<= 8')) {
		db.exec(`
			CREATE TABLE layout_tiles_new (
				id INTEGER PRIMARY KEY CHECK (id >= 1 AND id <= 18),
				title TEXT NOT NULL,
				imageId TEXT,
				categoryIds TEXT NOT NULL DEFAULT '[]',
				FOREIGN KEY(imageId) REFERENCES images(uid)
			);
			INSERT INTO layout_tiles_new SELECT * FROM layout_tiles;
			DROP TABLE layout_tiles;
			ALTER TABLE layout_tiles_new RENAME TO layout_tiles;
		`);
	}
} catch (e) {
	// Table already updated or fresh
}

// Simple seeding function if tables are empty
function seedData() {
	const tileCount = db.prepare('SELECT COUNT(*) as count FROM layout_tiles').get();
	if (tileCount.count < 18) {
		const insertTile = db.prepare('INSERT OR IGNORE INTO layout_tiles (id, title, imageId, categoryIds) VALUES (?, ?, NULL, ?)');
		for (let i = 1; i <= 18; i++) {
			insertTile.run(i, `Tile ${i}`, '[]');
		}
	}

	const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
	if (catCount.count > 0) return; // DB has data already
	
	console.log('Database initialized (Empty).');
}

seedData();

export default db;
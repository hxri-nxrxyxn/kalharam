// One-time migration: moves uploads from the flat highres/ + thumbnails/ layout
// into the slug-based tree (categories/<slug>/..., nested products, tile-N/).
// Idempotent: images already on the new layout are left untouched.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_ROOT = path.join(__dirname, '../web/static/assets/uploads');
const WEB_STATIC = path.join(__dirname, '../web/static');

function safeFolder(name) {
	const clean = String(name || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)+/g, '');
	if (!clean || clean === '.' || clean === '..') throw new Error(`Invalid folder slug: ${name}`);
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

function relocateImage(uid, targetDir, base) {
	const img = db.prepare('SELECT * FROM images WHERE uid = ?').get(uid);
	if (!img) return;

	const highName = `${base}.webp`;
	const thumbName = `${base}-thumb.webp`;
	const highTarget = path.join(UPLOADS_ROOT, targetDir, highName);
	const thumbTarget = path.join(UPLOADS_ROOT, targetDir, thumbName);

	// Old layout files live under /assets/uploads/highres|thumbnails/<uid>.webp
	const highSrc = path.join(WEB_STATIC, img.high_res_url);
	const thumbSrc = path.join(WEB_STATIC, img.thumb_url);
	moveFileSync(highSrc, highTarget);
	moveFileSync(thumbSrc, thumbTarget);

	const highUrl = `/assets/uploads/${targetDir}/${highName}`;
	const thumbUrl = `/assets/uploads/${targetDir}/${thumbName}`;
	if (img.high_res_url !== highUrl || img.thumb_url !== thumbUrl) {
		db.prepare('UPDATE images SET high_res_url = ?, thumb_url = ? WHERE uid = ?').run(highUrl, thumbUrl, uid);
	}
	return { from: img.high_res_url, to: highUrl };
}

function isLegacy(img) {
	return img.high_res_url.startsWith('/assets/uploads/highres/');
}

// Resolve where an image belongs based on its usages.
function targetFor(uid) {
	const cat = db.prepare('SELECT id FROM categories WHERE imageId = ?').get(uid);
	if (cat) {
		return { dir: safeFolder(cat.id), base: 'example' };
	}

	const tile = db.prepare('SELECT id FROM layout_tiles WHERE imageId = ?').get(uid);
	if (tile) {
		return { dir: safeFolder(`tile-${tile.id}`), base: 'example' };
	}

	const prod = db.prepare('SELECT id, categoryId, imageId FROM products WHERE imageId = ?').get(uid);
	if (prod) {
		return { dir: `${safeFolder(prod.categoryId)}/${safeFolder(prod.id)}`, base: 'example' };
	}

	const gal = db.prepare('SELECT productId, imageId FROM product_gallery WHERE imageId = ?').get(uid);
	if (gal) {
		const p = db.prepare('SELECT id, categoryId FROM products WHERE id = ?').get(gal.productId);
		if (p) {
			return { dir: `${safeFolder(p.categoryId)}/${safeFolder(p.id)}/listing`, base: uid };
		}
	}

	return { dir: '_general', base: uid };
}

const images = db.prepare('SELECT * FROM images ORDER BY uid ASC').all();
let moved = 0;
const warnings = [];

for (const img of images) {
	if (!isLegacy(img)) continue;
	const { dir, base } = targetFor(img.uid);
	if (dir === '_general') warnings.push(`Image ${img.uid} has no owning entity — moved to _general/`);
	const res = relocateImage(img.uid, dir, base);
	if (res) {
		moved += 1;
		console.log(`${img.uid}: ${res.from} -> ${res.to}`);
	}
}

// Delete any leftover files in the old flat folders (orphans not referenced by the DB)
let orphans = 0;
for (const sub of ['highres', 'thumbnails']) {
	const dir = path.join(UPLOADS_ROOT, sub);
	if (!fs.existsSync(dir)) continue;
	for (const file of fs.readdirSync(dir)) {
		const full = path.join(dir, file);
		fs.unlinkSync(full);
		orphans += 1;
		console.log(`deleted orphan: uploads/${sub}/${file}`);
	}
	fs.rmdirSync(dir);
}

console.log(`\nMigrated ${moved} image(s), removed ${orphans} orphan file(s).`);
if (warnings.length) {
	console.log('\nWarnings:');
	warnings.forEach((w) => console.log(`  - ${w}`));
}
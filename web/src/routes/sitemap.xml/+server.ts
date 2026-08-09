import { getCategories, getProducts } from '$lib/data';

export const prerender = true;

export async function GET({ fetch }) {
	const siteUrl = 'https://kalharam.com';
	
	const categories = await getCategories(fetch);
	const categoryUrls = categories
		.map(
			(cat) => `
	<url>
		<loc>${siteUrl}/category/${cat.id}</loc>
		<changefreq>daily</changefreq>
		<priority>0.8</priority>
	</url>`
		)
		.join('');

	const products = await getProducts({}, fetch);
	const productUrls = products
		.map(
			(product) => `
	<url>
		<loc>${siteUrl}/product/${product.id}</loc>
		<changefreq>weekly</changefreq>
		<priority>0.7</priority>
	</url>`
		)
		.join('');

	const staticUrls = `
	<url>
		<loc>${siteUrl}/signin</loc>
		<changefreq>monthly</changefreq>
		<priority>0.5</priority>
	</url>
	<url>
		<loc>${siteUrl}/signup</loc>
		<changefreq>monthly</changefreq>
		<priority>0.5</priority>
	</url>
	<url>
		<loc>${siteUrl}/support</loc>
		<changefreq>monthly</changefreq>
		<priority>0.5</priority>
	</url>
	<url>
		<loc>${siteUrl}/cart</loc>
		<changefreq>daily</changefreq>
		<priority>0.6</priority>
	</url>`;

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${siteUrl}</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>${staticUrls}${categoryUrls}${productUrls}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}

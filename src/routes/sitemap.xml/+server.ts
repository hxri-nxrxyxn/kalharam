import { categories } from '$lib/data';

export const prerender = true;

export async function GET() {
	const siteUrl = 'https://kalharam.com';
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

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${siteUrl}</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>${categoryUrls}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}

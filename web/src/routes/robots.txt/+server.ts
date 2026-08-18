export const prerender = true;

export async function GET() {
	const text = `User-agent: *
Allow: /

Sitemap: https://kalharam.com/sitemap.xml
`;
	return new Response(text.trim(), {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}

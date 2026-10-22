import type { HandleFetch } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const url = new URL(request.url);
	if (url.pathname.startsWith('/api')) {
		const backendUrl = env.INTERNAL_BACKEND_URL || env.BACKEND_URL || 'http://127.0.0.1:3000';
		const targetUrl = new URL(url.pathname + url.search, backendUrl);
		request = new Request(targetUrl.toString(), request);
	}
	return fetch(request);
};

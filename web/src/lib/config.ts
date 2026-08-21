export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL !== undefined
	? import.meta.env.VITE_BACKEND_URL
	: '';
export const API_BASE = `${BACKEND_URL}/api`;

export function imageUrl(url: string | null | undefined): string {
	if (!url) return '';
	return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

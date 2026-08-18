export const BACKEND_URL = 'http://203.57.85.59:3000';
export const API_BASE = `${BACKEND_URL}/api`;

export function imageUrl(url: string | null | undefined): string {
	if (!url) return '';
	return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}

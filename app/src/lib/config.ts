export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL !== undefined
	? import.meta.env.VITE_BACKEND_URL
	: '';
export const API_BASE = `${BACKEND_URL}/api`;

export function imageUrl(url: string | null | undefined): string {
	if (!url) return '';
	return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
}


export function apiFetch(url: string, options: RequestInit = {}) {
	const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
	if (typeof localStorage !== 'undefined') {
		const token = localStorage.getItem('admin_token');
		if (token) headers['Authorization'] = `Bearer ${token}`;
	}
	return fetch(url, { ...options, headers });
}

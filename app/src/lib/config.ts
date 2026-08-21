export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL !== undefined
	? import.meta.env.VITE_BACKEND_URL
	: '';
export const API_BASE = `${BACKEND_URL}/api`;

export function imageUrl(url: string | null | undefined): string {
	if (!url) return '';
	
	// Strip legacy hardcoded backend host prefixes (IPs/localhost)
	let cleanUrl = url.replace(/^http:\/\/(203\.57\.85\.59|localhost|127\.0\.0\.1)(:3000)?/, '');

	// If it's a non-backend external HTTP URL, upgrade to HTTPS if on HTTPS
	if (cleanUrl.startsWith('http:')) {
		if (typeof location !== 'undefined' && location.protocol === 'https:') {
			return cleanUrl.replace(/^http:/, 'https:');
		}
		return cleanUrl;
	}

	if (cleanUrl.startsWith('https:')) {
		return cleanUrl;
	}

	if (!cleanUrl.startsWith('/')) {
		cleanUrl = `/${cleanUrl}`;
	}

	return `${BACKEND_URL}${cleanUrl}`;
}


export function apiFetch(url: string, options: RequestInit = {}) {
	const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
	if (typeof localStorage !== 'undefined') {
		const token = localStorage.getItem('admin_token');
		if (token) headers['Authorization'] = `Bearer ${token}`;
	}
	return fetch(url, { ...options, headers });
}

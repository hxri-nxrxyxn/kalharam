import type { Category, Product, FilterOptions, BannerItem } from './types';
import { API_BASE, BACKEND_URL } from './config';

export { API_BASE, BACKEND_URL };

export async function getBanners(fetchFn: typeof fetch = fetch): Promise<BannerItem[]> {
	try {
		const res = await fetchFn(`${API_BASE}/banners`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch banners');
		return await res.json();
	} catch (error) {
		console.error('Error fetching banners:', error);
		return [];
	}
}

export async function getCategories(fetchFn: typeof fetch = fetch): Promise<Category[]> {
	try {
		const res = await fetchFn(`${API_BASE}/tiles`, { cache: 'no-store' }); // Fetch tiles instead of categories for UI slots
		if (!res.ok) throw new Error('Failed to fetch tiles');
		return await res.json();
	} catch (error) {
		console.error('Error fetching tiles:', error);
		return [];
	}
}

export async function getActualCategories(fetchFn: typeof fetch = fetch): Promise<{id: string, name: string}[]> {
	try {
		const res = await fetchFn(`${API_BASE}/categories`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch categories');
		return await res.json();
	} catch (error) {
		return [];
	}
}

export async function getProducts(options?: { categoryId?: string; tileId?: string; q?: string; limit?: number }, fetchFn: typeof fetch = fetch): Promise<Product[]> {
	try {
		const params = new URLSearchParams();
		if (options?.categoryId) params.append('categoryId', options.categoryId);
		if (options?.tileId) params.append('tileId', options.tileId);
		if (options?.q) params.append('q', options.q);
		if (options?.limit) params.append('limit', options.limit.toString());
		
		const res = await fetchFn(`${API_BASE}/products?${params.toString()}`, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to fetch products');
		return await res.json();
	} catch (error) {
		console.error('Error fetching products:', error);
		return [];
	}
}

export async function getProduct(id: string, fetchFn: typeof fetch = fetch): Promise<Product | null> {
	try {
		const res = await fetchFn(`${API_BASE}/products/${id}`, { cache: 'no-store' });
		if (!res.ok) return null;
		return await res.json();
	} catch (error) {
		console.error(`Error fetching product ${id}:`, error);
		return null;
	}
}

// Ensure backwards compatibility with old filter structure inside components
export interface FilterParams {
	searchQuery: string;
	sortBy: string;
	minPrice: string;
	maxPrice: string;
}

export function filterProducts(products: Product[], params: FilterParams): Product[] {
	let list = [...products];

	if (params.searchQuery.trim() !== '') {
		const query = params.searchQuery.toLowerCase().trim();
		list = list.filter(
			(p) =>
				p.title.toLowerCase().includes(query) ||
				p.subtitle.toLowerCase().includes(query) ||
				p.details.toLowerCase().includes(query)
		);
	}

	if (params.minPrice !== '' && !isNaN(Number(params.minPrice))) {
		list = list.filter((p) => p.salePrice >= Number(params.minPrice));
	}

	if (params.maxPrice !== '' && !isNaN(Number(params.maxPrice))) {
		list = list.filter((p) => p.salePrice <= Number(params.maxPrice));
	}

	if (params.sortBy === 'price-low') {
		list.sort((a, b) => a.salePrice - b.salePrice);
	} else if (params.sortBy === 'price-high') {
		list.sort((a, b) => b.salePrice - a.salePrice);
	} else if (params.sortBy === 'rating') {
		list.sort((a, b) => b.rating - a.rating);
	} else if (params.sortBy === 'name') {
		list.sort((a, b) => a.title.localeCompare(b.title));
	}

	return list;
}

export interface Category {
	id: string;
	name: string;
	image: string;
	categoryIds?: string[];
}

export interface GalleryImage {
	url: string;
	thumb_url: string;
	alt: string;
}

export interface Product {
	id: string;
	title: string;
	subtitle: string;
	categoryId: string;
	rating: number;
	mrp: number;
	salePrice: number;
	image: string;
	highResImage?: string;
	gallery?: GalleryImage[];
}

export interface FilterOptions {
	searchQuery: string;
	sortBy: string;
	minPrice: number | null;
	maxPrice: number | null;
}

export interface CartItem {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	rating: number;
	mrp: number;
	price: number;
	quantity: number;
}

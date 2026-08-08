import type { Category, Product } from './types';

export const categories: Category[] = [
	{
		id: 'mul-cotton',
		name: 'MUL COTTON',
		image: '/assets/types/mul-cotton/example.jpg'
	},
	{
		id: 'kanchi-cotton',
		name: 'KANCHI COTTON',
		image: '/assets/types/kanchi-cotton/example.jpg'
	},
	{
		id: 'set-saree-set-mundu',
		name: 'SET SAREE SET MUNDU',
		image: '/assets/types/set-saree-set-mundu/example.jpg'
	},
	{
		id: 'davani-half-saree',
		name: 'DAVANI HALF SAREE',
		image: '/assets/types/davani-half-saree/example.jpg'
	},
	{
		id: 'onam-collections',
		name: 'ONAM COLLECTIONS',
		image: '/assets/types/onam-collections/example.jpg'
	},
	{
		id: 'kalyani-cotton',
		name: 'KALYANI COTTON',
		image: '/assets/types/kalyani-cotton/example.jpg'
	},
	{
		id: 'narayan-peth',
		name: 'NARAYAN PETH',
		image: '/assets/types/narayan-peth/example.jpg'
	},
	{
		id: 'more',
		name: 'MORE',
		image: '/assets/types/more/example.jpg'
	}
];

const productNames = [
	'Charulatha',
	'Aadhya',
	'Mythili',
	'Devika',
	'Ananya',
	'Subhadra',
	'Meenakshi',
	'Vasundhara',
	'Janaki',
	'Bhairavi',
	'Kalyani',
	'Gayathri'
];

export function getProductsForCategory(categoryId: string): Product[] {
	const category = categories.find((c) => c.id === categoryId) || categories[0];

	return Array.from({ length: 12 }, (_, i) => {
		const index = i + 1;
		const name = productNames[i % productNames.length];
		const rating = (index % 3) + 3; // 3, 4, 5
		const mrp = 2500 + index * 100;
		const salePrice = 1999 + index * 90;

		return {
			id: `${category.id}-${index}`,
			title: name,
			subtitle: `${category.name.charAt(0) + category.name.slice(1).toLowerCase()} Saree`,
			categoryId: category.id,
			rating,
			mrp,
			salePrice,
			image: `/assets/types/${category.id}/listing/${index}.jpg`
		};
	});
}

export function getAllProducts(): Product[] {
	return categories.flatMap((cat) => getProductsForCategory(cat.id));
}

export function preloadAllImages(): void {
	if (typeof window === 'undefined') return;
	const allProducts = getAllProducts();
	allProducts.forEach((p) => {
		const img = new Image();
		img.src = p.image;
	});
}

if (typeof window !== 'undefined') {
	preloadAllImages();
}

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
				p.subtitle.toLowerCase().includes(query)
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

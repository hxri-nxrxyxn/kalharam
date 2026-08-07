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

function toTitleCase(str: string): string {
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function getProductsForCategory(categoryId: string): Product[] {
	const category = categories.find((c) => c.id === categoryId) || categories[0];

	const formattedCategoryName = toTitleCase(category.name);
	const subtitle = formattedCategoryName.toLowerCase().includes('saree') || formattedCategoryName.toLowerCase().includes('collections') || formattedCategoryName.toLowerCase().includes('more')
		? formattedCategoryName
		: `${formattedCategoryName} Saree`;

	return Array.from({ length: 12 }, (_, i) => {
		const index = i + 1;
		const name = productNames[i % productNames.length];
		const rating = (index % 3) + 3; // 3, 4, 5
		const mrp = 2500 + index * 100;
		const salePrice = 1999 + index * 90;

		return {
			id: `${category.id}-${index}`,
			title: name,
			subtitle,
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

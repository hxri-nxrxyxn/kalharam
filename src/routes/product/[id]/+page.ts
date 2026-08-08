import { error } from '@sveltejs/kit';
import { getProductById, getProductsForCategory } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const product = getProductById(params.id);

	if (!product) {
		error(404, 'Product not found');
	}

	const similarProducts = getProductsForCategory(product.categoryId)
		.filter((p) => p.id !== product.id)
		.slice(0, 5);

	return {
		product,
		similarProducts
	};
};

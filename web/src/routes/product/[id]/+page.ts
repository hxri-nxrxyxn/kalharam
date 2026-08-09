import { error } from '@sveltejs/kit';
import { getProduct, getProducts } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const product = await getProduct(params.id, fetch);

	if (!product) {
		error(404, 'Product not found');
	}

	const similarProductsResponse = await getProducts({ categoryId: product.categoryId, limit: 6 }, fetch);
	const similarProducts = similarProductsResponse
		.filter((p) => p.id !== product.id)
		.slice(0, 5);

	return {
		product,
		similarProducts
	};
};

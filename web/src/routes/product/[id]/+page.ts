import { error } from '@sveltejs/kit';
import { getProduct, getProducts } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const product = await getProduct(params.id, fetch);

	if (!product) {
		error(404, 'Product not found');
	}

	const NEEDED = 5;
	const similarProductsResponse = await getProducts({ categoryId: product.categoryId, limit: 6 }, fetch);
	let similarProducts = similarProductsResponse.filter((p) => p.id !== product.id);

	// If the category has too few products, fill up from the rest of the catalog
	if (similarProducts.length < NEEDED) {
		const extraResponse = await getProducts({ limit: 20 }, fetch);
		const extras = extraResponse.filter(
			(p) => p.id !== product.id && !similarProducts.some((s) => s.id === p.id)
		);
		similarProducts = [...similarProducts, ...extras];
	}

	return {
		product,
		similarProducts: similarProducts.slice(0, NEEDED)
	};
};

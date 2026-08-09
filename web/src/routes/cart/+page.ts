import { getProducts } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	// For now, let's just show 5 products as recommendations.
	// In a real app, this could be based on the user's cart content.
	const products = await getProducts({ limit: 5 }, fetch);

	return {
		recommendedProducts: products
	};
};

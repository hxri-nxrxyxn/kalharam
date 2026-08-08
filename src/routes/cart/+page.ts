import { getAllProducts } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	// For now, let's just show the first 5 products as recommendations.
	// In a real app, this could be based on the user's cart content.
	const recommendedProducts = getAllProducts().slice(0, 5);

	return {
		recommendedProducts
	};
};

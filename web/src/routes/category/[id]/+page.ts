import { redirect } from '@sveltejs/kit';
import { getCategories } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const categories = await getCategories(fetch);
	const category = categories.find((c) => c.id === params.id);
	
	if (!category) {
		redirect(307, '/');
	}
	
	// `params.id` here is actually the tile ID
	return {
		category
	};
};

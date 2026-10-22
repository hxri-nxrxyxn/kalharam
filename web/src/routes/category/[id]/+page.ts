import { redirect } from '@sveltejs/kit';
import { getCategories, getActualCategories } from '$lib/data';
import type { PageLoad } from './$types';
import type { Category } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
	const [tiles, actualCategories] = await Promise.all([
		getCategories(fetch),
		getActualCategories(fetch)
	]);

	// 1. Check direct tile match (e.g. /category/1)
	let matchingTile = tiles.find((c) => c.id === params.id);

	// 2. Check direct category match (e.g. /category/kanchi)
	const matchingCat = actualCategories.find((c) => c.id === params.id);

	// 3. Category assigned to a tile
	if (!matchingTile && matchingCat) {
		matchingTile = tiles.find((t) => t.categoryIds && t.categoryIds.includes(matchingCat.id));
	}

	if (!matchingTile && !matchingCat) {
		redirect(307, '/');
	}

	const category: Category = {
		id: params.id,
		name: matchingCat ? matchingCat.name : (matchingTile?.name || params.id),
		image: matchingCat?.image || matchingTile?.image || '',
		categoryIds: matchingCat ? [matchingCat.id] : (matchingTile?.categoryIds || [])
	};

	return {
		category
	};
};

import { redirect } from '@sveltejs/kit';
import { categories } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const isValid = categories.some((c) => c.id === params.id);
	if (!isValid) {
		redirect(307, '/');
	}
	return {};
};

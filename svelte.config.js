import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'ignore',
			entries: [
				'*',
				'/category/mul-cotton',
				'/category/kanchi-cotton',
				'/category/set-saree-set-mundu',
				'/category/davani-half-saree',
				'/category/onam-collections',
				'/category/kalyani-cotton',
				'/category/narayan-peth',
				'/category/more'
			]
		}
	}
};

export default config;

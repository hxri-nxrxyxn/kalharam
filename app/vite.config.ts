import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');
	const backendUrl = env.BACKEND_URL || 'http://localhost:3000';

	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				compilerOptions: {
					// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
					runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},
				adapter: adapter({
					pages: 'build',
					assets: 'build',
					fallback: 'index.html',
					precompress: false,
					strict: false
				})
			})
		],
		server: {
			port: 5174,
			host: true,
			proxy: {
				'/api': {
					target: backendUrl,
					changeOrigin: true
				},
				'/assets': {
					target: backendUrl,
					changeOrigin: true
				}
			}
		}
	};
});

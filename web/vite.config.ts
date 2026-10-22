import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');
	return {
		plugins: [sveltekit()],
		server: {
			port: 5173,
			host: true,
			proxy: {
				'/api': {
					target: env.BACKEND_URL || 'http://localhost:3000',
					changeOrigin: true
				}
			}
		}
	};
});

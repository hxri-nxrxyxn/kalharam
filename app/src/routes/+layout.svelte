<script lang="ts">
	import { onMount } from "svelte";
	import "./layout.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import { initSync, signIn, loadBackendData } from "$lib/stores/app.svelte";
	import { BACKEND_URL } from "$lib/config";
	let { children } = $props();

	function decodeToken(token: string) {
		try {
			return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
		} catch {
			return null;
		}
	}

	function isTokenValid(token: string) {
		const payload = decodeToken(token);
		if (!payload) return false;
		return !payload.exp || Date.now() / 1000 < payload.exp;
	}

	async function ensureAuth() {
		const stored = localStorage.getItem('admin_token');

		// If we already have a valid token, restore session from it
		if (stored && isTokenValid(stored)) {
			const payload = decodeToken(stored)!;
			signIn({ name: payload.name ?? 'Admin', email: payload.email, role: 'admin' });
			await loadBackendData();
			return;
		}

		// Otherwise silently fetch a fresh token using the hardcoded admin credentials
		try {
			const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: 'admin@kalharam.example', password: 'demo1234' })
			});
			if (res.ok) {
				const { token } = await res.json();
				localStorage.setItem('admin_token', token);
				const payload = decodeToken(token)!;
				signIn({ name: payload.name ?? 'Admin', email: payload.email, role: 'admin' });
				await loadBackendData();
			}
		} catch {
			// Backend unreachable — will retry on next action
		}
	}

	onMount(() => {
		ensureAuth();
		initSync();
	});
</script>

<svelte:head>
	<title>Kalharam · Boutique Admin</title>
	<link rel="icon" href="/logo.png" type="image/png" />
</svelte:head>

{@render children()}
<Toaster />

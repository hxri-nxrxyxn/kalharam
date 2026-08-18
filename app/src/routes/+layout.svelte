<script lang="ts">
	import { onMount } from "svelte";
	import "./layout.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import { initSync, signIn, loadBackendData } from "$lib/stores/app.svelte";
	let { children } = $props();

	onMount(() => {
		// Restore session from a previously stored token
		const token = localStorage.getItem('admin_token');
		if (token) {
			try {
				// JWT is base64url encoded — decode payload without a library
				const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
				const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
				if (!isExpired) {
					signIn({ name: payload.name ?? 'Admin', email: payload.email, role: 'admin' });
					loadBackendData();
				} else {
					// Token expired — clear it so the user is prompted to log in
					localStorage.removeItem('admin_token');
				}
			} catch {
				// Malformed token — clear it
				localStorage.removeItem('admin_token');
			}
		}

		initSync();
	});
</script>

<svelte:head>
	<title>Kalharam · Boutique Admin</title>
	<link rel="icon" href="/logo.png" type="image/png" />
</svelte:head>

{@render children()}
<Toaster />

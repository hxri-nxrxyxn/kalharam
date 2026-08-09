<script lang="ts">
	import { onMount } from "svelte";
	import "./layout.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import { initSync } from "$lib/stores/app.svelte";
	let { children } = $props();

	onMount(() => {
		initSync();
	});
</script>

<svelte:head>
	<title>Kalharam · Boutique Admin</title>
	<link rel="icon" href="/logo.png" type="image/png" />
</svelte:head>

{@render children()}
<Toaster />

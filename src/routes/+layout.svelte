<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/assets/filled-shapes/logo.svg" />
</svelte:head>

<Nav />

<main>
	{@render children()}
</main>

<style>
	main {
		margin: var(--spacing-lg) var(--spacing-xl);
		margin-top: calc(1.5 * var(--spacing-xl));
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		const lenis = new Lenis({
			autoRaf: true,
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			wheelMultiplier: 1.0,
			touchMultiplier: 1.5
		});

		return () => {
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/assets/filled-shapes/logo.svg" />
</svelte:head>

<Nav />

{@render children()}

<Footer />

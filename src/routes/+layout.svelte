<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Kalharam',
		url: 'https://kalharam.com',
		logo: 'https://kalharam.com/assets/filled-shapes/logo.svg',
		description:
			'Exclusive handloom saree collections including Mul Cotton, Kanchi Cotton, Set Saree, Davani Half Saree, Onam Collections, Kalyani Cotton, and Narayan Peth.'
	});

	onMount(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			wheelMultiplier: 1.0,
			touchMultiplier: 1.5
		});

		let rafId: number;
		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}
		rafId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/assets/filled-shapes/logo.svg" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta property="og:site_name" content="Kalharam" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />

	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<Nav />

{@render children()}

<Footer />

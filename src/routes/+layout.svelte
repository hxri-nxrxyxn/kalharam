<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import '../app.css';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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

	let lenis: Lenis;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			wheelMultiplier: 1.0,
			touchMultiplier: 1.5
		});

		lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove((time) => lenis.raf(time * 1000));
			lenis.destroy();
		};
	});

	afterNavigate(({ type }) => {
		if (type !== 'popstate') {
			if (lenis) {
				lenis.scrollTo(0, { immediate: true });
			} else {
				window.scrollTo(0, 0);
			}
		}
		
		// Refresh ScrollTrigger calculations after page navigation/layout shifts
		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 100);
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

<Toast />

<Footer />

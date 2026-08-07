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

		let isSnapping = false;

		lenis.on('scroll', (e: { scroll: number; direction: number }) => {
			if (isSnapping) return;

			const shoppingEl = document.querySelector('.shopping') as HTMLElement;
			if (!shoppingEl) return;

			const scrollY = e.scroll;
			const isScrollingDown = e.direction > 0;
			const shoppingRect = shoppingEl.getBoundingClientRect();

			const navOffset = 120;

			// When scrolling down near the top header, auto-snap glide to shopping section
			if (
				isScrollingDown &&
				scrollY > 20 &&
				scrollY < 300 &&
				shoppingRect.top > navOffset + 20
			) {
				isSnapping = true;
				lenis.scrollTo(shoppingEl, {
					offset: -navOffset,
					duration: 1.2,
					onComplete: () => {
						setTimeout(() => {
							isSnapping = false;
						}, 100);
					}
				});
			}
		});

		return () => {
			cancelAnimationFrame(rafId);
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

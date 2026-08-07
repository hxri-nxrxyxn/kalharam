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

		let isSnapping = false;

		lenis.on('scroll', (e: { scroll: number; direction: number }) => {
			if (isSnapping) return;

			const shoppingEl = document.querySelector('.shopping') as HTMLElement;
			if (!shoppingEl) return;

			const currentScroll = e.scroll;
			const isScrollingDown = e.direction > 0;
			const shoppingTop = shoppingEl.getBoundingClientRect().top;

			// When scrolling down from the top header, smoothly glide to the shopping section
			if (
				isScrollingDown &&
				currentScroll > 40 &&
				currentScroll < 350 &&
				shoppingTop > 50 &&
				shoppingTop < window.innerHeight
			) {
				isSnapping = true;
				lenis.scrollTo(shoppingEl, {
					offset: -100,
					duration: 1.0,
					onComplete: () => {
						setTimeout(() => {
							isSnapping = false;
						}, 200);
					}
				});
			}
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

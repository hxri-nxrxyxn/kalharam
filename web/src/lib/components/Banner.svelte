<script lang="ts">
	import { onMount } from 'svelte';

	const desktopBanners = [
		'/assets/types/banner-1.webp',
		'/assets/types/banner-2.webp'
	];

	const mobileBanners = [
		'/assets/types/mobile-banner-1.webp',
		'/assets/types/mobile-banner-2.webp'
	];

	let isMobile = $state(false);
	let currentIndex = $state(0);
	let banners = $derived(isMobile ? mobileBanners : desktopBanners);

	onMount(() => {
		const mql = window.matchMedia('(max-width: 768px)');
		isMobile = mql.matches;

		const onMediaChange = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
			currentIndex = 0;
		};
		mql.addEventListener('change', onMediaChange);

		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % banners.length;
		}, 5000);

		return () => {
			mql.removeEventListener('change', onMediaChange);
			clearInterval(interval);
		};
	});
</script>


<svelte:head>
	<link rel="preload" as="image" href="/assets/types/banner-1.webp" media="(min-width: 769px)" fetchpriority="high" />
	<link rel="preload" as="image" href="/assets/types/mobile-banner-1.webp" media="(max-width: 768px)" fetchpriority="high" />
</svelte:head>

<div class="banner-slider">
	{#each banners as banner, index (banner)}
		<div
			class={['slide', index === currentIndex && 'active']}
			style:background-image="url('{banner}')"
		></div>
	{/each}
</div>

<style>
	.banner-slider {
		position: relative;
		height: 70vh;
		width: 100%;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.banner-slider {
			height: 60vh;
		}
	}

	.slide {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		opacity: 0;
		transform: scale(1.02);
		transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
		pointer-events: none;
	}

	.slide.active {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}
</style>

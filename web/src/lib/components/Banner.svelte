<script lang="ts">
	import { onMount } from 'svelte';
	import { getBanners } from '$lib/data';
	import { imageUrl } from '$lib/config';
	import type { BannerItem } from '$lib/types';

	const defaultBanners: BannerItem[] = [
		{
			id: 1,
			title: 'Festive Silk Collection',
			desktopImageId: 'default-1',
			desktopImage: '/assets/types/banner-1.webp',
			mobileImage: '/assets/types/mobile-banner-1.webp',
			displayOrder: 1,
			isActive: 1,
			linkUrl: ''
		},
		{
			id: 2,
			title: 'Exclusive Handloom Sarees',
			desktopImageId: 'default-2',
			desktopImage: '/assets/types/banner-2.webp',
			mobileImage: '/assets/types/mobile-banner-2.webp',
			displayOrder: 2,
			isActive: 1,
			linkUrl: ''
		}
	];

	let dynamicBanners = $state<BannerItem[]>([]);
	let isMobile = $state(false);
	let currentIndex = $state(0);

	let activeBanners = $derived(
		dynamicBanners.length > 0 ? dynamicBanners : defaultBanners
	);

	function getBannerImage(banner: BannerItem, mobile: boolean): string {
		const raw = mobile && banner.mobileImage ? banner.mobileImage : banner.desktopImage;
		return imageUrl(raw);
	}

	onMount(() => {
		const mql = window.matchMedia('(max-width: 768px)');
		isMobile = mql.matches;

		const onMediaChange = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
			currentIndex = 0;
		};
		mql.addEventListener('change', onMediaChange);

		getBanners().then((items) => {
			if (items && items.length > 0) {
				dynamicBanners = items;
			}
		});

		const interval = setInterval(() => {
			if (activeBanners.length > 1) {
				currentIndex = (currentIndex + 1) % activeBanners.length;
			}
		}, 5000);

		return () => {
			mql.removeEventListener('change', onMediaChange);
			clearInterval(interval);
		};
	});
</script>

<svelte:head>
	{#if activeBanners.length > 0}
		<link rel="preload" as="image" href={getBannerImage(activeBanners[0], false)} media="(min-width: 769px)" fetchpriority="high" />
		<link rel="preload" as="image" href={getBannerImage(activeBanners[0], true)} media="(max-width: 768px)" fetchpriority="high" />
	{/if}
</svelte:head>

<div class="banner-slider">
	{#each activeBanners as banner, index (banner.id)}
		{@const bgUrl = getBannerImage(banner, isMobile)}
		{#if banner.linkUrl}
			<a
				href={banner.linkUrl}
				class={['slide', index === currentIndex && 'active']}
				style:background-image="url('{bgUrl}')"
				aria-label={banner.title || `Banner ${index + 1}`}
			></a>
		{:else}
			<div
				class={['slide', index === currentIndex && 'active']}
				style:background-image="url('{bgUrl}')"
				role="img"
				aria-label={banner.title || `Banner ${index + 1}`}
			></div>
		{/if}
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
		display: block;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		opacity: 0;
		transform: scale(1.02);
		transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
		pointer-events: none;
		text-decoration: none;
	}

	.slide.active {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';

	const banners = [
		'/assets/types/banner-1.png',
		'/assets/types/banner-2.png'
	];

	let currentIndex = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % banners.length;
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="banner-slider">
	{#each banners as banner, index (banner)}
		<div
			class="slide {index === currentIndex ? 'active' : ''}"
			style="background-image: url('{banner}')"
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
			height: 40vh;
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

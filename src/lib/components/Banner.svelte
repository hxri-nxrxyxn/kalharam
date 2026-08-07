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
		}, 2000);

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

	<div class="dots">
		{#each banners as _, index (index)}
			<button
				type="button"
				class="dot {index === currentIndex ? 'active' : ''}"
				onclick={() => (currentIndex = index)}
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>
</div>

<style>
	.banner-slider {
		position: relative;
		height: 70vh;
		width: 100%;
		overflow: hidden;
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

	.dots {
		position: absolute;
		bottom: var(--spacing-md);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: var(--spacing-sm);
		z-index: 10;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid var(--color-surface);
		background-color: rgba(255, 255, 255, 0.4);
		cursor: url('/assets/filled-shapes/cursor.svg') 0 0, pointer;
		padding: 0;
		transition: background-color 0.3s ease, transform 0.3s ease;
	}

	.dot.active {
		background-color: var(--color-surface);
		transform: scale(1.2);
	}
</style>

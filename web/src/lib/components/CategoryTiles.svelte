<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Category } from '$lib/types';
	import { imageUrl } from '$lib/config';
	import { gsap } from 'gsap';

	interface Props {
		categories: Category[];
		selectedCategoryId: string;
	}

	let { categories, selectedCategoryId }: Props = $props();
	let viewportRef = $state<HTMLElement>();
	let trackRef = $state<HTMLElement>();
	let tween = $state<gsap.core.Tween>();
	let isTouching = $state(false);
	let isResuming = $state(false);
	let scrollTimeout = $state<ReturnType<typeof setTimeout>>();
	let isExpanded = $state(false);

	// Filter down to active categories configured in backend (has categoryIds assigned or non-default name)
	let activeCategories = $derived(
		categories.filter(
			(c) => (c.categoryIds && c.categoryIds.length > 0) || (c.name && !c.name.startsWith('Tile '))
		).slice(0, 18) // Hard limit 18
	);

	// Determine visible categories depending on active total & expanded state
	let visibleCategories = $derived.by(() => {
		if (activeCategories.length <= 7) {
			return activeCategories;
		}
		if (!isExpanded) {
			return activeCategories.slice(0, 7);
		}
		return activeCategories;
	});

	function handleTileClick(e: MouseEvent, categoryId: string) {
		e.preventDefault();
		if (selectedCategoryId !== categoryId) {
			goto(`/category/${categoryId}`, { keepFocus: true, noScroll: true, replaceState: true, state: { preserveScroll: true } });
		}
	}

	$effect(() => {
		if (!viewportRef || !trackRef) return;
		void visibleCategories;

		let mm = gsap.matchMedia();

		mm.add("(max-width: 900px)", () => {
			const initMarquee = () => {
				if (isTouching || !viewportRef || !trackRef) return;

				const maxScroll = viewportRef.scrollWidth - viewportRef.clientWidth;
				if (maxScroll <= 0) return;

				const currentScroll = viewportRef.scrollLeft;
				let startingProgress = 0;

				if (currentScroll > 0) {
					viewportRef.scrollLeft = 0;
					gsap.set(trackRef, { x: -currentScroll });
					startingProgress = currentScroll / maxScroll;
				} else {
					const currentX = gsap.getProperty(trackRef, "x") as number;
					startingProgress = Math.abs(currentX) / maxScroll;
				}

				if (tween) tween.kill();

				// 30 pixels per second for 60fps smooth cinematic motion
				const duration = maxScroll / 30;

				tween = gsap.fromTo(trackRef,
					{ x: 0 },
					{
						x: -maxScroll,
						duration: duration,
						ease: 'none',
						repeat: -1,
						yoyo: true,
						paused: true
					}
				);

				tween.progress(startingProgress);
				tween.play();
			};

			let marqueeTimeout = setTimeout(initMarquee, 100);
			window.addEventListener('resize', initMarquee);

			return () => {
				clearTimeout(marqueeTimeout);
				window.removeEventListener('resize', initMarquee);
				if (tween) tween.kill();
				if (trackRef) gsap.set(trackRef, { clearProps: "all" });
			};
		});

		return () => mm.revert();
	});

	function pauseAndConvertToScroll() {
		if (!tween || !viewportRef || !trackRef) return;
		if (!tween.isActive()) return;

		const currentX = gsap.getProperty(trackRef, "x") as number;
		tween.pause();
		if (currentX !== 0) {
			gsap.set(trackRef, { x: 0 });
			viewportRef.scrollLeft += Math.abs(currentX);
		}
	}

	function handlePointerDown() {
		isTouching = true;
		clearTimeout(scrollTimeout);
		pauseAndConvertToScroll();
	}

	function handlePointerUp() {
		isTouching = false;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(resumeMarquee, 1000);
	}

	function handleScroll() {
		clearTimeout(scrollTimeout);
		if (isTouching || isResuming) return;

		pauseAndConvertToScroll();
		scrollTimeout = setTimeout(resumeMarquee, 1000);
	}

	function resumeMarquee() {
		if (isTouching || !viewportRef || !trackRef || !tween) return;

		const maxScroll = viewportRef.scrollWidth - viewportRef.clientWidth;
		if (maxScroll <= 0) return;

		const currentScroll = viewportRef.scrollLeft;

		isResuming = true;
		if (currentScroll > 0) {
			viewportRef.scrollLeft = 0;
			gsap.set(trackRef, { x: -currentScroll });
			tween.progress(currentScroll / maxScroll);
			tween.play();
		} else if (!tween.isActive()) {
			tween.play();
		}
		setTimeout(() => { isResuming = false; }, 50);
	}
</script>

<div
	class="tiles-viewport"
	role="region"
	aria-label="Category Tiles"
	data-lenis-prevent
	bind:this={viewportRef}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	onpointerleave={handlePointerUp}
	onscroll={handleScroll}
>
	<div class="tiles-track" bind:this={trackRef}>
		{#each visibleCategories as category (category.id)}
			<a
				href="/category/{category.id}"
				class={['tile', selectedCategoryId === category.id && 'tile--selected']}
				onclick={(e) => handleTileClick(e, category.id)}
			>
				<div class="tile-inner">
					<div
						class="tile-front"
						style:background-image="linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url('{imageUrl(category.image)}')"
					>
						<span class="tile-text">
							{#each category.name.split(' ') as word, idx (idx)}
								{word}{#if idx < category.name.split(' ').length - 1}<br />{/if}
							{/each}
						</span>
					</div>
					<div class="tile-back" aria-hidden="true">
						<div
							class="tile-blur-bg"
							style:background-image="url('{imageUrl(category.image)}')"
						></div>
						<div class="tile-overlay"></div>
						<span class="tile-text">
							{#each category.name.split(' ') as word, idx (idx)}
								{word}{#if idx < category.name.split(' ').length - 1}<br />{/if}
							{/each}
						</span>
					</div>
				</div>
			</a>
		{/each}

		{#if activeCategories.length >= 8 && !isExpanded}
			<button
				type="button"
				class="tile tile--more"
				onclick={() => isExpanded = true}
				aria-label="Show more categories"
			>
				<div class="tile-inner">
					<div class="tile-front tile-front--more">
						<span class="tile-text">MORE</span>
					</div>
					<div class="tile-back" aria-hidden="true">
						<div class="tile-overlay"></div>
						<span class="tile-text">EXPLORE ALL</span>
					</div>
				</div>
			</button>
		{/if}
	</div>
</div>

<style>
	.tiles-viewport {
		margin-top: var(--spacing-md);
		width: 100%;
		overflow-x: auto;
		scrollbar-width: none;
	}
	
	.tiles-viewport::-webkit-scrollbar {
		display: none;
	}

	.tiles-track {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-md);
		width: 100%;
	}

	.tile {
		flex: 0 0 calc(12.5% - (var(--spacing-md) * 7 / 8));
		height: 20vh;
		perspective: 1000px;
		cursor: url('/assets/filled-shapes/cursor.svg') 0 0, pointer;
		text-decoration: none;
		display: block;
		border: 0;
		background: none;
		padding: 0;
	}

	.tile-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transform-style: preserve-3d;
	}

	.tile:hover .tile-inner,
	.tile:focus-visible .tile-inner {
		transform: rotateY(180deg);
	}

	.tile--selected .tile-front {
		border: var(--border) solid var(--color-primary);
	}

	.tile-front,
	.tile-back {
		position: absolute;
		inset: 0;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.tile-front {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-color: var(--color-primary);
	}

	.tile-front--more {
		background-color: var(--color-surface);
		border: 2px dashed var(--color-secondary);
	}

	.tile-front--more .tile-text {
		color: var(--color-secondary);
		text-shadow: none;
	}

	.tile-back {
		transform: rotateY(180deg);
		border: var(--border) solid var(--color-primary);
		background-color: var(--color-primary);
	}

	.tile-blur-bg {
		position: absolute;
		inset: -15px;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		filter: blur(10px) brightness(0.75);
		transform: scale(1.1);
		transition: transform 0.4s ease;
	}

	.tile:hover .tile-blur-bg {
		transform: scale(1.18);
	}

	.tile-overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 100%);
		z-index: 1;
	}

	.tile-text {
		position: relative;
		z-index: 2;
		color: var(--color-tile);
		font-weight: 700;
		font-size: var(--font-sm);
		text-align: center;
		line-height: 120%;
		text-transform: uppercase;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
		width: 100%;
	}

	@media (max-width: 900px) {
		.tiles-viewport {
			height: auto;
			-webkit-overflow-scrolling: touch;
			scroll-snap-type: x proximity;
		}

		.tiles-track {
			flex-wrap: nowrap;
			padding: var(--spacing-sm) var(--spacing-xl);
			width: max-content;
			height: auto;
		}

		.tile {
			flex: 0 0 150px;
			height: 130px;
			scroll-snap-align: start;
		}

		.tile-text {
			font-size: var(--font-sm);
		}

		/* No flip on touch: tapping a tile navigates instead */
		.tile:hover .tile-inner,
		.tile:focus-visible .tile-inner {
			transform: none;
		}
	}

	@media (max-width: 768px) {
		.tiles-track {
			padding: var(--spacing-sm) var(--spacing-lg);
		}
	}

	@media (max-width: 480px) {
		.tiles-track {
			padding: var(--spacing-sm) var(--spacing-md);
		}
	}
</style>

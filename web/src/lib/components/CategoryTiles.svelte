<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Category } from '$lib/types';

	interface Props {
		categories: Category[];
		selectedCategoryId: string;
	}

	let { categories, selectedCategoryId }: Props = $props();
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
</script>

<div
	class="tiles-viewport"
	role="region"
	aria-label="Category Tiles"
	data-lenis-prevent
>
	<div class="tiles-track">
		{#each visibleCategories as category (category.id)}
			<a
				href="/category/{category.id}"
				class={['tile', selectedCategoryId === category.id && 'tile--selected']}
				onclick={(e) => handleTileClick(e, category.id)}
			>
				<div class="tile-inner">
					<div
						class="tile-front"
						style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url('{category.image}')"
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
							style="background-image: url('{category.image}')"
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
		background-color: var(--color-primary);
		border: 2px dashed var(--color-secondary);
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

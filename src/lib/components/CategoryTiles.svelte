<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Category } from '$lib/types';

	interface Props {
		categories: Category[];
		selectedCategoryId: string;
	}

	let { categories, selectedCategoryId }: Props = $props();

	function handleTileClick(e: MouseEvent, categoryId: string) {
		e.preventDefault();
		if (selectedCategoryId !== categoryId) {
			goto(`/category/${categoryId}`, { keepFocus: true, noScroll: true, replaceState: true });
		}
	}
</script>

<div class="tiles">
	{#each categories as category (category.id)}
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
</div>

<style>
	.tiles {
		margin-top: var(--spacing-md);
		display: flex;
		justify-content: space-between;
		height: 20vh;
		gap: var(--spacing-md);
	}

	.tile {
		flex: 1;
		perspective: 1000px;
		cursor: url('/assets/filled-shapes/cursor.svg') 0 0, pointer;
		text-decoration: none;
		display: block;
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
	}

	.tile-back {
		transform: rotateY(180deg);
		border: var(--border) solid var(--color-primary);
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
	}

	@media (max-width: 900px) {
		.tiles {
			height: auto;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
			padding: var(--spacing-sm) var(--spacing-lg);
			margin-left: calc(-1 * var(--spacing-lg));
			margin-right: calc(-1 * var(--spacing-lg));
			width: calc(100% + 2 * var(--spacing-lg));
		}

		.tile {
			flex: 0 0 150px;
			height: 130px;
			scroll-snap-align: start;
		}

		.tile-text {
			font-size: var(--font-sm);
		}
	}
</style>

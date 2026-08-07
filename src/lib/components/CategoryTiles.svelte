<script lang="ts">
	import type { Category } from '$lib/types';

	interface Props {
		categories: Category[];
		selectedCategoryId: string;
		onSelectCategory?: (id: string) => void;
	}

	let { categories, selectedCategoryId, onSelectCategory }: Props = $props();
</script>

<div class="tiles">
	{#each categories as category (category.id)}
		<a
			href="/category/{category.id}"
			class="tile {selectedCategoryId === category.id ? 'tile--selected' : ''}"
			onclick={() => onSelectCategory?.(category.id)}
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
				<div class="tile-back">
					<span class="tile-text tile-text--back">
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
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
		background-color: var(--color-surface);
		transform: rotateY(180deg);
		border: var(--border) solid var(--color-primary);
	}

	.tile-text {
		color: var(--color-tile);
		font-weight: 700;
		font-size: var(--font-sm);
		text-align: center;
		line-height: 120%;
		text-transform: uppercase;
	}

	.tile-text--back {
		color: var(--color-primary);
	}
</style>

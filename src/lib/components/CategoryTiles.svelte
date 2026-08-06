<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import type { Category } from '$lib/types';

	interface Props {
		categories: Category[];
		selectedCategoryId: string;
		onSelectCategory: (id: string) => void;
	}

	let { categories, selectedCategoryId, onSelectCategory }: Props = $props();
	let tilesContainer: HTMLDivElement;

	onMount(() => {
		if (tilesContainer) {
			gsap.from(tilesContainer.querySelectorAll('.tile'), {
				y: 20,
				autoAlpha: 0,
				duration: 0.6,
				stagger: 0.08,
				ease: 'power3.out'
			});
		}
	});

	function handleTileEnter(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const text = target.querySelector('.tile-text');
		gsap.to(target, { y: -4, scale: 1.02, duration: 0.3, ease: 'power2.out' });
		if (text) {
			gsap.to(text, { scale: 1.05, duration: 0.3, ease: 'back.out(1.5)' });
		}
	}

	function handleTileLeave(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const text = target.querySelector('.tile-text');
		gsap.to(target, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
		if (text) {
			gsap.to(text, { scale: 1, duration: 0.3, ease: 'power2.out' });
		}
	}
</script>

<div class="tiles" bind:this={tilesContainer}>
	{#each categories as category (category.id)}
		<div
			class="tile {selectedCategoryId === category.id ? 'tile--selected' : ''}"
			style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url('{category.image}')"
			onclick={() => onSelectCategory(category.id)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectCategory(category.id)}
			onmouseenter={handleTileEnter}
			onmouseleave={handleTileLeave}
			role="button"
			tabindex="0"
		>
			<span class="tile-text">
				{#each category.name.split(' ') as word, idx (idx)}
					{word}{#if idx < category.name.split(' ').length - 1}<br />{/if}
				{/each}
			</span>
		</div>
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
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		cursor: url('/assets/filled-shapes/cursor.svg') 0 0, pointer;
		padding: 0.5rem;
	}

	.tile:hover {
		transform: translateY(-2px);
	}

	.tile-text {
		color: var(--color-tile);
		font-weight: 700;
		font-size: var(--font-sm);
		text-align: center;
		line-height: 120%;
		text-transform: uppercase;
	}
</style>

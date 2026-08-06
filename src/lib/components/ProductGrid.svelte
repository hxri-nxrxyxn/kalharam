<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { Product } from '$lib/types';
	import ProductCard from './ProductCard.svelte';

	interface Props {
		products: Product[];
	}

	let { products }: Props = $props();
	let gridEl = $state<HTMLDivElement>();

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
	});

	$effect(() => {
		if (gridEl && products.length > 0) {
			const cards = gridEl.querySelectorAll('.listing');
			gsap.fromTo(
				cards,
				{ y: 15, autoAlpha: 0 },
				{
					y: 0,
					autoAlpha: 1,
					duration: 0.35,
					stagger: 0.03,
					ease: 'power2.out',
					force3D: true,
					clearProps: 'all'
				}
			);
		}
	});
</script>

{#if products.length === 0}
	<div class="no-results">
		<h3>No products found matching your criteria.</h3>
	</div>
{:else}
	<div class="shop__listings">
		<div class="grid" bind:this={gridEl}>
			{#each products as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.shop__listings {
		width: 100%;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--spacing-md);
		row-gap: var(--spacing-xl);
	}

	@media (max-width: 1200px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.no-results {
		padding: var(--spacing-xl) 0;
		color: var(--color-primary);
		text-align: center;
		width: 100%;
	}
</style>

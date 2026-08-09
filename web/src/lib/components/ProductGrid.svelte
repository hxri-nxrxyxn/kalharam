<script lang="ts">
	import type { Product } from '$lib/types';
	import ProductCard from './ProductCard.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	interface Props {
		products: Product[];
		columns?: number;
	}

	let { products, columns = 4 }: Props = $props();
	let gridRef = $state<HTMLElement>();

	$effect(() => {
		if (!gridRef || products.length === 0) return;

		gsap.registerPlugin(ScrollTrigger);

		let ctx = gsap.context(() => {
			const cards = gsap.utils.toArray('.listing', gridRef) as HTMLElement[];
			
			if (cards.length > 0) {
				// Hide them initially so they don't flash before batch triggers
				gsap.set(cards, { y: 40, autoAlpha: 0 });

				ScrollTrigger.batch(cards, {
					interval: 0.1, // time window to batch elements that enter together
					batchMax: columns, // limit batch size to the number of columns (one row)
					start: 'top 85%',
					onEnter: (batch) => {
						gsap.to(batch, {
							y: 0,
							autoAlpha: 1,
							duration: 0.5,
							stagger: 0.08,
							ease: 'power3.out',
							overwrite: 'auto'
						});
					},
					onLeave: (batch) => {
						gsap.to(batch, {
							y: -40,
							autoAlpha: 0,
							duration: 0.4,
							stagger: 0.05,
							ease: 'power3.out',
							overwrite: 'auto'
						});
					},
					onEnterBack: (batch) => {
						gsap.to(batch, {
							y: 0,
							autoAlpha: 1,
							duration: 0.5,
							stagger: 0.08,
							ease: 'power3.out',
							overwrite: 'auto'
						});
					},
					onLeaveBack: (batch) => {
						gsap.to(batch, {
							y: 40,
							autoAlpha: 0,
							duration: 0.4,
							stagger: 0.05,
							ease: 'power3.out',
							overwrite: 'auto'
						});
					}
				});
			}
		});

		return () => ctx.revert();
	});
</script>

{#if products.length === 0}
	<div class="no-results">
		<h3>No products found matching your criteria.</h3>
	</div>
{:else}
	<div class="shop__listings">
		<div class="grid" style="--grid-columns: {columns}" bind:this={gridRef}>
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
		grid-template-columns: repeat(var(--grid-columns, 4), 1fr);
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
			gap: var(--spacing-md);
		}
	}

	@media (max-width: 480px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--spacing-sm);
			row-gap: var(--spacing-xl);
		}
	}

	.no-results {
		padding: var(--spacing-xl) 0;
		color: var(--color-primary);
		text-align: center;
		width: 100%;
	}
</style>

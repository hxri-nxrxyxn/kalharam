<script lang="ts">
	import { onMount } from 'svelte';
	import type { Product } from '$lib/types';
	import { getProducts } from '$lib/data';
	import ProductGrid from './ProductGrid.svelte';

	interface Props {
		columns?: number;
	}

	let { columns = 5 }: Props = $props();
	let products = $state<Product[]>([]);

	onMount(async () => {
		products = await getProducts({ limit: columns }, fetch);
	});
</script>

<section>

{#if products.length > 0}
	<div class="similar">
		<h2>You May Also Like</h2>
		<ProductGrid products={products} {columns} />
	</div>
{/if}

</section>

<style>

section {
    margin-bottom: var(--spacing-xl);
}
	.similar {
		margin: calc(2 * var(--spacing-xl)) var(--spacing-xl) 0;
	}

	.similar h2 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	@media (max-width: 768px) {
		.similar {
			margin-left: var(--spacing-lg);
			margin-right: var(--spacing-lg);
		}
	}

	@media (max-width: 480px) {
		.similar {
			margin-left: var(--spacing-md);
			margin-right: var(--spacing-md);
		}
	}
</style>

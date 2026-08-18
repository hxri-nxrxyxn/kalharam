<script lang="ts">
	import type { Product } from '$lib/types';
	import { imageUrl } from '$lib/config';

	interface Props {
		product: Product;
		lazy?: boolean;
	}

	let { product, lazy = true }: Props = $props();
</script>

<a href="/product/{product.id}" class="listing">
	<div class="listing__image">
		<img 
			src={imageUrl(product.image)} 
			alt="{product.title} - {product.subtitle}" 
			decoding="async" 
			fetchpriority={lazy ? "auto" : "high"}
			loading={lazy ? "lazy" : "eager"}
			width="300" height="400" 
		/>
	</div>
	<div class="listing__title">
		<h3>{product.title} <br> <span>{product.subtitle}</span></h3>
	</div>
	<div class="listing__info">
		<div class="listing__info-count">
			<img src="/assets/stroke-2px-24px/star.svg" alt="" aria-hidden="true" width="18" height="18" />
			{#if product.stock === 0}
				<h3 class="listing__info-count--out">Stock Out</h3>
			{:else}
				<h3>{product.stock}</h3>
			{/if}
		</div>
		<div class="listing__info-maxprice">
			<p>MRP</p>
			<h3>{product.mrp}</h3>
		</div>
		<div class="listing__info-saleprice">
			<img src="/assets/stroke-2px-24px/rupee.svg" alt="" aria-hidden="true" width="18" height="18" />
			<h3>{product.salePrice}</h3>
		</div>
	</div>
</a>

<style>
	.listing {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: var(--color-surface);
		border: 2px solid var(--color-surface);
		text-decoration: none;
		will-change: transform, opacity;
	}

	.listing:hover {
		border: 2px solid var(--color-secondary);
	}

	.listing span {
		font-weight: 500;
	}

	.listing__image {
		height: var(--card-image-height);
		overflow: hidden;
		background-color: var(--color-input);
	}

	.listing__image img {
		object-fit: cover;
		height: 100%;
		width: 100%;
		transition: transform 0.3s ease;
	}

	.listing:hover .listing__image img {
		transform: scale(1.03);
	}

	.listing__title {
		color: var(--color-primary);
		padding: var(--spacing-md);
	}

	.listing__info {
		color: var(--color-secondary);
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-md);
	}

	.listing__info-count,
	.listing__info-maxprice,
	.listing__info-saleprice {
		display: flex;
		align-items: center;
		gap: calc(0.5 * var(--spacing-sm));
	}

	.listing__info-count img {
		height: var(--height-icon);
		filter: var(--filter-secondary);
	}

	.listing__info-count--out {
		font-size: var(--font-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-secondary);
	}

	.listing__info-saleprice {
		color: var(--color-primary);
	}

	.listing__info-saleprice img {
		height: var(--height-icon);
		filter: var(--filter-primary);
	}

	@media (max-width: 768px) {
		.listing__title {
			padding: var(--spacing-md);
		}
		.listing__info {
			padding: var(--spacing-md);
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}
		.listing__info-count img,
		.listing__info-saleprice img {
			width: var(--height-icon);
			height: auto;
		}
	}
</style>

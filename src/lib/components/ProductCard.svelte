<script lang="ts">
	import type { Product } from '$lib/types';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
</script>

<div class="listing">
	<div class="listing__image">
		<img src={product.image} alt={product.title} />
	</div>
	<div class="listing__title">
		<h3>{product.title}</h3>
		<span>{product.subtitle}</span>
	</div>
	<div class="listing__info">
		<div class="listing__info-count">
			<img src="/assets/stroke-2px-24px/star.svg" alt="rating" />
			<h3>{product.rating}</h3>
		</div>
		<div class="listing__info-maxprice">
			<p>MRP</p>
			<h3>{product.mrp}</h3>
		</div>
		<div class="listing__info-saleprice">
			<img src="/assets/stroke-2px-24px/rupee.svg" alt="rupee" />
			<h3>{product.salePrice}</h3>
		</div>
	</div>
</div>

<style>
	.listing {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.listing span {
		font-weight: 500;
		text-transform: none;
	}

	.listing__image {
		height: 40vh;
		overflow: hidden;
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
		padding: var(--spacing-sm);
	}

	.listing__info {
		color: var(--color-secondary);
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-sm);
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

	.listing__info-saleprice {
		color: var(--color-primary);
	}

	.listing__info-saleprice img {
		height: var(--height-icon);
		filter: var(--filter-primary);
	}
</style>

<script lang="ts">
	import gsap from 'gsap';
	import type { Product } from '$lib/types';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
	let cardEl: HTMLDivElement;

	function handleMouseEnter() {
		if (!cardEl) return;
		const img = cardEl.querySelector('.listing__image img');
		const starIcon = cardEl.querySelector('.listing__info-count img');
		const priceIcon = cardEl.querySelector('.listing__info-saleprice img');

		gsap.to(img, { scale: 1.04, duration: 0.25, ease: 'power2.out', force3D: true });
		if (starIcon) {
			gsap.to(starIcon, { rotation: 5, scale: 1.1, duration: 0.25, ease: 'power2.out', force3D: true });
		}
		if (priceIcon) {
			gsap.to(priceIcon, { y: -2, scale: 1.1, duration: 0.25, ease: 'power2.out', force3D: true });
		}
	}

	function handleMouseLeave() {
		if (!cardEl) return;
		const img = cardEl.querySelector('.listing__image img');
		const starIcon = cardEl.querySelector('.listing__info-count img');
		const priceIcon = cardEl.querySelector('.listing__info-saleprice img');

		gsap.to(img, { scale: 1, duration: 0.25, ease: 'power2.out', force3D: true });
		if (starIcon) {
			gsap.to(starIcon, { rotation: 0, scale: 1, duration: 0.25, ease: 'power2.out', force3D: true });
		}
		if (priceIcon) {
			gsap.to(priceIcon, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out', force3D: true });
		}
	}
</script>

<div
	class="listing"
	role="article"
	bind:this={cardEl}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<div class="listing__image">
		<img src={product.image} alt={product.title} />
	</div>
	<div class="listing__title">
		<h3>{product.title} <br> <span>{product.subtitle}</span></h3>
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

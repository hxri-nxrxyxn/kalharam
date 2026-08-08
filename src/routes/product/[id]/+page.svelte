<script lang="ts">
	import type { PageData } from './$types';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { toast } from '$lib/toast.svelte';
	import { cart } from '$lib/cart.svelte';
	
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { product, similarProducts } = $derived(data);
	
	let quantity = $state(1);
	let detailsRef = $state<HTMLElement>();
	let similarRef = $state<HTMLElement>();

	function increaseQuantity() {
		quantity += 1;
	}

	function decreaseQuantity() {
		if (quantity > 1) {
			quantity -= 1;
		}
	}
	
	function addToCart() {
		cart.add(product, quantity);
		toast.show(`Added ${quantity} ${quantity === 1 ? 'piece' : 'pieces'} of ${product.title} to your collection.`);
	}

	$effect(() => {
		gsap.registerPlugin(ScrollTrigger);
		
		let ctx = gsap.context(() => {
			if (detailsRef) {
				gsap.from(detailsRef.children, {
					scrollTrigger: {
						trigger: detailsRef,
						start: 'top 75%',
						end: 'bottom 25%',
						toggleActions: 'play reverse play reverse'
					},
					y: 30,
					autoAlpha: 0,
					duration: 0.5,
					stagger: 0.05,
					ease: 'power3.out',
					overwrite: 'auto'
				});
			}

			if (similarRef) {
				const header = similarRef.querySelector('h2');

				if (header) {
					gsap.from(header, {
						scrollTrigger: {
							trigger: header,
							start: 'top 85%',
							end: 'bottom 15%',
							toggleActions: 'play reverse play reverse'
						},
						y: 20,
						autoAlpha: 0,
						duration: 0.5,
						ease: 'power3.out',
						overwrite: 'auto'
					});
				}
			}
		});
		
		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>{product.title} - Kalharam</title>
	<meta name="description" content="Buy {product.title} {product.subtitle} at Kalharam." />
</svelte:head>

<main class="product">
	<div class="product__top">
		<div class="product__image">
			<img src={product.image} alt={product.title} />
			<h3> 2 <span>/ 4</span></h3>
		</div>

		<div class="product__details" bind:this={detailsRef}>
			<div class="product__header">
				<h1>{product.title} <span>{product.subtitle}</span></h1>
			</div>
			
			<div class="listing__info">
				<div class="listing__info-count">
					<img src="/assets/stroke-2px-24px/star.svg" alt="" aria-hidden="true" width="18" height="18" />
					<h3>{product.rating}</h3>
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

			<div class="product__description">
				<p>
					Experience the elegance of our handwoven {product.subtitle.toLowerCase()}. 
					Crafted with utmost precision, this drape is perfect for both casual gatherings and festive occasions. 
					Each piece tells a story of tradition and artistry.
				</p>
				
				
			</div>

			<div class="product__actions">
				<div class="product__quantity">
					<button class="quantity-btn" aria-label="Decrease quantity" onclick={decreaseQuantity}>
						<img src="/assets/stroke-3px-24px/minus.svg" alt="minus" width="20" height="20" />
					</button>
					<span class="quantity-value">{quantity}</span>
					<button class="quantity-btn" aria-label="Increase quantity" onclick={increaseQuantity}>
						<img src="/assets/stroke-3px-24px/plus.svg" alt="plus" width="20" height="20" />
					</button>
				</div>

				<button class="btn btn--primary add-to-cart-btn" onclick={addToCart}>
					<img src="/assets/stroke-4px-32px/cart.svg" alt="cart" width="24" height="24" />
					ADD TO CART
				</button>
			</div>
		</div>
	</div>

	<div class="product__similar" bind:this={similarRef}>
		<h2>You May Also Like</h2>
		<ProductGrid products={similarProducts} columns={5} />
	</div>
</main>

<style>
	.product {
		padding-bottom: var(--spacing-xl);
	}

	.product__top {
		display: flex;
		gap: var(--spacing-xl);
	}

	.product__image h3 {
		margin-top: var(--spacing-md);
		text-align: center;
		color: var(--color-primary);
	}

	.product__image span {
		font-weight: 500;
		color: var(--color-secondary);
	}

	.product__image, .product__details {
		width: 50%;
	}

	.product__similar {
		margin-top: calc(2 * var(--spacing-xl));
	}

	.product__similar h2 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.product__image {
		background-color: var(--color-input);
		height: 80vh;
		position: sticky;
		top: var(--nav-offset);
	}

	.product__image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.product__details {
		padding-top: var(--spacing-lg);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.product__details > * {
		will-change: transform, opacity;
	}

	.product__header h1 {
		color: var(--color-primary);
	}

	.product__header span {
		font-weight: 200;
	}

	.listing__info {
		color: var(--color-secondary);
		display: flex;
		gap: var(--spacing-md);
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

	.product__description {
		color: var(--color-secondary);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.product__description p {
		line-height: 1.6;
	}

	.product__actions {
		display: flex;
		gap: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	.product__quantity {
		display: flex;
		align-items: center;
		background-color: var(--color-input);
		padding: 0 var(--spacing-sm);
	}

	.quantity-btn {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-sm);
		transition: opacity 0.2s;
	}

	.quantity-btn img {
		filter: var(--filter-secondary);
	}

	.quantity-btn:hover {
		opacity: 0.7;
	}

	.quantity-value {
		min-width: 2ch;
		text-align: center;
		font-weight: 600;
		color: var(--color-primary);
		font-size: var(--font-sm);
	}

	.add-to-cart-btn {
		flex: 1;
	}

	@media (max-width: 900px) {
		.product__top {
			flex-direction: column;
		}

		.product__image, .product__details {
			width: 100%;
		}

		.product__image {
			position: static;
			height: 50vh;
		}
		
		.product__actions {
			flex-direction: column;
		}
		
		.product__quantity {
			justify-content: space-between;
			padding: var(--spacing-sm);
		}
	}
</style>

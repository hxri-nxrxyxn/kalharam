<script lang="ts">
	import type { PageData } from './$types';
	import CartProducts from './CartProducts.svelte';
	import Checkout from './Checkout.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';

	import { cart } from '$lib/cart.svelte';
	
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { recommendedProducts } = $derived(data);

	let cartItems = $derived(cart.items);

	function increaseQuantity(id: string) {
		cart.increase(id);
	}

	function decreaseQuantity(id: string) {
		cart.decrease(id);
	}

	function removeItem(id: string) {
		cart.remove(id);
	}

	let cartTotal = $derived(cart.total);

	let showCheckout = $state(false);
</script>

<svelte:head>
	<title>Sarees | Kalharam - Shopping Cart</title>
	<link rel="canonical" href="https://kalharam.com/cart" />
	<meta name="description" content="View your shopping cart and selected sarees at Kalharam." />
	<link rel="canonical" href="https://kalharam.com/cart" />
</svelte:head>

<main class="cart">
	<div class="cart__content">
		<div class="cart__text">
			<h1>CART</h1>
			<p>Take a moment to review your chosen drapes before proceeding to secure checkout. These handcrafted treasures are almost yours.</p>
			<br>
			<div class="cart__row-info">
				<img src="/assets/stroke-3px-24px/info.svg" alt="info" width="12" height="12" />
				<h3>Quality Promise</h3>
			</div>
			<p>
				We ensure that every piece is carefully inspected and lovingly packaged before it begins its journey to your wardrobe. Shop with absolute confidence knowing your payment is 100% secure.
			</p>
			<br>
			<div class="cart__row-info">
				<img src="/assets/stroke-3px-24px/circle-check.svg" alt="circle-check" width="12" height="12" />
				<h3>Shipping & Support</h3>
			</div>
			<p>
				Double-check your selected quantities and styles on the right. If you have any questions regarding shipping times, return policies, or require custom finishing touches, please visit our Support page or reach out to us directly.
			</p>
			
			<div class="desktop-btns">
				{@render cartActions()}
			</div>
		</div>
		
		<div class="cart__right">
			{#if showCheckout}
				<Checkout />
			{:else}
				<CartProducts 
					{cartItems} 
					{cartTotal} 
					{increaseQuantity} 
					{decreaseQuantity} 
					{removeItem} 
				/>
			{/if}
			<div class="mobile-btns">
				{@render cartActions()}
			</div>
		</div>
	</div>

	{#snippet cartActions()}
		<div class="btns">
			{#if !showCheckout}
				<button class="btn--primary btn" onclick={() => showCheckout = true} disabled={cartItems.length === 0}>
					<img src="/assets/stroke-3px-24px/credit-card.svg" alt="card" width="24" height="24" />
					PAY ₹{cartTotal}
				</button>
				<a href="/" class="btn--secondary btn">
					<img src="/assets/stroke-3px-24px/shopping-basket.svg" alt="shopping" width="24" height="24" />
					Shop More
				</a>
			{:else}
				<button class="btn--primary btn" onclick={() => showCheckout = true} disabled={cartItems.length === 0}>
					<img src="/assets/stroke-3px-24px/credit-card.svg" alt="card" width="24" height="24" />
					PURCHASE
				</button>
				<button class="btn--secondary btn" onclick={() => showCheckout = false}>
					Back to Cart	
				</button>
			{/if}
		</div>
	{/snippet}

	<div class="cart__similar">
		<h2>You May Also Like</h2>
		<ProductGrid products={recommendedProducts} columns={5} />
	</div>
</main>

<style>
	.cart {
		padding-bottom: var(--spacing-xl);
	}

	.cart__content {
		display: flex;
		gap: var(--spacing-xl);
	}

	.cart__text {
		width: 40%;
	}

	.cart__right {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.cart__text h1 {
		color: var(--color-primary);
	}

	.cart__text h3 {
		color: var(--color-primary);
	}

	.cart__text p {
		color: var(--color-secondary);
		margin: var(--spacing-md) 0;
	}

	.btns {
		margin-top: var(--spacing-lg);
		gap: var(--spacing-md);
	}

	.btns a {
		text-decoration: none;
		display: inline-flex;
	}

	.desktop-btns {
		display: block;
	}

	.mobile-btns {
		display: none;
	}

	.cart__row-info {
		color: var(--color-secondary);
		display: flex;
		gap: var(--spacing-md);
		margin: var(--spacing-md) 0;
	}

	.cart__row-info > img {
		filter: var(--filter-primary);
	}

	.cart__similar {
		margin-top: calc(2 * var(--spacing-xl));
	}

	.cart__similar h2 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	@media (max-width: 768px) {
		.cart__content {
			flex-direction: column;
		}
		.cart__text {
			width: 100%;
		}
		.desktop-btns {
			display: none;
		}
		.mobile-btns {
			display: block;
			margin-top: var(--spacing-lg);
		}
		.mobile-btns .btns {
			margin-top: 0;
			flex-direction: column;
		}
	}
</style>

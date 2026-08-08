<script lang="ts">
	import type { CartItem } from './types';
	import CartProducts from './CartProducts.svelte';
	import Checkout from './Checkout.svelte';

	let cartItems = $state<CartItem[]>([
		{
			id: '1',
			title: 'CHARULATHA',
			subtitle: 'MULCOTTON SAREE',
			image: '/assets/types/mul-cotton/listing/1.jpg',
			rating: 6,
			mrp: 2400,
			price: 2000,
			quantity: 2
		},
		{
			id: '2',
			title: 'MAYURI',
			subtitle: 'MULCOTTON SAREE',
			image: '/assets/types/mul-cotton/listing/2.jpg',
			rating: 5,
			mrp: 2800,
			price: 2200,
			quantity: 1
		}
	]);

	function increaseQuantity(id: string) {
		const item = cartItems.find((i) => i.id === id);
		if (item) item.quantity += 1;
	}

	function decreaseQuantity(id: string) {
		const item = cartItems.find((i) => i.id === id);
		if (item && item.quantity > 1) item.quantity -= 1;
	}

	function removeItem(id: string) {
		cartItems = cartItems.filter((i) => i.id !== id);
	}

	let cartTotal = $derived(cartItems.reduce((total, item) => total + item.price * item.quantity, 0));

	let showCheckout = $state(false);
</script>

<svelte:head>
	<title>Kalharam - Shopping Cart</title>
	<meta name="description" content="View your shopping cart and selected sarees at Kalharam." />
	<link rel="canonical" href="https://kalharam.com/cart" />
</svelte:head>

<main class="cart">
	<div class="cart__text">
		<h1>CART</h1>
		<p>Take a moment to review your chosen drapes before proceeding to secure checkout. These handcrafted treasures are almost yours.</p>
		<br>
		<div class="cart__row-info">
			<img src="/assets/stroke-3px-24px/info.svg" alt="info" width="24" height="24" />
			<h3>Quality Promise</h3>
		</div>
		<p>
			We ensure that every piece is carefully inspected and lovingly packaged before it begins its journey to your wardrobe. Shop with absolute confidence knowing your payment is 100% secure.
		</p>
		<br>
		<div class="cart__row-info">
			<img src="/assets/stroke-3px-24px/circle-check.svg" alt="circle-check" width="24" height="24" />
			<h3>Shipping & Support</h3>
		</div>
		<p>
			Double-check your selected quantities and styles on the right. If you have any questions regarding shipping times, return policies, or require custom finishing touches, please visit our Support page or reach out to us directly.
		</p>
		<div class="btns">
			{#if !showCheckout}
				<button class="btn--primary btn" onclick={() => showCheckout = true}>
					<img src="/assets/stroke-3px-24px/credit-card.svg" alt="card" width="24" height="24" />
					PAY ₹{cartTotal}
				</button>
				<button class="btn--secondary btn">
					<img src="/assets/stroke-3px-24px/shopping-basket.svg" alt="shopping" width="24" height="24" />
					Shop More
				</button>
			{:else}
				<button class="btn--primary btn" onclick={() => showCheckout = true}>
					<img src="/assets/stroke-3px-24px/credit-card.svg" alt="card" width="24" height="24" />
					PURCHASE
				</button>
				<button class="btn--secondary btn" onclick={() => showCheckout = false}>
					Back to Cart	
				</button>
			{/if}
		</div>
	</div>
	
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
</main>

<style>
	.cart {
		display: flex;
		padding-bottom: var(--spacing-xl);
		gap: var(--spacing-xl);
	}

	.cart__text {
		width: 40%;
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

	.cart__text button {
		margin-top: var(--spacing-lg);
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

	@media (max-width: 768px) {
		.cart {
			flex-direction: column;
		}
		.cart__text {
			width: 100%;
		}
	}
</style>

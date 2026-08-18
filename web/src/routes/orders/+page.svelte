<script lang="ts">
	import type { PageData } from './$types';
	import CartProducts from './CartProducts.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';

	import { cart } from '$lib/cart.svelte';
	import { auth } from '$lib/auth.svelte';
	
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { recommendedProducts } = $derived(data);

	import { onMount } from 'svelte';
	import { API_BASE } from '$lib/config';
	import { toast } from '$lib/toast.svelte';

	let orders = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		if (auth.token) {
			await fetchOrders();
		} else {
			loading = false;
		}
	});

	async function fetchOrders() {
		try {
			const res = await fetch(`${API_BASE}/orders`, {
				headers: { Authorization: `Bearer ${auth.token}` }
			});
			if (res.ok) {
				orders = await res.json();
			}
		} catch (e) {
			toast.show("Failed to load orders");
		} finally {
			loading = false;
		}
	}

	async function cancelOrder(id: string) {
		try {
			const res = await fetch(`${API_BASE}/orders/${id}/cancel`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${auth.token}` }
			});
			if (res.ok) {
				toast.show("Order cancelled");
				await fetchOrders();
			} else {
				const err = await res.json();
				toast.show(err.error || "Failed to cancel");
			}
		} catch (e) {
			toast.show("Failed to cancel");
		}
	}
</script>

<svelte:head>
	<title>Sarees | Kalharam - My Orders</title>
	<link rel="canonical" href="https://kalharam.com/orders" />
	<meta name="description" content="View your orders at Kalharam." />
	<link rel="canonical" href="https://kalharam.com/cart" />
</svelte:head>

<main class="cart">
	<div class="cart__content">
		<div class="cart__text">
			<h1>MY ORDERS</h1>
			<p>View your recent orders and track their progress here. Your handcrafted treasures are on their way to your wardrobe.</p>
			<br>
			<div class="cart__row-info">
				<img src="/assets/stroke-3px-24px/circle-check.svg" alt="circle-check" width="12" height="12" />
				<h3>Order Status</h3>
			</div>
			<p>
				You can track the progress of your orders or cancel them if they haven't shipped yet. 
			</p>
			
			<div class="desktop-btns">
				{@render cartActions()}
			</div>
		</div>
		
		<div class="cart__right">
			{#if loading}
				<p style="color: var(--color-secondary);">Loading your orders...</p>
			{:else if orders.length === 0}
				<p style="color: var(--color-secondary);">You have no recent orders.</p>
			{:else}
				{#each orders as order}
					<div class="order-summary">
						<div class="order-header">
							<h3>Order #{order.id}</h3>
							<p>Status: <strong style="text-transform: uppercase;">{order.status}</strong></p>
						</div>
						<CartProducts 
							cartItems={order.items} 
							cartTotal={order.total}
							orderId={order.id}
							status={order.status}
							{cancelOrder}
						/>
					</div>
				{/each}
			{/if}
			<div class="mobile-btns">
				{@render cartActions()}
			</div>
		</div>
	</div>

	{#snippet cartActions()}
		<div class="btns">
			<a href="/" class="btn--secondary btn">
				<img src="/assets/stroke-3px-24px/shopping-basket.svg" alt="shopping" width="24" height="24" />
				Shop More
			</a>
			<button class="btn--primary btn" onclick={() => { auth.logout(); window.location.href='/'; }}>
				Sign Out
			</button>
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

	.order-summary {
		background-color: var(--color-surface);
		padding: var(--spacing-lg);
		margin-bottom: var(--spacing-xl);
		border: 1px solid var(--color-input);
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-input);
		color: var(--color-primary);
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

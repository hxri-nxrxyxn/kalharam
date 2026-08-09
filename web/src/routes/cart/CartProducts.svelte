<script lang="ts">
	import type { CartItem } from '$lib/types';

	let {
		cartItems,
		cartTotal,
		increaseQuantity,
		decreaseQuantity,
		removeItem
	} = $props<{
		cartItems: CartItem[];
		cartTotal: number;
		increaseQuantity: (id: string) => void;
		decreaseQuantity: (id: string) => void;
		removeItem: (id: string) => void;
	}>();
</script>

<div class="cart__products">
	<div class="cart__header">
		<h3>Product</h3>
		<h3>Action</h3>
	</div>
	<div class="cart__rows">
		{#if cartItems.length === 0}
			<p class="cart__empty">Your cart is empty.</p>
		{:else}
			{#each cartItems as item (item.id)}
				<div class="cart__row">
					<div class="cart__row-notaction">
						<a href="/product/{item.id}" class="cart__row-image">
							<img src={item.image} alt={item.title}>
						</a>
						<div class="cart__row-details">
							<div class="cart__row-details--top">
								<a href="/product/{item.id}" class="cart__row-title">
									<h3>{item.title} <span>{item.subtitle}</span></h3>
								</a>
								<div class="cart__row-info">
									<div class="cart__row-info--count">
										<img src="/assets/stroke-2px-24px/star.svg" alt="rating" aria-hidden="true" width="18" height="18" />
										<h3>{item.stock}</h3>
									</div>
									<div class="cart__row-info--maxprice">
										<p>MRP</p>
										<h3>{item.mrp}</h3>
									</div>
									<div class="cart__row-info--saleprice">
										<img src="/assets/stroke-2px-24px/rupee.svg" alt="rupee" aria-hidden="true" width="18" height="18" />
										<h3>{item.price}</h3>
									</div>
								</div>
								<div class="cart__row-info">
									<div class="cart__row-info--quantity">
										<button type="button" class="icon-btn" onclick={() => decreaseQuantity(item.id)} aria-label="Decrease quantity">
											<img src="/assets/stroke-3px-24px/minus.svg" alt="" width="18" height="18" />
										</button>
										<h3>{item.quantity}</h3>
										<button type="button" class="icon-btn" onclick={() => increaseQuantity(item.id)} aria-label="Increase quantity">
											<img src="/assets/stroke-3px-24px/plus.svg" alt="" width="18" height="18" />
										</button>
									</div>
								</div>
							</div>
							<div class="cart__row-details--bottom">
								<div class="cart__row-info">
									<div class="cart__row-info--totalprice">
										<p>TOTAL</p>
										<img src="/assets/stroke-2px-24px/rupee.svg" alt="rupee" aria-hidden="true" width="18" height="18" />
										<h3>{item.price * item.quantity}</h3>
									</div>
								</div>	
							</div>
						</div>
					</div>
					<div class="cart__row-action">
						<button type="button" class="icon-btn" onclick={() => removeItem(item.id)} aria-label="Remove item">
							<img src="/assets/stroke-3px-24px/delete.svg" alt="" width="24" height="24" />
						</button>
					</div>
				</div>
			{/each}
			
			<div class="cart__total-summary">
				<h3>Subtotal</h3>
				<div class="cart__total-summary-price">
					<img src="/assets/stroke-2px-24px/rupee.svg" alt="rupee" aria-hidden="true" width="24" height="24" />
					<h3>{cartTotal}</h3>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.cart__row-info--totalprice img,
	.cart__total-summary-price img {
		filter: var(--filter-primary);
	}

	.icon-btn {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: inherit;
	}

	.cart__row-info--quantity img,
	.cart__row-action img {
		filter: var(--filter-secondary);
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.cart__row-info--quantity img:hover,
	.cart__row-action img:hover {
		opacity: 0.7;
	}

	.cart__empty {
		margin-top: var(--spacing-lg);
		color: var(--color-secondary);
		font-style: italic;
	}

	.cart__products {
		flex: 1;
	}

	.cart__row {
		display: flex;
		margin-top: var(--spacing-lg);
	}

	.cart__header {
		color: var(--color-primary);
		display: flex;
		justify-content: space-between;
	}

	.cart__row-action {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.cart__row-notaction {
		display: flex;	
		flex: 1;
	}

	.cart__row-action img {
		transform: translateX(calc( -1 * var(--spacing-lg)));
	}

	.cart__row-title {
		text-decoration: none;
		color: var(--color-primary);
		display: block;
	}

	.cart__row-title span {
		font-weight: 500;
	}

	.cart__row-image {
		height: 30vh;
		width: 25vh;
		overflow: hidden;
		background-color: var(--color-input);
		display: block;
	}

	.cart__row-image img {
		object-fit: cover;
		height: 100%;
		width: 100%;
		transition: transform 0.3s ease;
	}

	.cart__row:hover .cart__row-image img {
		transform: scale(1.03);
	}

	.cart__row-details {
		background-color: var(--color-surface);
		width: 60%;
		padding: var(--spacing-lg);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.cart__row-title:hover h3 {
		text-decoration: underline;
	}

	.cart__row-info {
		color: var(--color-secondary);
		display: flex;
		gap: var(--spacing-md);
		margin: var(--spacing-md) 0;
	}

	.cart__row-info--count,
	.cart__row-info--quantity,
	.cart__row-info--maxprice,
	.cart__row-info--totalprice,
	.cart__row-info--saleprice {
		display: flex;
		align-items: center;
		gap: calc(0.5 * var(--spacing-sm));
	}

	.cart__row-info--totalprice {
		color: var(--color-primary);
	}

	.cart__row-info--quantity {
		gap: calc(2 * var(--spacing-sm));
		background-color: var(--color-background);
		padding: var(--spacing-sm) var(--spacing-md);
	}

	.cart__row-info--count img {
		height: var(--height-icon);
		filter: var(--filter-secondary);
	}

	.cart__row-info--quantity h3 {
		color: var(--color-primary);
		min-width: 1ch;
		text-align: center;
	}

	.cart__row-info--saleprice {
		color: var(--color-primary);
	}

	.cart__row-info--saleprice img {
		height: var(--height-icon);
		filter: var(--filter-primary);
	}

	.cart__total-summary {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: var(--spacing-md);
		margin-top: var(--spacing-xl);
		padding-top: var(--spacing-lg);
		border-top: 1px solid var(--color-input);
		color: var(--color-primary);
	}

	.cart__total-summary-price {
		display: flex;
		align-items: center;
		gap: calc(0.5 * var(--spacing-sm));
	}

	@media (max-width: 768px) {
		.cart__row {
			position: relative;
		}

		.cart__row-notaction {
			flex-direction: column;
			width: 100%;
		}

		.cart__row-image {
			height: 40vh;
			width: 100%;
		}

		.cart__row-details {
			width: 100%;
			padding: var(--spacing-md);
		}

		.cart__row-action {
			position: absolute;
			top: var(--spacing-sm);
			right: var(--spacing-sm);
		}

		.cart__row-action img {
			transform: none;
			filter: var(--filter-surface);
		}
	}
</style>

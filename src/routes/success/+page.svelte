<script lang="ts">
	import { gsap } from 'gsap';
</script>

<svelte:head>
	<title>Order Successful - Kalharam</title>
</svelte:head>

<main class="success-page">
	<div class="success-content">
		<div class="icon-wrapper">
			<img src="/assets/stroke-3px-24px/circle-check.svg" alt="Success" width="48" height="48" />
		</div>
		
		<h1>Order Confirmed</h1>
		
		<p class="subtitle">
			Thank you for choosing Kalharam. Your handcrafted drape is now being lovingly prepared for its journey to you.
		</p>
		
		<div class="details">
			<div class="detail-row">
				<span>Order Number</span>
				<strong>#KAL-{Math.floor(100000 + Math.random() * 900000)}</strong>
			</div>
			<div class="detail-row">
				<span>Estimated Delivery</span>
				<strong>5 - 7 Business Days</strong>
			</div>
		</div>

		<a href="/" class="btn btn--primary">
			Return to Catalog
		</a>
	</div>
</main>

<style>
	.success-page {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md);
	}
	
	.success-content {
		max-width: 600px;
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
	}
	
	.icon-wrapper {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: var(--color-input);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--spacing-md);
	}
	
	.icon-wrapper img {
		filter: var(--filter-primary);
	}
	
	h1 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-sm);
	}
	
	.subtitle {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-lg);
	}
	
	.details {
		width: 100%;
		background-color: var(--color-surface);
		padding: var(--spacing-md);
		margin-bottom: var(--spacing-lg);
	}
	
	.detail-row {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-md) 0;
		color: var(--color-primary);
	}
	
	.detail-row:not(:last-child) {
		border-bottom: 1px solid var(--color-input);
	}
	
	.detail-row span {
		color: var(--color-secondary);
	}
	
	.btn {
		text-decoration: none;
		margin-top: var(--spacing-md);
	}
</style>

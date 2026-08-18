<script lang="ts">
</script>

<svelte:head>
	<title>Order Successful - Kalharam</title>
</svelte:head>

<main class="success">
	<div class="success__content">
		<div class="success__icon-box">
			<img src="/assets/stroke-3px-24px/circle-check.svg" alt="Success" width="48" height="48" />
		</div>
		
		<h1 class="success__title">Order Confirmed</h1>
		
		<p class="success__subtitle">
			Thank you for choosing Kalharam. Your handcrafted drape is now being lovingly prepared for its journey to you.
		</p>
		
		<div class="success__details">
			<div class="success__detail-row">
				<span class="success__detail-label">Order Number</span>
				<strong class="success__detail-value">#KAL-{Math.floor(100000 + Math.random() * 900000)}</strong>
			</div>
			<div class="success__detail-row">
				<span class="success__detail-label">Estimated Delivery</span>
				<strong class="success__detail-value">5 - 7 Business Days</strong>
			</div>
		</div>

		<a href="/" class="btn btn--primary success__btn">
			Return to Catalog
		</a>
	</div>
</main>

<style>
	.success {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.success__content {
		width: 60%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.success__icon-box {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: var(--color-input);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--spacing-md);
	}
	
	.success__icon-box img {
		filter: var(--filter-primary);
	}
	
	.success__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-sm);
	}
	
	.success__subtitle {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-lg);
	}
	
	.success__details {
		width: 100%;
		background-color: var(--color-surface);
		padding: var(--spacing-md);
		margin-bottom: var(--spacing-lg);
	}
	
	.success__detail-row {
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-md) 0;
		color: var(--color-primary);
	}
	
	.success__detail-row:not(:last-child) {
		border-bottom: 1px solid var(--color-input);
	}
	
	.success__detail-label {
		color: var(--color-secondary);
	}
	
	.success__btn {
		text-decoration: none;
		margin-top: var(--spacing-md);
	}
</style>

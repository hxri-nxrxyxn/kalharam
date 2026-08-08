<script lang="ts">
</script>

<svelte:head>
	<title>Shipping Policy - Kalharam Kalyani</title>
	<meta name="description" content="Learn about our domestic and international shipping policies, delivery times, and rates." />
</svelte:head>

<main class="shipping">
	<div class="shipping__content">
		<h1 class="shipping__title">Shipping Policy</h1>
		
		<p class="shipping__lead">Bringing heritage to your doorstep, securely and swiftly.</p>

		<h2 class="shipping__subtitle">Order Processing</h2>
		<p class="shipping__paragraph">Every piece at Kalharam Kalyani is thoroughly inspected and lovingly packaged before it begins its journey to your wardrobe. Orders are typically processed and dispatched within 1-2 business days.</p>

		<h2 class="shipping__subtitle">Domestic Shipping (India)</h2>
		<p class="shipping__paragraph">We offer complimentary shipping on all prepaid orders across India. For domestic deliveries, please allow 5-7 business days for your handloom treasures to arrive. Expedited shipping is available at checkout for an additional fee.</p>

		<h2 class="shipping__subtitle">International Shipping</h2>
		<p class="shipping__paragraph">We ship worldwide! International shipping rates are calculated at checkout based on the destination and parcel weight. International deliveries typically take 10-15 business days. Please note that customs duties or local taxes are the responsibility of the recipient.</p>

		<h2 class="shipping__subtitle">Tracking Your Order</h2>
		<p class="shipping__paragraph">Once your order is dispatched, you will receive a tracking link via email and SMS, allowing you to monitor your saree's journey every step of the way.</p>
		
	</div>
</main>

<style>
	.shipping {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.shipping__content {
		width: 40%;
	}

	.shipping__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.shipping__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.shipping__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}

	.shipping__lead {
		font-weight: 500;
		font-size: 1.1rem;
		color: var(--color-primary);
		margin-bottom: var(--spacing-md);
	}

	
	
	
	
	

	@media (max-width: 900px) {
		.shipping__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.shipping__content {
			width: 100%;
		}
	}
</style>

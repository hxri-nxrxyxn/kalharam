<script lang="ts">
</script>

<svelte:head>
	<title>Shipping Policy - Kalharam Kalyani</title>
	<meta name="description" content="Learn about our domestic and international shipping policies, delivery times, and rates." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>Shipping Policy</h1>

		<p class="lead">Bringing heritage to your doorstep, securely and swiftly.</p>

		<h2>Order Processing</h2>
		<p>Every piece at Kalharam Kalyani is thoroughly inspected and lovingly packaged before it begins its journey to your wardrobe. Orders are typically processed and dispatched within 1-2 business days.</p>

		<h2>Domestic Shipping (India)</h2>
		<p>We offer complimentary shipping on all prepaid orders across India. For domestic deliveries, please allow 5-7 business days for your handloom treasures to arrive. Expedited shipping is available at checkout for an additional fee.</p>

		<h2>International Shipping</h2>
		<p>We ship worldwide! International shipping rates are calculated at checkout based on the destination and parcel weight. International deliveries typically take 10-15 business days. Please note that customs duties or local taxes are the responsibility of the recipient.</p>

		<h2>Tracking Your Order</h2>
		<p>Once your order is dispatched, you will receive a tracking link via email and SMS, allowing you to monitor your saree's journey every step of the way.</p>
		
	</div>
</main>


<style>
	.page-container {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.page-content {
		width: 40%;
	}

	.page-content h1 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.page-content p {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.page-content h2 {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}

	.page-content .lead {
		font-weight: 500;
		font-size: 1.1rem;
		color: var(--color-primary);
	}

	.page-content ul {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
		padding-left: var(--spacing-lg);
	}

	.page-content li {
		margin-bottom: calc(var(--spacing-sm) / 2);
	}

	@media (max-width: 900px) {
		.page-content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.page-content {
			width: 100%;
		}
	}
</style>

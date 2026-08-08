<script lang="ts">
</script>

<svelte:head>
	<title>Terms of Service - Kalharam Kalyani</title>
	<meta name="description" content="Read the terms and conditions governing your use of Kalharam Kalyani." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>Terms of Service</h1>

		<p class="lead">Welcome to Kalharam Kalyani.</p>
		<p>By accessing our website and purchasing our products, you agree to be bound by the following terms and conditions.</p>

		<h2>Product Accuracy</h2>
		<p>We have made every effort to display the colors and textures of our sarees as accurately as possible. However, due to variations in monitor displays and the natural dyeing processes used in handlooms, we cannot guarantee that the physical product will perfectly match your screen.</p>

		<h2>Pricing and Availability</h2>
		<p>All prices are listed in INR (Indian Rupees) and are inclusive of applicable taxes. We reserve the right to modify prices or discontinue products without prior notice. In the rare event that an item is out of stock after an order is placed, we will notify you immediately and process a full refund.</p>

		<h2>Intellectual Property</h2>
		<p>All content on this website, including photographs, branding, text, and graphics, is the exclusive property of Kalharam Kalyani. Any unauthorized use, reproduction, or distribution is strictly prohibited.</p>
		
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

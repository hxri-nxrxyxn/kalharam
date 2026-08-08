<script lang="ts">
</script>

<svelte:head>
	<title>Terms of Service - Kalharam Kalyani</title>
	<meta name="description" content="Read the terms and conditions governing your use of Kalharam Kalyani." />
</svelte:head>

<main class="terms">
	<div class="terms__content">
		<h1 class="terms__title">Terms of Service</h1>
		
		<p class="terms__lead">Welcome to Kalharam Kalyani.</p>
		<p class="terms__paragraph">By accessing our website and purchasing our products, you agree to be bound by the following terms and conditions.</p>

		<h2 class="terms__subtitle">Product Accuracy</h2>
		<p class="terms__paragraph">We have made every effort to display the colors and textures of our sarees as accurately as possible. However, due to variations in monitor displays and the natural dyeing processes used in handlooms, we cannot guarantee that the physical product will perfectly match your screen.</p>

		<h2 class="terms__subtitle">Pricing and Availability</h2>
		<p class="terms__paragraph">All prices are listed in INR (Indian Rupees) and are inclusive of applicable taxes. We reserve the right to modify prices or discontinue products without prior notice. In the rare event that an item is out of stock after an order is placed, we will notify you immediately and process a full refund.</p>

		<h2 class="terms__subtitle">Intellectual Property</h2>
		<p class="terms__paragraph">All content on this website, including photographs, branding, text, and graphics, is the exclusive property of Kalharam Kalyani. Any unauthorized use, reproduction, or distribution is strictly prohibited.</p>
		
	</div>
</main>

<style>
	.terms {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.terms__content {
		width: 40%;
	}

	.terms__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.terms__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.terms__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}

	.terms__lead {
		font-weight: 500;
		font-size: 1.1rem;
		color: var(--color-primary);
		margin-bottom: var(--spacing-md);
	}

	
	
	
	
	

	@media (max-width: 900px) {
		.terms__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.terms__content {
			width: 100%;
		}
	}
</style>

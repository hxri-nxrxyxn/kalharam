<script lang="ts">
</script>

<svelte:head>
	<title>Privacy Policy - Kalharam Kalyani</title>
	<meta name="description" content="Understand how we collect, use, and protect your personal information." />
</svelte:head>

<main class="privacy">
	<div class="privacy__content">
		<h1 class="privacy__title">Privacy Policy</h1>
		

		<h2 class="privacy__subtitle">Data Collection</h2>
		<p class="privacy__paragraph">When you purchase something from Kalharam Kalyani, we collect the personal information you give us, such as your name, address, and email address, to fulfill your order and provide customer support.</p>

		<h2 class="privacy__subtitle">Payment Security</h2>
		<p class="privacy__paragraph">We use encrypted, industry-standard payment gateways. We do not store your credit card details or payment information on our servers. Your transactions are 100% secure.</p>

		<h2 class="privacy__subtitle">Data Usage</h2>
		<p class="privacy__paragraph">We will never sell, rent, or distribute your personal information to third parties. With your permission, we may send you emails about our boutique, new collections, and exclusive sales.</p>
		
	</div>
</main>

<style>
	.privacy {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.privacy__content {
		width: 40%;
	}

	.privacy__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.privacy__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.privacy__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}


	
	
	
	
	

	@media (max-width: 900px) {
		.privacy__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.privacy__content {
			width: 100%;
		}
	}
</style>

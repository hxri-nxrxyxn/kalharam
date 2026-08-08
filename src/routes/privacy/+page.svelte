<script lang="ts">
</script>

<svelte:head>
	<title>Privacy Policy - Kalharam Kalyani</title>
	<meta name="description" content="Understand how we collect, use, and protect your personal information." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>Privacy Policy</h1>

		<p class="lead">Your privacy is as important to us as the quality of our weaves.</p>

		<h2>Data Collection</h2>
		<p>When you purchase something from Kalharam Kalyani, we collect the personal information you give us, such as your name, address, and email address, to fulfill your order and provide customer support.</p>

		<h2>Payment Security</h2>
		<p>We use encrypted, industry-standard payment gateways. We do not store your credit card details or payment information on our servers. Your transactions are 100% secure.</p>

		<h2>Data Usage</h2>
		<p>We will never sell, rent, or distribute your personal information to third parties. With your permission, we may send you emails about our boutique, new collections, and exclusive sales.</p>
		
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

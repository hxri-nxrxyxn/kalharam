<script lang="ts">
</script>

<svelte:head>
	<title>Frequently Asked Questions - Kalharam Kalyani</title>
	<meta name="description" content="Answers to your questions about our sarees, orders, and services." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>Frequently Asked Questions</h1>

		<p class="lead">Everything you need to know about shopping with us.</p>

		<h2>Are your sarees authentic handloom?</h2>
		<p>Absolutely. Authenticity is the cornerstone of Kalharam Kalyani. Every saree, from our Kanchi Cotton to our Narayan Peth collection, is woven by skilled artisans using traditional handloom techniques.</p>

		<h2>How should I care for my cotton sarees?</h2>
		<p>We recommend dry cleaning for the first wash to preserve the natural dyes. For subsequent washes, gently hand wash in cold water using a mild detergent. Dry in the shade to prevent the vibrant colors from fading.</p>

		<h2>Do you offer blouse stitching services?</h2>
		<p>At this time, we provide unstitched blouse pieces included with the sarees (where specified). We do not currently offer tailoring or fall/picot services, allowing you to customize the fit with your trusted local tailor.</p>

		<h2>What if an item is out of stock?</h2>
		<p>Handlooms take time to weave, which means our stock is limited. If a drape you love is sold out, please reach out to us on WhatsApp (+91 81570 75657) and we will let you know if a restock is planned.</p>
		
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

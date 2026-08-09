<script lang="ts">
</script>

<svelte:head>
	<title>Frequently Asked Questions - Kalharam Kalyani</title>
	<meta name="description" content="Answers to your questions about our sarees, orders, and services." />
</svelte:head>

<main class="faq">
	<div class="faq__content">
		<h1 class="faq__title">Frequently Asked Questions</h1>
		

		<h2 class="faq__subtitle">Are your sarees authentic handloom?</h2>
		<p class="faq__paragraph">Absolutely. Authenticity is the cornerstone of Kalharam Kalyani. Every saree, from our Kanchi Cotton to our Narayan Peth collection, is woven by skilled artisans using traditional handloom techniques.</p>

		<h2 class="faq__subtitle">How should I care for my cotton sarees?</h2>
		<p class="faq__paragraph">We recommend dry cleaning for the first wash to preserve the natural dyes. For subsequent washes, gently hand wash in cold water using a mild detergent. Dry in the shade to prevent the vibrant colors from fading.</p>

		<h2 class="faq__subtitle">Do you offer blouse stitching services?</h2>
		<p class="faq__paragraph">At this time, we provide unstitched blouse pieces included with the sarees (where specified). We do not currently offer tailoring or fall/picot services, allowing you to customize the fit with your trusted local tailor.</p>

		<h2 class="faq__subtitle">What if an item is out of stock?</h2>
		<p class="faq__paragraph">Handlooms take time to weave, which means our stock is limited. If a drape you love is sold out, please reach out to us on WhatsApp (+91 81570 75657) and we will let you know if a restock is planned.</p>
		
	</div>
</main>

<style>
	.faq {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.faq__content {
		width: 40%;
	}

	.faq__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.faq__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.faq__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}


	
	
	
	
	

	@media (max-width: 900px) {
		.faq__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.faq__content {
			width: 100%;
		}
	}
</style>

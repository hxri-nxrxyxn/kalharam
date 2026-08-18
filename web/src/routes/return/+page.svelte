<script lang="ts">
	import SimilarProducts from '$lib/components/SimilarProducts.svelte';
</script>

<svelte:head>
	<title>Return & Exchange Policy - Kalharam Kalyani</title>
	<meta name="description" content="Find out about our hassle-free return and exchange process." />
</svelte:head>

<main class="return">
	<div class="return__content">
		<h1 class="return__title">Return & Exchange Policy</h1>
		

		<h2 class="return__subtitle">Our Promise</h2>
		<p class="return__paragraph">If your saree is not a perfect match, we offer a hassle-free 7-day return and exchange policy from the date of delivery.</p>

		<h2 class="return__subtitle">Conditions for Return</h2>
		<p class="return__paragraph">To be eligible for a return or exchange, the item must be unworn, unwashed, and in its original packaging with all Kalharam Kalyani tags completely intact. Sarees that have had their blouse pieces cut or falls stitched are considered customized and are strictly non-returnable.</p>

		<h2 class="return__subtitle">The Handloom Mark</h2>
		<p class="return__paragraph">Please note that minor irregularities in weave, color, or print are natural characteristics of authentic handloom products and are not considered defects. These nuances are what make your saree truly one-of-a-kind.</p>

		<h2 class="return__subtitle">How to Initiate</h2>
		<p class="return__paragraph">To start a return or exchange, please email our support team at <strong>support@kalharam.com</strong> with your order number. Our team will arrange a reverse pickup within 48 hours.</p>
		
	</div>
</main>

<SimilarProducts />

<style>
	.return {
		display: flex;
	}

	.return__content {
		width: 40%;
	}

	.return__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.return__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.return__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}


	
	
	
	
	

	@media (max-width: 900px) {
		.return__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.return__content {
			width: 100%;
		}
	}
</style>

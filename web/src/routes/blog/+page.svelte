<script lang="ts">
	import SimilarProducts from '$lib/components/SimilarProducts.svelte';
</script>

<svelte:head>
	<title>The Kalharam Blog - Kalharam Kalyani</title>
	<meta name="description" content="Read our latest stories about handloom heritage, styling tips, and artisan features." />
</svelte:head>

<main class="blog">
	<div class="blog__content">
		<h1 class="blog__title">The Kalharam Blog</h1>
		

		<h2 class="blog__subtitle">The Breathable Elegance of Mul Cotton</h2>
		<p class="blog__paragraph"><em class="blog__date">Posted on August 5th, 2026</em></p>
		<p class="blog__paragraph">There is a distinct magic to Mul Cotton (Mulmul). Known for its feather-light texture and incredible breathability, it has been the fabric of choice for Indian summers for centuries. In our latest collection, we explore how this ancient textile is being reimagined for the modern wardrobe. <a href="/blog" class="blog__link">Read more...</a></p>

		<h2 class="blog__subtitle">Styling Your Davani Half Saree</h2>
		<p class="blog__paragraph"><em class="blog__date">Posted on July 22nd, 2026</em></p>
		<p class="blog__paragraph">The Davani, or Half Saree, is a beautiful bridge between childhood and womanhood in South Indian tradition. But today, it has evolved into a high-fashion statement piece. Here are three ways to style your Kalharam Davani for your next festive occasion. <a href="/blog" class="blog__link">Read more...</a></p>
		
	</div>
</main>

<SimilarProducts />

<style>
	.blog {
		display: flex;
	}

	.blog__content {
		width: 40%;
	}

	.blog__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.blog__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.blog__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}


	.blog__link {
		color: var(--color-primary);
		text-decoration: underline;
	}
	
	.blog__date {
		font-size: var(--font-sm);
		opacity: 0.8;
	}
	
	
	
	

	@media (max-width: 900px) {
		.blog__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.blog__content {
			width: 100%;
		}
	}
</style>

<script lang="ts">
</script>

<svelte:head>
	<title>The Kalharam Blog - Kalharam Kalyani</title>
	<meta name="description" content="Read our latest stories about handloom heritage, styling tips, and artisan features." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>The Kalharam Blog</h1>

		<p class="lead">Stories from the Loom.</p>

		<h2>The Breathable Elegance of Mul Cotton</h2>
		<p><em>Posted on August 5th, 2026</em></p>
		<p>There is a distinct magic to Mul Cotton (Mulmul). Known for its feather-light texture and incredible breathability, it has been the fabric of choice for Indian summers for centuries. In our latest collection, we explore how this ancient textile is being reimagined for the modern wardrobe. <a href="/blog" style="color: var(--color-primary); text-decoration: underline;">Read more...</a></p>

		<h2>Styling Your Davani Half Saree</h2>
		<p><em>Posted on July 22nd, 2026</em></p>
		<p>The Davani, or Half Saree, is a beautiful bridge between childhood and womanhood in South Indian tradition. But today, it has evolved into a high-fashion statement piece. Here are three ways to style your Kalharam Davani for your next festive occasion. <a href="/blog" style="color: var(--color-primary); text-decoration: underline;">Read more...</a></p>
		
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

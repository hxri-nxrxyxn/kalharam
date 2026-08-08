<script lang="ts">
</script>

<svelte:head>
	<title>About Us - Kalharam Kalyani</title>
	<meta name="description" content="Discover the story behind Kalharam Kalyani and our commitment to authentic handlooms." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>About Us</h1>

		<p class="lead">Woven with heritage, crafted with soul.</p>
		
		<p>Kalharam Kalyani was born from a deep reverence for India's rich handloom heritage. We are more than just a boutique; we are a celebration of the artisans, the weavers, and the generations of tradition that breathe life into every thread.</p>
		
		<h2>Our Philosophy</h2>
		<p>In a world of fast fashion, we choose the slow, intentional rhythm of the loom. Every drape in our collection—from the breezy elegance of Mul Cotton to the regal weight of Kanchi Cotton—is meticulously curated to ensure unparalleled quality. We believe that a saree is not just a garment, but a canvas of cultural storytelling.</p>
		
		<h2>Empowering Artisans</h2>
		<p>We work directly with weaving communities across the country, ensuring fair trade practices and sustainable livelihoods. By choosing Kalharam Kalyani, you are directly contributing to the preservation of ancient weaving techniques and the prosperity of the hands that craft them.</p>
		
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

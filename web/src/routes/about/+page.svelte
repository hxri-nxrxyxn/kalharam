<script lang="ts">
	import SimilarProducts from '$lib/components/SimilarProducts.svelte';
</script>

<svelte:head>
	<title>About Us - Kalharam Kalyani</title>
	<meta name="description" content="Discover the story behind Kalharam Kalyani and our commitment to authentic handlooms." />
</svelte:head>

<main class="about">
	<div class="about__content">
		<h1 class="about__title">About Us</h1>
		
		
		<p class="about__paragraph">Kalharam Kalyani was born from a deep reverence for India's rich handloom heritage. We are more than just a boutique; we are a celebration of the artisans, the weavers, and the generations of tradition that breathe life into every thread.</p>
		
		<h2 class="about__subtitle">Our Philosophy</h2>
		<p class="about__paragraph">In a world of fast fashion, we choose the slow, intentional rhythm of the loom. Every drape in our collection—from the breezy elegance of Mul Cotton to the regal weight of Kanchi Cotton—is meticulously curated to ensure unparalleled quality. We believe that a saree is not just a garment, but a canvas of cultural storytelling.</p>
		
		<h2 class="about__subtitle">Empowering Artisans</h2>
		<p class="about__paragraph">We work directly with weaving communities across the country, ensuring fair trade practices and sustainable livelihoods. By choosing Kalharam Kalyani, you are directly contributing to the preservation of ancient weaving techniques and the prosperity of the hands that craft them.</p>
		
	</div>
</main>

<SimilarProducts />

<style>
	.about {
		display: flex;
	}

	.about__content {
		width: 40%;
	}

	.about__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.about__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.about__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}


	
	
	
	
	

	@media (max-width: 900px) {
		.about__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.about__content {
			width: 100%;
		}
	}
</style>

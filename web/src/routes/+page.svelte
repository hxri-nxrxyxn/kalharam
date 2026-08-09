<script lang="ts">
	import ShopCatalog from '$lib/components/ShopCatalog.svelte';

	const websiteJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Kalharam',
		url: 'https://kalharam.com',
		potentialAction: {
			'@type': 'SearchAction',
			target: 'https://kalharam.com/?q={search_term_string}',
			'query-input': 'required name=search_term_string'
		}
	});
</script>

<svelte:head>
	<title>Kalharam - Premium Sarees for Women | Silk, Wedding & Party Wear</title>
	<meta
		name="description"
		content="Discover Kalharam's exclusive handloom collections. Shop premium sarees for women, including elegant silk sarees, stunning wedding collections, and party wear. Find the perfect traditional look."
	/>
	<link rel="canonical" href="https://kalharam.com" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://kalharam.com/" />
	<meta property="og:title" content="Kalharam - Premium Sarees for Women | Silk, Wedding & Party Wear" />
	<meta
		property="og:description"
		content="Discover Kalharam's exclusive handloom collections. Shop premium sarees for women, including elegant silk sarees, stunning wedding collections, and party wear."
	/>
	<meta property="og:image" content="https://kalharam.com/assets/types/banner-1.webp" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://kalharam.com/" />
	<meta name="twitter:title" content="Kalharam - Premium Sarees for Women" />
	<meta
		name="twitter:description"
		content="Discover Kalharam's exclusive handloom collections. Shop premium sarees for women, including elegant silk sarees, stunning wedding collections, and party wear."
	/>
	<meta name="twitter:image" content="https://kalharam.com/assets/types/banner-1.webp" />

	{@html `<script type="application/ld+json">${websiteJsonLd}</script>`}
</svelte:head>

<ShopCatalog categoryId="mul-cotton" />

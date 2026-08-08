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
	<title>Kalharam - Premium Sarees & Handloom Collections</title>
	<meta
		name="description"
		content="Discover Kalharam's exclusive handloom saree collections including Mul Cotton, Kanchi Cotton, Set Saree, Davani Half Saree, Onam Collections, Kalyani Cotton, and Narayan Peth."
	/>
	<link rel="canonical" href="https://kalharam.com" />
	<meta property="og:title" content="Kalharam - Premium Sarees & Handloom Collections" />
	<meta
		property="og:description"
		content="Discover Kalharam's exclusive handloom saree collections including Mul Cotton, Kanchi Cotton, Set Saree, Davani Half Saree, Onam Collections, Kalyani Cotton, and Narayan Peth."
	/>
	<meta property="og:url" content="https://kalharam.com" />
	<meta property="og:image" content="https://kalharam.com/assets/types/banner-1.png" />
	<meta name="twitter:title" content="Kalharam - Premium Sarees & Handloom Collections" />
	<meta
		name="twitter:description"
		content="Discover Kalharam's exclusive handloom saree collections including Mul Cotton, Kanchi Cotton, Set Saree, Davani Half Saree, Onam Collections, Kalyani Cotton, and Narayan Peth."
	/>
	<meta name="twitter:image" content="https://kalharam.com/assets/types/banner-1.png" />

	{@html `<script type="application/ld+json">${websiteJsonLd}</script>`}
</svelte:head>

<ShopCatalog categoryId="mul-cotton" />

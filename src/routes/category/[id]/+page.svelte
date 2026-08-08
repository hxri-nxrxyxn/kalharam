<script lang="ts">
	import { page } from '$app/state';
	import ShopCatalog from '$lib/components/ShopCatalog.svelte';
	import { categories } from '$lib/data';

	let categoryId = $derived(page.params.id);

	let currentCategory = $derived(
		categories.find((c) => c.id === categoryId) || categories[0]
	);

	let collectionJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: `${currentCategory.name} Saree Collection`,
			url: `https://kalharam.com/category/${currentCategory.id}`,
			description: `Explore the finest ${currentCategory.name} sarees and traditional handloom wear at Kalharam.`,
			breadcrumb: {
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: 'https://kalharam.com'
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: currentCategory.name,
						item: `https://kalharam.com/category/${currentCategory.id}`
					}
				]
			}
		})
	);
</script>

<svelte:head>
	<title>Kalharam - {currentCategory.name} Collection</title>
	<meta
		name="description"
		content="Explore the finest {currentCategory.name} sarees and traditional handloom wear at Kalharam."
	/>
	<link rel="canonical" href="https://kalharam.com/category/{currentCategory.id}" />
	<meta property="og:title" content="Kalharam - {currentCategory.name} Collection" />
	<meta
		property="og:description"
		content="Explore the finest {currentCategory.name} sarees and traditional handloom wear at Kalharam."
	/>
	<meta property="og:url" content="https://kalharam.com/category/{currentCategory.id}" />
	<meta property="og:image" content="https://kalharam.com{currentCategory.image}" />
	<meta name="twitter:title" content="Kalharam - {currentCategory.name} Collection" />
	<meta
		name="twitter:description"
		content="Explore the finest {currentCategory.name} sarees and traditional handloom wear at Kalharam."
	/>
	<meta name="twitter:image" content="https://kalharam.com{currentCategory.image}" />

	{@html `<script type="application/ld+json">${collectionJsonLd}</script>`}
</svelte:head>

<ShopCatalog categoryId={currentCategory.id} />

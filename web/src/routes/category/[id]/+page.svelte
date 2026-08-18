<script lang="ts">
	import type { PageData } from './$types';
	import ShopCatalog from '$lib/components/ShopCatalog.svelte';
	import { imageUrl } from '$lib/config';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let currentCategory = $derived(data.category);

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
	<title>{currentCategory.name} Sarees for Women - Wedding & Traditional Wear | Kalharam</title>
	<meta
		name="description"
		content="Explore the finest {currentCategory.name} sarees for women at Kalharam. Beautiful traditional design, perfect for wedding, party wear, and festive occasions."
	/>
	<link rel="canonical" href="https://kalharam.com/category/{currentCategory.id}" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://kalharam.com/category/{currentCategory.id}" />
	<meta property="og:title" content="{currentCategory.name} Sarees for Women | Kalharam" />
	<meta
		property="og:description"
		content="Explore the finest {currentCategory.name} sarees for women at Kalharam. Beautiful traditional design, perfect for wedding, party wear, and festive occasions."
	/>
	<meta property="og:image" content="{imageUrl(currentCategory.image)}" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://kalharam.com/category/{currentCategory.id}" />
	<meta name="twitter:title" content="{currentCategory.name} Sarees for Women | Kalharam" />
	<meta
		name="twitter:description"
		content="Explore the finest {currentCategory.name} sarees for women at Kalharam. Beautiful traditional design, perfect for wedding, party wear, and festive occasions."
	/>
	<meta name="twitter:image" content="{imageUrl(currentCategory.image)}" />

	{@html `<script type="application/ld+json">${collectionJsonLd}</script>`}
</svelte:head>

<ShopCatalog categoryId={currentCategory.id} />

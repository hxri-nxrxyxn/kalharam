<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Banner from '$lib/components/Banner.svelte';
	import CategoryTiles from '$lib/components/CategoryTiles.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { filterProducts, getCategories, getActualCategories, getProducts } from '$lib/data';
	import type { Category, Product } from '$lib/types';

	interface Props {
		categoryId: string;
	}

	let { categoryId }: Props = $props();

	let currentCategoryId = $derived(
		page.url.pathname.startsWith('/category/')
			? page.url.pathname.replace('/category/', '')
			: categoryId
	);

	let searchQuery = $state('');
	let sortBy = $state('featured');
	let minPrice = $state('');
	let maxPrice = $state('');

	let categories = $state<Category[]>([]);
	let rawCategories = $state<{ id: string; name: string }[]>([]);
	let rawProducts = $state<Product[]>([]);

	// Bumped when the tab regains focus so open tabs pick up admin edits
	let refreshKey = $state(0);

	// Find if currentCategoryId matches an actual category
	let matchingActualCategory = $derived(
		rawCategories.find((c) => c.id === currentCategoryId)
	);

	// Find the tile that matches the id or contains this category
	let activeTile = $derived(
		categories.find((c) => c.id === currentCategoryId) ||
		(matchingActualCategory ? categories.find((c) => c.categoryIds && c.categoryIds.includes(matchingActualCategory.id)) : undefined) ||
		categories[0]
	);

	let activeTileId = $derived(activeTile?.id ?? '');

	// Fetch categories globally for the catalog tiles
	$effect(() => {
		void refreshKey;
		Promise.all([getCategories(), getActualCategories()]).then(([tilesRes, catsRes]) => {
			categories = tilesRes;
			rawCategories = catsRes;
		});
	});

	// Reactively fetch products when category changes
	$effect(() => {
		void refreshKey;
		const isDirectCategory = matchingActualCategory !== undefined;
		const fetchOptions = isDirectCategory
			? { categoryId: currentCategoryId }
			: { tileId: activeTileId };

		getProducts(fetchOptions).then(res => {
			rawProducts = res;
		});
	});

	// Re-fetch when the tab becomes visible again, so the storefront always
	// reflects the latest changes made from the admin app.
	onMount(() => {
		const handleVisibility = () => {
			if (document.visibilityState === 'visible') refreshKey++;
		};
		document.addEventListener('visibilitychange', handleVisibility);
		return () => document.removeEventListener('visibilitychange', handleVisibility);
	});

	let currentCategory = $derived.by(() => {
		if (matchingActualCategory) {
			return {
				id: matchingActualCategory.id,
				name: matchingActualCategory.name,
				image: activeTile?.image || ''
			};
		}
		if (activeTile) {
			return activeTile;
		}
		return { id: '', name: 'Loading...', image: '' };
	});

	let filteredProducts = $derived(
		filterProducts(rawProducts, { searchQuery, sortBy, minPrice, maxPrice })
	);

	function handleApplyFilters(filters: {
		searchQuery: string;
		sortBy: string;
		minPrice: string;
		maxPrice: string;
	}) {
		searchQuery = filters.searchQuery;
		sortBy = filters.sortBy;
		minPrice = filters.minPrice;
		maxPrice = filters.maxPrice;
	}
</script>

<header class="catalog-header">
		<Banner />
		<CategoryTiles
			{categories}
			selectedCategoryId={activeTileId}
		/>
	</header>

<main>
	<section class="shopping">
		<div class="title-mask">
			<h1>{currentCategory.name}</h1>
		</div>
		<div class="shop">
			<div class="shop__sidebar">
				<Filters
					{searchQuery}
					{sortBy}
					{minPrice}
					{maxPrice}
					categoryId={activeTileId}
					onApply={handleApplyFilters}
				/>
			</div>
			<div class="shop__main">
				<ProductGrid products={filteredProducts} />
			</div>
		</div>
	</section>
</main>

<style>
	main {
		margin-top: 0;
	}

	.catalog-header {
		margin: 0 var(--spacing-xl);
		margin-top: var(--nav-offset);
	}

	@media (max-width: 900px) {
		.catalog-header {
			margin: 0;
			margin-top: var(--nav-offset);
		}
	}

	@media (max-width: 768px) {
		.catalog-header {
			margin: 0;
			margin-top: calc(1.8 * var(--spacing-xl));
		}
	}

	@media (max-width: 480px) {
		.catalog-header {
			margin: 0;
			margin-top: calc(2.0 * var(--spacing-xl));
		}
	}

	.shopping {
		padding: var(--spacing-xl) 0;
	}

	.title-mask {
		overflow: hidden;
		margin-bottom: var(--spacing-xl);
	}

	.shopping h1 {
		color: var(--color-primary);
	}

	.shop {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.shop__sidebar {
		width: 20%;
		position: sticky;
		top: var(--nav-offset);
		align-self: flex-start;
		z-index: 10;
	}

	.shop__main {
		width: 75%;
	}

	@media (max-width: 900px) {
		.shop {
			flex-direction: column;
		}

		.shop__sidebar {
			width: 100%;
			position: static;
			margin-bottom: var(--spacing-xl);
		}

		.shop__main {
			width: 100%;
		}
	}
</style>

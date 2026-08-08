<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Banner from '$lib/components/Banner.svelte';
	import CategoryTiles from '$lib/components/CategoryTiles.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { categories, filterProducts, getProductsForCategory, preloadAllImages } from '$lib/data';

	interface Props {
		categoryId: string;
	}

	let { categoryId }: Props = $props();

	let currentCategoryId = $derived(
		page.url.pathname.startsWith('/category/')
			? page.url.pathname.replace('/category/', '')
			: categoryId
	);

	onMount(() => {
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => preloadAllImages());
		} else {
			setTimeout(preloadAllImages, 200);
		}
	});

	let searchQuery = $state('');
	let sortBy = $state('featured');
	let minPrice = $state('');
	let maxPrice = $state('');

	let currentCategory = $derived(
		categories.find((c) => c.id === currentCategoryId) || categories[0]
	);

	let rawProducts = $derived(getProductsForCategory(currentCategory.id));

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

<main>
	<header>
		<Banner />
		<CategoryTiles
			{categories}
			selectedCategoryId={currentCategory.id}
		/>
	</header>

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
					categoryId={currentCategory.id}
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

<script lang="ts">
	import Banner from '$lib/components/Banner.svelte';
	import CategoryTiles from '$lib/components/CategoryTiles.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { categories, getProductsForCategory } from '$lib/data';

	let selectedCategoryId = $state('mul-cotton');
	let searchQuery = $state('');
	let sortBy = $state('featured');
	let minPrice = $state('');
	let maxPrice = $state('');

	let currentCategory = $derived(
		categories.find((c) => c.id === selectedCategoryId) || categories[0]
	);

	let rawProducts = $derived(getProductsForCategory(selectedCategoryId));

	let filteredProducts = $derived.by(() => {
		let list = [...rawProducts];

		// Search filter
		if (searchQuery.trim() !== '') {
			const query = searchQuery.toLowerCase().trim();
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.subtitle.toLowerCase().includes(query)
			);
		}

		// Min price filter
		if (minPrice !== '' && !isNaN(Number(minPrice))) {
			list = list.filter((p) => p.salePrice >= Number(minPrice));
		}

		// Max price filter
		if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
			list = list.filter((p) => p.salePrice <= Number(maxPrice));
		}

		// Sorting
		if (sortBy === 'price-low') {
			list.sort((a, b) => a.salePrice - b.salePrice);
		} else if (sortBy === 'price-high') {
			list.sort((a, b) => b.salePrice - a.salePrice);
		} else if (sortBy === 'rating') {
			list.sort((a, b) => b.rating - a.rating);
		} else if (sortBy === 'name') {
			list.sort((a, b) => a.title.localeCompare(b.title));
		}

		return list;
	});

	function handleSelectCategory(id: string) {
		selectedCategoryId = id;
	}
</script>

<svelte:head>
	<title>Kalharam - Premium Sarees & Handloom Collections</title>
	<meta
		name="description"
		content="Discover Kalharam's exclusive handloom saree collections including Mul Cotton, Kanchi Cotton, Set Saree, Davani Half Saree, Onam Collections, Kalyani Cotton, and Narayan Peth."
	/>
</svelte:head>

<main>
	<header>
		<Banner />
		<CategoryTiles
			{categories}
			{selectedCategoryId}
			onSelectCategory={handleSelectCategory}
		/>
	</header>

	<section class="shopping">
		<h1>{currentCategory.name}</h1>
		<div class="shop">
			<div class="shop__filters-wrapper">
				<Filters
					{searchQuery}
					{sortBy}
					{minPrice}
					{maxPrice}
					onSearchChange={(val) => (searchQuery = val)}
					onSortChange={(val) => (sortBy = val)}
					onMinPriceChange={(val) => (minPrice = val)}
					onMaxPriceChange={(val) => (maxPrice = val)}
				/>
			</div>
			<div class="shop__listings-wrapper">
				<ProductGrid products={filteredProducts} />
			</div>
		</div>
	</section>
</main>


<style>
	.shopping {
		margin: var(--spacing-xl);
	}

	.shopping h1 {
		margin-bottom: var(--spacing-xl);
		color: var(--color-primary);
	}

	.shop {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.shop__filters-wrapper {
		width: 20%;
		position: sticky;
		top: var(--nav-offset);
		align-self: flex-start;
		z-index: 10;
	}

	.shop__listings-wrapper {
		width: 75%;
	}

	@media (max-width: 900px) {
		.shop {
			flex-direction: column;
		}

		.shop__filters-wrapper {
			width: 100%;
			position: static;
			margin-bottom: var(--spacing-xl);
		}

		.shop__listings-wrapper {
			width: 100%;
		}
	}
</style>

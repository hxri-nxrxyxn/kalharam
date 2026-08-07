<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Banner from '$lib/components/Banner.svelte';
	import CategoryTiles from '$lib/components/CategoryTiles.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { categories, getProductsForCategory } from '$lib/data';

	let categoryId = $derived(page.params.id);

	let searchQuery = $state('');
	let sortBy = $state('featured');
	let minPrice = $state('');
	let maxPrice = $state('');

	let currentCategory = $derived(
		categories.find((c) => c.id === categoryId) || categories[0]
	);

	let rawProducts = $derived(getProductsForCategory(currentCategory.id));

	let filteredProducts = $derived.by(() => {
		let list = [...rawProducts];

		if (searchQuery.trim() !== '') {
			const query = searchQuery.toLowerCase().trim();
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.subtitle.toLowerCase().includes(query)
			);
		}

		if (minPrice !== '' && !isNaN(Number(minPrice))) {
			list = list.filter((p) => p.salePrice >= Number(minPrice));
		}

		if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
			list = list.filter((p) => p.salePrice <= Number(maxPrice));
		}

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
		goto(`/category/${id}`, { keepFocus: true, noScroll: true });
	}
</script>

<svelte:head>
	<title>Kalharam - {currentCategory.name} Collection</title>
	<meta
		name="description"
		content="Explore the finest {currentCategory.name} sarees and traditional handloom wear at Kalharam."
	/>
</svelte:head>

<main>
	<header>
		<Banner />
		<CategoryTiles
			{categories}
			selectedCategoryId={currentCategory.id}
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
		margin-top: var(--spacing-xl);
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
		}

		.shop__listings-wrapper {
			width: 100%;
		}
	}
</style>
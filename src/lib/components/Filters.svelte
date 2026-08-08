<script lang="ts">
	import Field from '$lib/components/Field.svelte';
	import { categories } from '$lib/data';
	import { goto } from '$app/navigation';

	interface Props {
		searchQuery?: string;
		sortBy?: string;
		minPrice?: string;
		maxPrice?: string;
		categoryId?: string;
		onApply: (filters: {
			searchQuery: string;
			sortBy: string;
			minPrice: string;
			maxPrice: string;
		}) => void;
	}

	let {
		searchQuery = '',
		sortBy = 'featured',
		minPrice = '',
		maxPrice = '',
		categoryId = '',
		onApply
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	let localSearchQuery = $state(searchQuery);
	// svelte-ignore state_referenced_locally
	let localSortBy = $state(sortBy);
	// svelte-ignore state_referenced_locally
	let localMinPrice = $state(minPrice);
	// svelte-ignore state_referenced_locally
	let localMaxPrice = $state(maxPrice);

	function handleApply() {
		onApply({
			searchQuery: localSearchQuery,
			sortBy: localSortBy,
			minPrice: localMinPrice,
			maxPrice: localMaxPrice
		});
	}

	function handleCategoryChange(e: Event) {
		const newCategory = (e.target as HTMLSelectElement).value;
		goto(`/category/${newCategory}`, { noScroll: true, keepFocus: true });
	}
</script>

<div class="shop__filters">
	<Field label="CATEGORY" icon="/assets/stroke-2px-24px/search.svg">
		<select
			aria-label="Select category"
			value={categoryId}
			onchange={handleCategoryChange}
			style="text-transform: capitalize;"
		>
			{#each categories as category (category.id)}
				<option value={category.id}>{category.name.toLowerCase()}</option>
			{/each}
		</select>
	</Field>

	<Field label="SEARCH" icon="/assets/stroke-2px-24px/search.svg">
		<input
			type="text"
			placeholder="Charulatha"
			aria-label="Search products"
			bind:value={localSearchQuery}
		/>
	</Field>

	<Field label="SORT BY" icon="/assets/stroke-2px-24px/sort.svg">
		<select
			aria-label="Sort products by"
			bind:value={localSortBy}
		>
			<option value="featured">Featured</option>
			<option value="price-low">Price: Low to High</option>
			<option value="price-high">Price: High to Low</option>
			<option value="rating">Highest Rated</option>
			<option value="name">Name (A-Z)</option>
		</select>
	</Field>

	<Field label="PRICE" icon="/assets/stroke-2px-24px/rupee.svg" inline={true}>
		<input
			type="number"
			placeholder="Min"
			aria-label="Minimum price"
			bind:value={localMinPrice}
		/>
		<p>TO</p>
		<input
			type="number"
			placeholder="Max"
			aria-label="Maximum price"
			bind:value={localMaxPrice}
		/>
	</Field>
	
	<button class="btn btn--primary" onclick={handleApply} style="width: 100%;">UPDATE</button>
</div>

<style>
	.shop__filters {
		width: 100%;
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
	}
</style>

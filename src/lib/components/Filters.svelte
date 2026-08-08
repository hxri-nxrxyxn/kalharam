<script lang="ts">
	interface Props {
		searchQuery: string;
		sortBy: string;
		minPrice: string;
		maxPrice: string;
		onSearchChange: (value: string) => void;
		onSortChange: (value: string) => void;
		onMinPriceChange: (value: string) => void;
		onMaxPriceChange: (value: string) => void;
	}

	let {
		searchQuery,
		sortBy,
		minPrice,
		maxPrice,
		onSearchChange,
		onSortChange,
		onMinPriceChange,
		onMaxPriceChange
	}: Props = $props();
</script>

<div class="shop__filters">
	<div class="filter">
		<div class="filter__text">
			<img src="/assets/stroke-2px-24px/search.svg" alt="" aria-hidden="true" />
			<h3>SEARCH</h3>
		</div>
		<div class="filter__input">
			<input
				type="text"
				placeholder="Charulatha"
				aria-label="Search products"
				value={searchQuery}
				oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
			/>
		</div>
	</div>

	<div class="filter">
		<div class="filter__text">
			<img src="/assets/stroke-2px-24px/sort.svg" alt="" aria-hidden="true" />
			<h3>SORT BY</h3>
		</div>
		<div class="filter__input">
			<select
				aria-label="Sort products by"
				value={sortBy}
				onchange={(e) => onSortChange((e.target as HTMLSelectElement).value)}
			>
				<option value="featured">Featured</option>
				<option value="price-low">Price: Low to High</option>
				<option value="price-high">Price: High to Low</option>
				<option value="rating">Highest Rated</option>
				<option value="name">Name (A-Z)</option>
			</select>
		</div>
	</div>

	<div class="filter filter--price">
		<div class="filter__text">
			<img src="/assets/stroke-2px-24px/rupee.svg" alt="" aria-hidden="true" />
			<h3>PRICE</h3>
		</div>
		<div class="filter__input">
			<input
				type="number"
				placeholder="Min"
				aria-label="Minimum price"
				value={minPrice}
				oninput={(e) => onMinPriceChange((e.target as HTMLInputElement).value)}
			/>
			<p>TO</p>
			<input
				type="number"
				placeholder="Max"
				aria-label="Maximum price"
				value={maxPrice}
				oninput={(e) => onMaxPriceChange((e.target as HTMLInputElement).value)}
			/>
		</div>
	</div>
</div>

<style>
	.shop__filters {
		width: 100%;
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
	}

	.filter {
		margin-bottom: var(--spacing-lg);
		width: 100%;
	}

	.filter img {
		height: var(--height-icon);
		filter: var(--filter-secondary);
	}

	.filter__text {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-sm);
		color: var(--color-secondary);
	}

	.filter--price .filter__input {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.filter--price p {
		color: var(--color-primary);
		font-weight: 600;
	}
</style>

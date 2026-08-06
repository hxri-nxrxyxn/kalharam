<script lang="ts">
	import gsap from 'gsap';

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

	function handleInputFocus(e: FocusEvent) {
		const filterBlock = (e.currentTarget as HTMLElement).closest('.filter');
		if (!filterBlock) return;
		const img = filterBlock.querySelector('.filter__text img');
		if (img) {
			gsap.to(img, { scale: 1.1, rotation: 3, duration: 0.2, ease: 'power2.out', force3D: true });
		}
	}

	function handleInputBlur(e: FocusEvent) {
		const filterBlock = (e.currentTarget as HTMLElement).closest('.filter');
		if (!filterBlock) return;
		const img = filterBlock.querySelector('.filter__text img');
		if (img) {
			gsap.to(img, { scale: 1, rotation: 0, duration: 0.2, ease: 'power2.out', force3D: true });
		}
	}
</script>

<div class="shop__filters">
	<div class="filter">
		<div class="filter__text">
			<img src="/assets/stroke-2px-24px/search.svg" alt="search" />
			<h3>SEARCH</h3>
		</div>
		<div class="filter__input">
			<input
				type="text"
				placeholder="Charulatha"
				value={searchQuery}
				oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
				onfocus={handleInputFocus}
				onblur={handleInputBlur}
			/>
		</div>
	</div>

	<div class="filter">
		<div class="filter__text">
			<img src="/assets/stroke-2px-24px/sort.svg" alt="sort" />
			<h3>SORT BY</h3>
		</div>
		<div class="filter__input">
			<select
				value={sortBy}
				onchange={(e) => onSortChange((e.target as HTMLSelectElement).value)}
				onfocus={handleInputFocus}
				onblur={handleInputBlur}
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
			<img src="/assets/stroke-2px-24px/rupee.svg" alt="rupee" />
			<h3>PRICE</h3>
		</div>
		<div class="filter__input">
			<input
				type="number"
				placeholder="Min"
				value={minPrice}
				oninput={(e) => onMinPriceChange((e.target as HTMLInputElement).value)}
				onfocus={handleInputFocus}
				onblur={handleInputBlur}
			/>
			<p>TO</p>
			<input
				type="number"
				placeholder="Max"
				value={maxPrice}
				oninput={(e) => onMaxPriceChange((e.target as HTMLInputElement).value)}
				onfocus={handleInputFocus}
				onblur={handleInputBlur}
			/>
		</div>
	</div>
</div>

<style>
	.shop__filters {
		width: 100%;
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

<script lang="ts">
	import { onMount } from "svelte";
	import gsap from "gsap";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { toast } from "svelte-sonner";
	import PageHeading from "$lib/components/page-heading.svelte";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import SearchIcon from "@lucide/svelte/icons/search";
	import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import CameraIcon from "@lucide/svelte/icons/camera";
	import UploadCloudIcon from "@lucide/svelte/icons/upload-cloud";
	import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import CheckIcon from "@lucide/svelte/icons/check";

	import { productsState } from "$lib/stores/app.svelte";

	type LocalProduct = {
		id: string;
		name: string;
		details: string;
		category: string; // The ID of the category
		rating: number;
		price: number;
		offerPrice: number;
		image: string; // Thumb URL
		imageId: string; // DB uid for the cover image
		stock: number;
		sold: number;
		demand: number;
	};

	let open = $state(false);
	let catOpen = $state(false);

	let allCategories = $state<{id: string, name: string}[]>([]);
	let allImages = $state<{uid: string, thumb_url: string, type: string, alt_text: string | null}[]>([]);

	let query = $state("");
	let filterCat = $state("All");

	// upload / edit form state
	let editingId: string | null = $state(null);
	let submitting = $state(false);
	let lastPublishedId: string | null = $state(null);
	let pName = $state("");
	let pSubtitle = $state("");
	let pCategory = $state("");
	let pPrice = $state(0);
	let pMrp = $state(0);
	let pImageId = $state("");

	async function loadData() {
		try {
			const [catRes, imgRes] = await Promise.all([
				fetch('http://localhost:3000/api/admin/raw-categories'),
				fetch('http://localhost:3000/api/admin/images')
			]);
			if (catRes.ok) allCategories = await catRes.json();
			if (imgRes.ok) allImages = await imgRes.json();
		} catch (e) {
			toast.error("Failed to load options");
		}
	}

	onMount(() => {
		loadData();
		
		const mm = gsap.matchMedia();
		mm.add("(prefers-reduced-motion: no-preference)", () => {
			gsap.from(".product-card", {
				autoAlpha: 0,
				y: 18,
				duration: 0.5,
				stagger: 0.06,
				ease: "power2.out",
				delay: 0.15
			});
		});
		return () => mm.revert();
	});

	const visibleProducts = $derived(
		productsState.filter((p) => {
			return (
				(filterCat === "All" || p.category === filterCat) &&
				(query.trim() === "" || p.name.toLowerCase().includes(query.trim().toLowerCase()))
			);
		})
	);

	function discountPct(p: import("$lib/types").Product) {
		return p.offerPrice != null && p.offerPrice > 0 && p.offerPrice > p.price
			? Math.round(((p.offerPrice - p.price) / p.offerPrice) * 100)
			: 0;
	}

	function reset() {
		editingId = null;
		pName = "";
		pSubtitle = "";
		pCategory = allCategories.length > 0 ? allCategories[0].id : "";
		pPrice = 0;
		pMrp = 0;
		pImageId = "";
	}

	function openAdd() {
		reset();
		open = true;
	}

	function openEdit(p: import("$lib/types").Product) {
		editingId = p.id;
		pName = p.name;
		pSubtitle = p.details;
		pCategory = p.category;
		pPrice = p.price;
		pMrp = p.offerPrice ?? 0;
		pImageId = p.imageId;
		open = true;
	}

	function formatMoney(n: number) {
		return "₹" + n.toLocaleString("en-IN");
	}

	async function submit() {
		if (submitting) return;
		if (!pName.trim()) return toast.error("Product name is required");
		if (!pCategory) return toast.error("Please select a category");
		if (!pImageId) return toast.error("Please select a cover image");
		
		submitting = true;
		const publishedId = editingId ?? `${pCategory}-prod-${Date.now()}`;
		
		try {
			const res = await fetch(`http://localhost:3000/api/admin/products`, {
				method: 'POST', // Mock POST logic (update if PUT needed later)
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: publishedId,
					title: pName.trim(),
					subtitle: pSubtitle.trim(),
					categoryId: pCategory,
					rating: 4.5,
					salePrice: pPrice,
					mrp: pMrp || pPrice,
					imageId: pImageId
				})
			});
			if (res.ok) {
				toast.success(`"${pName}" published`);
				// Force a quick sync from backend to avoid code dupe
				window.dispatchEvent(new Event('reload-store'));
			} else {
				throw new Error("Failed to save product");
			}
		} catch (e: any) {
			toast.error(e.message);
		} finally {
			submitting = false;
			open = false;
			reset();
			query = "";
			filterCat = "All";
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<PageHeading title="Products & Upload" description="Your catalog — adding here reflects on the live storefront" />
		<div class="flex items-center gap-2">
			<Button onclick={openAdd}>
				<PlusIcon data-icon="inline-start" /> New product
			</Button>
		</div>
	</div>

	<!-- filters -->
	<div class="flex flex-wrap items-center gap-3">
		<div class="relative w-full max-w-xs">
			<SearchIcon class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input type="search" placeholder="Search products…" bind:value={query} class="pl-8" />
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props} class="justify-between font-normal">
						{allCategories.find(c => c.id === filterCat)?.name || filterCat}
						<ChevronDownIcon class="size-4 opacity-60" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start" class="min-w-48">
				<DropdownMenu.Item onSelect={() => (filterCat = "All")}>
					{#if filterCat === "All"}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
					All
				</DropdownMenu.Item>
				{#each allCategories as c}
					<DropdownMenu.Item onSelect={() => (filterCat = c.id)}>
						{#if c.id === filterCat}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
						{c.name}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<p class="text-sm text-muted-foreground">
			Showing {visibleProducts.length} of {productsState.length} products
		</p>
	</div>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each visibleProducts as p (p.id)}
			<Card.Root
				id={"prod-" + p.id}
				class="product-card overflow-hidden"
			>
				<div class="relative aspect-[4/3] w-full overflow-hidden bg-muted">
					{#if p.image}
						<img src={p.image} alt={p.name} class="size-full object-cover" />
					{/if}
					<Badge class="absolute left-2 top-2 bg-background/85 text-foreground backdrop-blur">{allCategories.find(c => c.id === p.category)?.name || p.category}</Badge>
					{#if p.stock === 0}
						<Badge variant="destructive" class="absolute right-2 top-2 bg-background/85 backdrop-blur">Out</Badge>
					{/if}
					{#if discountPct(p) > 0}
						<Badge class="absolute bottom-2 left-2 bg-emerald-500 text-white backdrop-blur">{discountPct(p)}% OFF</Badge>
					{/if}
				</div>
				<Card.Header class="flex-row items-start justify-between gap-2">
					<Card.Title class="truncate text-sm">{p.name}</Card.Title>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button variant="ghost" size="icon-sm" {...props} class="shrink-0 text-muted-foreground" aria-label={`Edit ${p.name}`}>
									<MoreHorizontalIcon class="size-4" />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item onSelect={() => openEdit(p)}>
								<PencilIcon class="size-4" /> Edit
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					<Card.Description class="line-clamp-2 text-xs">{p.details}</Card.Description>
					<div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
						{#if discountPct(p) > 0}
							<span class="line-through">{formatMoney(p.offerPrice || 0)}</span>
							<span class="text-sm font-semibold text-foreground">{formatMoney(p.price)}</span>
							<Badge class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Save {discountPct(p)}%</Badge>
						{:else}
							<span>{formatMoney(p.price)}</span>
						{/if}
						<span class="ml-auto">Stock: <span class="font-medium text-foreground">{p.stock}</span></span>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
		{#if visibleProducts.length === 0}
			<p class="col-span-full py-10 text-center text-sm text-muted-foreground">No products match your filters.</p>
		{/if}
	</div>
</div>

<Dialog.Root bind:open>
	<Dialog.Content class="flex max-h-[85dvh] flex-col sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{editingId ? "Edit product" : "Add product"}</Dialog.Title>
			<Dialog.Description>
				Configure your product metadata.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-4 overflow-y-auto py-2 pr-1">
			
			<div class="flex flex-col gap-1.5">
				<Label>Cover Image</Label>
				<select bind:value={pImageId} class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring">
					<option value="">-- Select an Image --</option>
					{#each allImages as img}
						<option value={img.uid}>{img.alt_text || img.uid}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="p-name">Product name</Label>
				<Input id="p-name" bind:value={pName} placeholder="e.g. Mul Cotton Saree" />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="p-cat">Saree type / Category</Label>
				<DropdownMenu.Root bind:open={catOpen}>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" id="p-cat" {...props} class="w-full justify-between font-normal">
								{allCategories.find(c => c.id === pCategory)?.name || "Select Category..."}
								<ChevronDownIcon class="size-4 opacity-60" />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start" class="w-full min-w-48">
						{#each allCategories as c}
							<DropdownMenu.Item onSelect={() => (pCategory = c.id)}>
								{#if c.id === pCategory}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
								{c.name}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="p-details">Subtitle Details</Label>
				<Textarea id="p-details" bind:value={pSubtitle} rows={2} placeholder="e.g. Handloom Classic Saree" />
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1.5">
					<Label for="p-offer">MRP (₹)</Label>
					<Input id="p-offer" type="number" min="0" bind:value={pMrp} onfocus={(e) => e.currentTarget.select()} />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="p-price">Sale Price (₹)</Label>
					<Input id="p-price" type="number" min="0" bind:value={pPrice} onfocus={(e) => e.currentTarget.select()} />
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={submitting}>Cancel</Button>
			<Button onclick={submit} disabled={submitting}>
				{#if submitting}
					<LoaderCircleIcon class="animate-spin" data-icon="inline-start" />
					{editingId ? "Saving…" : "Publishing…"}
				{:else}
					<UploadCloudIcon data-icon="inline-start" /> {editingId ? "Save changes" : "Publish"}
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

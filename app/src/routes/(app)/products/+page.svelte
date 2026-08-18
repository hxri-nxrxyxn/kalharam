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
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import CameraIcon from "@lucide/svelte/icons/camera";
	import UploadCloudIcon from "@lucide/svelte/icons/upload-cloud";
	import LoaderCircleIcon from "@lucide/svelte/icons/loader-circle";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import CheckIcon from "@lucide/svelte/icons/check";
	import XIcon from "@lucide/svelte/icons/x";
	import ImagePlusIcon from "@lucide/svelte/icons/image-plus";

	import { productsState, categoriesState, auth } from "$lib/stores/app.svelte";
	import { API_BASE, apiFetch, imageUrl } from "$lib/config";

	type LocalProduct = {
		id: string;
		name: string;
		details: string;
		category: string; // The ID of the category
		color?: string;
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

	let allImages = $state<{uid: string, thumb_url: string, type: string, alt_text: string | null}[]>([]);

	let query = $state("");
	let filterCat = $state("All");
	let filterStatus = $state("all");

	const statusOptions = [
		{ value: "all", label: "All stock levels" },
		{ value: "out", label: "Out of stock" },
		{ value: "low", label: "Low stock" },
		{ value: "in", label: "In stock" }
	];
	const filterStatusLabel = $derived(statusOptions.find((s) => s.value === filterStatus)?.label ?? "All stock levels");

	// upload / edit form state
	let editingId: string | null = $state(null);
	let submitting = $state(false);
	let lastPublishedId: string | null = $state(null);
	let pName = $state("");
	let pSubtitle = $state("");
	let pCategory = $state("");
	let pColor = $state("");
	let pStock = $state(10);
	let pPrice = $state(0);
	let pMrp = $state(0);
	let pImageId = $state("");
	let pGallery = $state<string[]>([]);
	
	let cameraInputRef: HTMLInputElement | null = $state(null);

	async function loadData() {
		if (!auth.user) return;
		try {
			const imgRes = await apiFetch(`${API_BASE}/admin/images`);
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
			const status = p.stock === 0 ? "out" : p.stock < 3 ? "low" : "in";
			return (
				(filterCat === "All" || p.category === filterCat) &&
				(filterStatus === "all" || status === filterStatus) &&
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
		pCategory = categoriesState.length > 0 ? categoriesState[0].id : "";
		pColor = "";
		pStock = 10;
		pPrice = 0;
		pMrp = 0;
		pImageId = "";
		pGallery = [];
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
		pColor = p.color ?? "";
		pStock = p.stock;
		pPrice = p.price;
		pMrp = p.offerPrice ?? 0;
		pImageId = p.imageId;
		// Mock reconstructing gallery if present, else just cover
		pGallery = p.images ? [...p.images] : (p.imageId ? [p.imageId] : []);
		open = true;
	}

	function formatMoney(n: number) {
		return "₹" + n.toLocaleString("en-IN");
	}

	let fileInputRef: HTMLInputElement | null = $state(null);
	let isUploadingImage = $state(false);

	async function handleUpload(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files || files.length === 0) return;
		
		if (pGallery.length + files.length > 3) {
			toast.error("Maximum 3 images allowed per product.");
			return;
		}

		isUploadingImage = true;
		try {
			for (let i = 0; i < files.length; i++) {
				const formData = new FormData();
				formData.append('image', files[i]);
				formData.append('alt_text', `${pName} Image ${i + 1}`);
				formData.append('type', 'product');

				const res = await apiFetch(`${API_BASE}/admin/images/upload`, {
					method: 'POST',
					body: formData
				});
				const data = await res.json();
				if (res.ok) {
					pGallery = [...pGallery, data.uid];
					// First uploaded image becomes the cover by default if not set
					if (!pImageId) pImageId = data.uid;
					toast.success(`Image ${i + 1} uploaded`);
				} else {
					toast.error(data.error || "Upload failed");
				}
			}
			await loadData();
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			isUploadingImage = false;
			if (fileInputRef) fileInputRef.value = '';
		}
	}

	function removePhoto(index: number) {
		const removed = pGallery.splice(index, 1);
		// If we removed the cover image, pick the next one or blank it
		if (removed[0] === pImageId) {
			pImageId = pGallery.length > 0 ? pGallery[0] : "";
		}
	}

	async function submit() {
		if (submitting) return;
		if (!pName.trim()) return toast.error("Product name is required");
		if (!pCategory) return toast.error("Please select a category");
		if (!pMrp || pMrp <= 0) return toast.error("MRP is required");
		if (!pPrice || pPrice <= 0) return toast.error("Sale price is required");
		if (pPrice > pMrp) return toast.error("Sale price cannot be greater than MRP");
		if (pGallery.length === 0) return toast.error("Please add at least one product photo");
		
		submitting = true;
		const publishedId = editingId ?? `${pCategory}-prod-${Date.now()}`;
		const finalSalePrice = pPrice > 0 ? pPrice : pMrp;
		
		try {
			const method = editingId ? 'PUT' : 'POST';
			const res = await apiFetch(`${API_BASE}/admin/products${editingId ? '/' + editingId : ''}`, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: publishedId,
					title: pName.trim(),
					subtitle: pSubtitle.trim(),
					categoryId: pCategory,
					color: pColor.trim(),
					stock: pStock,
					salePrice: finalSalePrice,
					mrp: pMrp,
					imageId: pImageId || pGallery[0],
					galleryImages: pGallery
				})
			});
			if (res.ok) {
				toast.success(`"${pName}" ${editingId ? 'updated' : 'published'}`);
				// Reload UI cleanly
				window.dispatchEvent(new Event('reload-store'));
			} else {
				throw new Error("Failed to save product");
			}
		} catch (e: unknown) {
			toast.error(e instanceof Error ? e.message : String(e));
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
						{categoriesState.find(c => c.id === filterCat)?.name || filterCat}
						<ChevronDownIcon class="size-4 opacity-60" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start" class="min-w-48">
				<DropdownMenu.Item onSelect={() => (filterCat = "All")}>
					{#if filterCat === "All"}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
					All
				</DropdownMenu.Item>
				{#each categoriesState as c}
					<DropdownMenu.Item onSelect={() => (filterCat = c.id)}>
						{#if c.id === filterCat}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
						{c.name}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props} class="justify-between font-normal">
						{filterStatusLabel}
						<ChevronDownIcon class="size-4 opacity-60" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start" class="min-w-44">
				{#each statusOptions as s}
					<DropdownMenu.Item onSelect={() => (filterStatus = s.value)}>
						{#if filterStatus === s.value}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
						{s.label}
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
						<img src={imageUrl(p.image)} alt={p.name} class="size-full object-cover" />
					{/if}
					<Badge class="absolute left-2 top-2 bg-background/85 text-foreground backdrop-blur">{categoriesState.find(c => c.id === p.category)?.name || p.category}</Badge>
					{#if p.stock === 0}
						<Badge variant="destructive" class="absolute right-2 top-2 bg-background/85 backdrop-blur">Out</Badge>
					{/if}
					{#if discountPct(p) > 0}
						<Badge class="absolute bottom-2 left-2 bg-emerald-500 text-white backdrop-blur">{discountPct(p)}% OFF</Badge>
					{/if}
				</div>
				<Card.Header>
					<div class="flex items-center justify-between gap-2">
						<Card.Title class="min-w-0 truncate text-sm">{p.name}</Card.Title>
						<Button
							variant="ghost"
							size="sm"
							class="shrink-0 text-muted-foreground"
							onclick={() => openEdit(p)}
							aria-label={`Edit ${p.name}`}
						>
							<PencilIcon class="size-4" />
							Edit
						</Button>
					</div>
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
			
			<div class="flex flex-col gap-2">
				<Label>Product Gallery</Label>
				{#if pGallery.length > 0}
					<div class="grid grid-cols-3 gap-2">
						{#each pGallery as photoUid, i (photoUid)}
							{@const img = allImages.find(x => x.uid === photoUid)}
							<div class="relative aspect-square overflow-hidden rounded-lg border {photoUid === pImageId ? 'ring-2 ring-primary' : ''}">
								{#if img}
									<img src={imageUrl(img.thumb_url)} alt={`photo ${i + 1}`} class="size-full object-cover" />
								{/if}
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									class="absolute right-1 top-1 size-6 bg-background/85 backdrop-blur"
									aria-label={`Remove photo ${i + 1}`}
									onclick={() => removePhoto(i)}
								>
									<XIcon class="size-3" />
								</Button>
								<button 
									class="absolute bottom-1 left-1 right-1 bg-background/85 text-[10px] py-0.5 rounded text-center backdrop-blur cursor-pointer hover:bg-primary hover:text-primary-foreground"
									onclick={() => pImageId = photoUid}
								>
									{photoUid === pImageId ? 'Cover' : 'Make Cover'}
								</button>
							</div>
						{/each}
					</div>
				{/if}
				<div class="flex gap-2 mt-1">
					<button
						type="button"
						onclick={() => fileInputRef?.click()}
						class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
						disabled={isUploadingImage}
					>
						{#if isUploadingImage}
							<LoaderCircleIcon class="size-4 animate-spin" />
						{:else}
							<ImagePlusIcon class="size-4" /> Files
						{/if}
					</button>
					<button
						type="button"
						onclick={() => cameraInputRef?.click()}
						class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
						disabled={isUploadingImage}
					>
						<CameraIcon class="size-4" /> Camera
					</button>
					<input type="file" accept="image/*" multiple class="hidden" bind:this={fileInputRef} onchange={handleUpload} />
					<input type="file" accept="image/*" capture="environment" multiple class="hidden" bind:this={cameraInputRef} onchange={handleUpload} />
				</div>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="p-name">Product name</Label>
				<Input id="p-name" bind:value={pName} placeholder="e.g. Mul Cotton Saree" />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="p-color">Color</Label>
				<Input id="p-color" bind:value={pColor} placeholder="e.g. Emerald Green" />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="p-cat">Category</Label>
				<DropdownMenu.Root bind:open={catOpen}>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" id="p-cat" {...props} class="w-full justify-between font-normal">
								{categoriesState.find(c => c.id === pCategory)?.name || "Select Category..."}
								<ChevronDownIcon class="size-4 opacity-60" />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start" class="w-full min-w-48">
						{#each categoriesState as c}
							<DropdownMenu.Item onSelect={() => (pCategory = c.id)}>
								{#if c.id === pCategory}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
								{c.name}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="p-details">Description</Label>
				<Textarea id="p-details" bind:value={pSubtitle} rows={3} placeholder="e.g. Handloom Classic Saree, handwoven with fine detailing" />
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
			
			<div class="flex flex-col gap-1.5">
				<Label for="p-stock">Stock Units</Label>
				<Input id="p-stock" type="number" min="0" bind:value={pStock} onfocus={(e) => e.currentTarget.select()} />
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

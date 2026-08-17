<script lang="ts">
	import PageHeading from "$lib/components/page-heading.svelte";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { toast } from "svelte-sonner";
	import { onMount } from "svelte";
	import XIcon from "@lucide/svelte/icons/x";
	import { API_BASE } from "$lib/config";
	import { categoriesState } from "$lib/stores/app.svelte";

	type Tile = {
		id: number;
		title: string;
		imageId: string;
		categoryIds: string[];
		image: string | null;
	};

	let tiles = $state<Tile[]>([]);

	let isSaving = $state(false);

	let fileInputRef: HTMLInputElement | null = $state(null);
	let isUploading = $state(false);
	let uploadTarget = $state<Tile | null>(null);

	async function loadData() {
		try {
			const tilesRes = await fetch(`${API_BASE}/admin/tiles`);
			if (tilesRes.ok) tiles = await tilesRes.json();
		} catch (e) {
			toast.error("Failed to load layout data.");
		}
	}

	async function handleUpload(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		const tile = uploadTarget;
		if (!files || files.length === 0 || !tile) return;

		isUploading = true;
		try {
			const formData = new FormData();
			formData.append('image', files[0]);
			formData.append('alt_text', `${tile.title || 'Tile'} Image`);
			formData.append('type', 'tile');

			const res = await fetch(`${API_BASE}/admin/images/upload`, {
				method: 'POST',
				body: formData
			});
			const data = await res.json();
			if (res.ok) {
				tile.imageId = data.uid;
				tile.image = data.thumb_url;
				toast.success("Tile image uploaded. Click Save Tile to persist.");
			} else {
				throw new Error(data.error || "Upload failed");
			}
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			isUploading = false;
			if (fileInputRef) fileInputRef.value = '';
		}
	}

	function pickFile(tile: Tile) {
		uploadTarget = tile;
		fileInputRef?.click();
	}

	async function handleDeleteImage(uid: string) {
		if (!uid) return;
		try {
			const res = await fetch(`${API_BASE}/admin/images/${uid}`, {
				method: 'DELETE'
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok) {
				toast.success("Tile image removed.");
				await loadData();
			} else {
				throw new Error(data.error || "Delete failed");
			}
		} catch (err: any) {
			toast.error(err.message);
		}
	}

	onMount(loadData);

	async function saveTile(tile: Tile) {
		isSaving = true;
		try {
			const res = await fetch(`${API_BASE}/admin/tiles/${tile.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: tile.title,
					imageId: tile.imageId,
					categoryIds: tile.categoryIds
				})
			});
			if (res.ok) {
				toast.success(`Tile ${tile.id} updated successfully.`);
			} else {
				throw new Error("API Error");
			}
		} catch (e) {
			toast.error(`Failed to update Tile ${tile.id}.`);
		} finally {
			isSaving = false;
		}
	}

	function toggleCategory(tile: Tile, catId: string) {
		const idx = tile.categoryIds.indexOf(catId);
		if (idx >= 0) {
			tile.categoryIds.splice(idx, 1);
		} else {
			tile.categoryIds.push(catId);
		}
	}
</script>

<div class="flex flex-col gap-6">
	<PageHeading title="Layouts" description="Configure up to 18 category tiles on the storefront homepage" />

	<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
		{#each tiles as tile}
			<Card.Root>
				<Card.Header>
					<Card.Title>Slot {tile.id}</Card.Title>
					<Card.Description>Shown on homepage</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<div class="grid gap-2">
						<Label>Tile Image</Label>
						<div class="flex items-center gap-2">
							<Button variant="outline" size="sm" class="w-full" onclick={() => pickFile(tile)} disabled={isUploading}>
								{isUploading ? "Uploading..." : "Upload Cover Image"}
							</Button>
						</div>
						<div class="relative">
							{#if tile.image}
								<img src={tile.image} alt="Tile preview" class="w-full h-32 object-cover rounded-md mt-2" />
							{:else}
								<div class="mt-2 flex h-32 w-full items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">No image yet</div>
							{/if}
							{#if tile.imageId}
								<button
									type="button"
									title="Remove tile image"
									aria-label="Remove tile image"
									class="absolute right-2 top-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 p-1.5 shadow-md transition-colors cursor-pointer"
									onclick={() => handleDeleteImage(tile.imageId)}
								>
									<XIcon class="size-4" />
								</button>
							{/if}
						</div>
					</div>

					<div class="grid gap-2">
						<Label>Tile Title</Label>
						<Input bind:value={tile.title} placeholder="e.g. Summer Collection" />
					</div>

					<div class="grid gap-2">
						<Label>Assigned Categories</Label>
						<div class="flex flex-col gap-1 border p-2 rounded-md h-32 overflow-y-auto">
							{#each categoriesState as cat}
								<label class="flex items-center gap-2 text-sm">
									<input 
										type="checkbox" 
										checked={tile.categoryIds.includes(cat.id)}
										onchange={() => toggleCategory(tile, cat.id)}
									/>
									{cat.name}
								</label>
							{/each}
							{#if categoriesState.length === 0}
								<span class="text-xs text-muted-foreground">No categories available.</span>
							{/if}
						</div>
						<p class="text-xs text-muted-foreground">Select one or more categories to aggregate their products under this tile.</p>
					</div>
				</Card.Content>
				<Card.Footer>
					<Button class="w-full" disabled={isSaving} onclick={() => saveTile(tile)}>Save Tile {tile.id}</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>

	<input
		type="file"
		accept="image/*"
		class="hidden"
		bind:this={fileInputRef}
		onchange={(e) => handleUpload(e)}
	/>
</div>

<script lang="ts">
	import PageHeading from "$lib/components/page-heading.svelte";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { toast } from "svelte-sonner";
	import { onMount } from "svelte";

	type Tile = {
		id: number;
		title: string;
		imageId: string;
		categoryIds: string[];
		image: string | null;
	};

	let tiles = $state<Tile[]>([]);
	let allCategories = $state<{id: string, name: string}[]>([]);
	let allImages = $state<{uid: string, thumb_url: string, type: string, alt_text: string | null}[]>([]);

	let isSaving = $state(false);

	async function loadData() {
		try {
			const [tilesRes, catRes, imgRes] = await Promise.all([
				fetch('http://localhost:3000/api/admin/tiles'),
				fetch('http://localhost:3000/api/categories'),
				fetch('http://localhost:3000/api/admin/images')
			]);
			
			if (tilesRes.ok) tiles = await tilesRes.json();
			// We might need an admin endpoint for raw categories since public uses tiles now
			if (imgRes.ok) allImages = await imgRes.json();
			
			// Let's get raw categories
			const rawCatRes = await fetch('http://localhost:3000/api/admin/raw-categories');
			if (rawCatRes.ok) allCategories = await rawCatRes.json();
			
		} catch (e) {
			toast.error("Failed to load layout data.");
		}
	}

	onMount(loadData);

	async function saveTile(tile: Tile) {
		isSaving = true;
		try {
			const res = await fetch(`http://localhost:3000/api/admin/tiles/${tile.id}`, {
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
	<PageHeading title="Layouts" description="Configure the 8 category tiles on the storefront homepage" />

	<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
		{#each tiles as tile}
			<Card.Root>
				<Card.Header>
					<Card.Title>Slot {tile.id}</Card.Title>
					<Card.Description>Shown on homepage</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<div class="grid gap-2">
						<Label>Tile Title</Label>
						<Input bind:value={tile.title} placeholder="e.g. Summer Collection" />
					</div>

					<div class="grid gap-2">
						<Label>Assigned Categories</Label>
						<div class="flex flex-col gap-1 border p-2 rounded-md h-32 overflow-y-auto">
							{#each allCategories as cat}
								<label class="flex items-center gap-2 text-sm">
									<input 
										type="checkbox" 
										checked={tile.categoryIds.includes(cat.id)}
										onchange={() => toggleCategory(tile, cat.id)}
									/>
									{cat.name}
								</label>
							{/each}
							{#if allCategories.length === 0}
								<span class="text-xs text-muted-foreground">No categories available.</span>
							{/if}
						</div>
						<p class="text-xs text-muted-foreground">Select one or more categories to aggregate their products under this tile.</p>
					</div>
					
					<div class="grid gap-2">
						<Label>Tile Image</Label>
						<select bind:value={tile.imageId} class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
							<option value="">-- Select an Image --</option>
							{#each allImages as img}
								<option value={img.uid}>{img.alt_text || img.uid}</option>
							{/each}
						</select>
						{#if tile.imageId}
							{@const selectedImg = allImages.find(i => i.uid === tile.imageId)}
							{#if selectedImg}
								<img src={selectedImg.thumb_url} alt="preview" class="w-full h-24 object-cover mt-2 rounded-md" />
							{/if}
						{/if}
					</div>
				</Card.Content>
				<Card.Footer>
					<Button class="w-full" disabled={isSaving} onclick={() => saveTile(tile)}>Save Tile {tile.id}</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>

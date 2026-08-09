<script lang="ts">
	import PageHeading from "$lib/components/page-heading.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Table from "$lib/components/ui/table";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { toast } from "svelte-sonner";
	import { onMount } from "svelte";
	import XIcon from "@lucide/svelte/icons/x";
	import PlusIcon from "@lucide/svelte/icons/plus";

	type Category = {
		id: string;
		name: string;
		imageId: string;
	};

	let categories = $state<Category[]>([]);
	let allImages = $state<{uid: string, thumb_url: string, type: string, alt_text: string | null}[]>([]);

	let isSaving = $state(false);

	let showAddModal = $state(false);
	let newCatName = $state("");
	let newCatId = $derived(generateSlug(newCatName));
	let newCatImage = $state("");

	function generateSlug(name: string) {
		return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
	}

	async function parseJson(res: Response) {
		const text = await res.text();
		try {
			return JSON.parse(text);
		} catch {
			return {};
		}
	}

	let editingCategory = $state<Category | null>(null);

	let fileInputRef: HTMLInputElement | null = $state(null);
	let isUploading = $state(false);

	function resetAddModal() {
		newCatName = "";
		newCatImage = "";
		showAddModal = true;
	}

	async function loadData() {
		try {
			const [catRes, imgRes] = await Promise.all([
				fetch('http://localhost:3000/api/admin/raw-categories'),
				fetch('http://localhost:3000/api/admin/images')
			]);
			
			if (catRes.ok) categories = await catRes.json();
			if (imgRes.ok) allImages = await imgRes.json();
			
		} catch (e) {
			toast.error("Failed to load categories.");
		}
	}

	async function handleUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('image', file);
		formData.append('alt_text', (editingCategory ? editingCategory.name : newCatName) || 'Category Image');
		formData.append('type', 'category');

		isUploading = true;
		try {
			const res = await fetch('http://localhost:3000/api/admin/images/upload', {
				method: 'POST',
				body: formData
			});
			const data = await parseJson(res);
			if (res.ok) {
				toast.success("Image uploaded successfully!");
				await loadData();
				// Auto-select the newly uploaded image
				newCatImage = data.uid;
				if (editingCategory) editingCategory.imageId = data.uid;
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

	async function handleDeleteImage(uid: string) {
		if (!uid) return;
		try {
			const res = await fetch(`http://localhost:3000/api/admin/images/${uid}`, {
				method: 'DELETE'
			});
			const data = await parseJson(res);
			if (res.ok) {
				toast.success("Image deleted from storage.");
				if (newCatImage === uid) newCatImage = "";
				if (editingCategory?.imageId === uid) editingCategory.imageId = "";
				await loadData();
			} else {
				throw new Error(data.error || "Delete failed");
			}
		} catch (err: any) {
			toast.error(err.message);
		}
	}

	onMount(loadData);

	async function handleAdd() {
		if (!newCatId || !newCatName || !newCatImage) {
			toast.error("Please fill all fields.");
			return;
		}

		isSaving = true;
		try {
			const res = await fetch(`http://localhost:3000/api/admin/categories`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: newCatId,
					name: newCatName,
					imageId: newCatImage
				})
			});
			const data = await parseJson(res);
			if (res.ok) {
				toast.success("Category created!");
				showAddModal = false;
				newCatName = "";
				newCatImage = "";
				await loadData();
			} else {
				throw new Error(data.error || "API Error");
			}
		} catch (e: any) {
			toast.error(e.message || "Failed to create category.");
		} finally {
			isSaving = false;
		}
	}

	async function handleEdit() {
		if (!editingCategory || !editingCategory.name || !editingCategory.imageId) {
			toast.error("Please fill all fields.");
			return;
		}

		isSaving = true;
		try {
			const res = await fetch(`http://localhost:3000/api/admin/categories/${editingCategory.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: editingCategory.name,
					imageId: editingCategory.imageId
				})
			});
			const data = await parseJson(res);
			if (res.ok) {
				toast.success("Category updated!");
				editingCategory = null;
				await loadData();
			} else {
				throw new Error(data.error || "API Error");
			}
		} catch (e: any) {
			toast.error(e.message || "Failed to update category.");
		} finally {
			isSaving = false;
		}
	}

	let deleteTarget = $state<Category | null>(null);

	async function handleDelete(id: string) {
		try {
			const res = await fetch(`http://localhost:3000/api/admin/categories/${id}`, {
				method: 'DELETE'
			});
			const data = await parseJson(res);
			if (res.ok) {
				toast.success("Category deleted.");
				await loadData();
			} else {
				throw new Error(data.error || "Failed to delete category.");
			}
		} catch (e: any) {
			toast.error(e.message || "Failed to delete category.");
		}
	}

	function startEdit(c: Category) {
		editingCategory = { ...c };
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<PageHeading title="Categories" description="Manage your storefront product categories" />
		<div class="flex items-center gap-2">
			<Button onclick={resetAddModal}>
				<PlusIcon data-icon="inline-start" /> Add Category
			</Button>
		</div>
	</div>

	<Card.Root>
		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>ID (Slug)</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Image</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each categories as c (c.id)}
						<Table.Row>
							<Table.Cell class="font-medium">{c.id}</Table.Cell>
							<Table.Cell>{c.name}</Table.Cell>
							<Table.Cell>
								{#if c.imageId}
									{@const img = allImages.find(i => i.uid === c.imageId)}
									{#if img}
										<img src={img.thumb_url} alt="cat" class="w-12 h-12 object-cover rounded" />
									{/if}
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="ghost" size="sm" onclick={() => startEdit(c)}>Edit</Button>
								<Button variant="ghost" size="sm" class="text-red-500 hover:text-red-700" onclick={() => (deleteTarget = c)}>Delete</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
					{#if categories.length === 0}
						<Table.Row>
							<Table.Cell colspan={4} class="text-center text-muted-foreground py-8">No categories found.</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>

<input type="file" accept="image/*" class="hidden" bind:this={fileInputRef} onchange={handleUpload} />

<Dialog.Root bind:open={showAddModal}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add New Category</Dialog.Title>
			<Dialog.Description>Create a new product grouping.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label>Name</Label>
				<Input bind:value={newCatName} placeholder="e.g. Kanchi Cotton" />
			</div>
			<div class="grid gap-2">
				<Label>ID (Slug)</Label>
				<Input value={newCatId} disabled class="bg-muted text-muted-foreground" />
				<p class="text-xs text-muted-foreground">Auto-generated identifier used for routing and linking.</p>
			</div>
			<div class="grid gap-2">
				<Label>Category Image</Label>
				<div class="flex items-center gap-2">
					<Button variant="outline" size="sm" class="w-full" onclick={() => fileInputRef?.click()} disabled={isUploading}>
						{isUploading ? "Uploading..." : "Upload Cover Image"}
					</Button>
				</div>
				{#if newCatImage}
					{@const img = allImages.find(i => i.uid === newCatImage)}
					{#if img}
						<div class="relative mt-2 w-32 h-32 border rounded-md overflow-hidden bg-muted">
							<img src={img.thumb_url} alt="preview" class="w-full h-full object-cover" />
							<button 
								type="button"
								class="absolute top-1 right-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full p-1.5 shadow-md transition-colors cursor-pointer z-10" 
								onclick={() => handleDeleteImage(img.uid)}
								title="Delete photo from storage"
								aria-label="Delete photo from storage"
							>
								<XIcon class="size-4" />
							</button>
						</div>
					{/if}
				{/if}
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="secondary" onclick={() => {
				if (newCatImage) handleDeleteImage(newCatImage);
				showAddModal = false;
			}}>Cancel</Button>
			<Button onclick={handleAdd} disabled={isSaving}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root open={!!editingCategory} onOpenChange={(open) => { if (!open) editingCategory = null; }}>
	{#if editingCategory}
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Edit Category</Dialog.Title>
				<Dialog.Description>Updating {editingCategory.id}</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label>Name</Label>
					<Input bind:value={editingCategory.name} placeholder="Name" />
				</div>
				<div class="grid gap-2">
					<Label>Category Image</Label>
					<div class="flex items-center gap-2">
						<Button variant="outline" size="sm" class="w-full" onclick={() => fileInputRef?.click()} disabled={isUploading}>
							{isUploading ? "Uploading..." : "Upload New Cover"}
						</Button>
					</div>
					{#if editingCategory && editingCategory.imageId}
						{@const img = allImages.find(i => i.uid === editingCategory?.imageId)}
						{#if img}
							<div class="mt-2 w-32 h-32 border rounded-md overflow-hidden bg-muted">
								<img src={img.thumb_url} alt="preview" class="w-full h-full object-cover" />
							</div>
						{/if}
					{/if}
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="secondary" onclick={() => editingCategory = null}>Cancel</Button>
				<Button onclick={handleEdit} disabled={isSaving}>Update</Button>
			</Dialog.Footer>
		</Dialog.Content>
	{/if}
</Dialog.Root>

<AlertDialog.Root open={deleteTarget !== null} onOpenChange={(open) => { if (!open) deleteTarget = null; }}>
	{#if deleteTarget}
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Delete category?</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to delete <span class="font-medium">{deleteTarget.name}</span>? This action cannot be undone.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel onclick={() => (deleteTarget = null)}>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					onclick={() => {
						const id = deleteTarget?.id;
						deleteTarget = null;
						if (id) handleDelete(id);
					}}
				>
					Delete
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	{/if}
</AlertDialog.Root>

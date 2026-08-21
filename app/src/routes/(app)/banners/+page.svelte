<script lang="ts">
	import PageHeading from "$lib/components/page-heading.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Table from "$lib/components/ui/table";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { toast } from "svelte-sonner";
	import { onMount } from "svelte";
	import XIcon from "@lucide/svelte/icons/x";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import ImageIcon from "@lucide/svelte/icons/image";
	import SmartphoneIcon from "@lucide/svelte/icons/smartphone";
	import MonitorIcon from "@lucide/svelte/icons/monitor";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import { API_BASE, apiFetch, imageUrl } from "$lib/config";
	import { auth } from "$lib/stores/app.svelte";
	import type { Banner } from "$lib/types";

	let banners = $state<Banner[]>([]);
	let allImages = $state<{ uid: string; thumb_url: string; high_res_url: string; type: string; alt_text: string | null }[]>([]);

	let isSaving = $state(false);
	let showAddModal = $state(false);
	let editingBanner = $state<Banner | null>(null);
	let deleteTarget = $state<Banner | null>(null);

	// Form states
	let formTitle = $state("");
	let formLinkUrl = $state("");
	let formDisplayOrder = $state(1);
	let formIsActive = $state(true);
	let formDesktopImageId = $state("");
	let formMobileImageId = $state("");

	// Upload states
	let fileInputRef: HTMLInputElement | null = $state(null);
	let uploadMode = $state<"desktop" | "mobile">("desktop");
	let isUploading = $state(false);

	// Live preview state
	let previewDevice = $state<"desktop" | "mobile">("desktop");
	let previewIndex = $state(0);

	async function parseJson(res: Response) {
		const text = await res.text();
		try {
			return JSON.parse(text);
		} catch {
			return {};
		}
	}

	async function loadData() {
		if (!auth.user) return;
		try {
			const [bannersRes, imgRes] = await Promise.all([
				apiFetch(`${API_BASE}/admin/banners`),
				apiFetch(`${API_BASE}/admin/images`)
			]);
			if (bannersRes.ok) banners = await bannersRes.json();
			if (imgRes.ok) allImages = await imgRes.json();
		} catch (e) {
			toast.error("Failed to load banners.");
		}
	}

	onMount(() => {
		loadData();
		const interval = setInterval(() => {
			const activeBanners = banners.filter((b) => b.isActive === 1);
			if (activeBanners.length > 1) {
				previewIndex = (previewIndex + 1) % activeBanners.length;
			}
		}, 4000);
		return () => clearInterval(interval);
	});

	function openAddModal() {
		formTitle = "";
		formLinkUrl = "";
		formDisplayOrder = (banners.length > 0 ? Math.max(...banners.map((b) => b.displayOrder || 0)) + 1 : 1);
		formIsActive = true;
		formDesktopImageId = "";
		formMobileImageId = "";
		editingBanner = null;
		showAddModal = true;
	}

	function startEdit(b: Banner) {
		editingBanner = { ...b };
		formTitle = b.title || "";
		formLinkUrl = b.linkUrl || "";
		formDisplayOrder = b.displayOrder || 1;
		formIsActive = b.isActive === 1;
		formDesktopImageId = b.desktopImageId || "";
		formMobileImageId = b.mobileImageId || "";
		showAddModal = true;
	}

	function triggerUpload(mode: "desktop" | "mobile") {
		uploadMode = mode;
		fileInputRef?.click();
	}

	async function handleUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("image", file);
		formData.append("alt_text", formTitle ? `${formTitle} Banner` : "Storefront Banner");
		formData.append("type", "banner");

		isUploading = true;
		try {
			const res = await apiFetch(`${API_BASE}/admin/images/upload`, {
				method: "POST",
				body: formData
			});
			const data = await parseJson(res);
			if (res.ok) {
				toast.success("Image uploaded successfully!");
				await loadData();
				if (uploadMode === "desktop") {
					formDesktopImageId = data.uid;
				} else {
					formMobileImageId = data.uid;
				}
			} else {
				throw new Error(data.error || "Upload failed");
			}
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			isUploading = false;
			if (fileInputRef) fileInputRef.value = "";
		}
	}

	async function handleSave() {
		if (!formDesktopImageId) {
			toast.error("Desktop banner image is required.");
			return;
		}

		isSaving = true;
		try {
			const payload = {
				title: formTitle,
				linkUrl: formLinkUrl,
				displayOrder: Number(formDisplayOrder),
				isActive: formIsActive ? 1 : 0,
				desktopImageId: formDesktopImageId,
				mobileImageId: formMobileImageId || null
			};

			let res: Response;
			if (editingBanner) {
				res = await apiFetch(`${API_BASE}/admin/banners/${editingBanner.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload)
				});
			} else {
				res = await apiFetch(`${API_BASE}/admin/banners`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload)
				});
			}

			const data = await parseJson(res);
			if (res.ok) {
				toast.success(editingBanner ? "Banner updated!" : "Banner created!");
				showAddModal = false;
				editingBanner = null;
				await loadData();
			} else {
				throw new Error(data.error || "API Error");
			}
		} catch (e: unknown) {
			toast.error(e instanceof Error ? e.message : String(e) || "Failed to save banner.");
		} finally {
			isSaving = false;
		}
	}

	async function toggleBannerActive(b: Banner) {
		try {
			const nextStatus = b.isActive === 1 ? 0 : 1;
			const res = await apiFetch(`${API_BASE}/admin/banners/${b.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: b.title,
					linkUrl: b.linkUrl,
					displayOrder: b.displayOrder,
					isActive: nextStatus,
					desktopImageId: b.desktopImageId,
					mobileImageId: b.mobileImageId
				})
			});
			if (res.ok) {
				toast.success(nextStatus === 1 ? "Banner activated" : "Banner deactivated");
				await loadData();
			} else {
				throw new Error("Failed to update status");
			}
		} catch (e) {
			toast.error("Failed to update banner status.");
		}
	}

	async function handleDelete(id: number) {
		try {
			const res = await apiFetch(`${API_BASE}/admin/banners/${id}`, {
				method: "DELETE"
			});
			const data = await parseJson(res);
			if (res.ok) {
				toast.success("Banner deleted.");
				await loadData();
			} else {
				throw new Error(data.error || "Failed to delete banner.");
			}
		} catch (e: unknown) {
			toast.error(e instanceof Error ? e.message : String(e) || "Failed to delete banner.");
		}
	}

	function getImageSrc(uid?: string | null): string {
		if (!uid) return "";
		const img = allImages.find((i) => i.uid === uid);
		return img ? imageUrl(img.thumb_url || img.high_res_url) : "";
	}

	const activeBannersList = $derived(banners.filter((b) => b.isActive === 1));
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<PageHeading
			title="Banners"
			description="Manage moving banners, promo slides, and hero carousel on the web store"
		/>
		<div class="flex items-center gap-2">
			<Button onclick={openAddModal}>
				<PlusIcon class="size-4 mr-1" /> Add Banner
			</Button>
		</div>
	</div>

	<!-- Banners Table Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>All Banners</Card.Title>
			<Card.Description>Configure banner images, navigation links, and carousel display order.</Card.Description>
		</Card.Header>
		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-16">Order</Table.Head>
						<Table.Head>Desktop Image</Table.Head>
						<Table.Head>Mobile Image</Table.Head>
						<Table.Head>Title & Link</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each banners as b (b.id)}
						<Table.Row>
							<Table.Cell class="font-semibold text-muted-foreground">
								#{b.displayOrder}
							</Table.Cell>
							<Table.Cell>
								<div class="w-32 h-14 rounded border bg-muted overflow-hidden">
									{#if b.desktopImage}
										<img
											src={imageUrl(b.desktopThumb || b.desktopImage)}
											alt={b.title || "Banner"}
											class="w-full h-full object-cover"
										/>
									{:else if b.desktopImageId}
										{@const src = getImageSrc(b.desktopImageId)}
										{#if src}
											<img src={src} alt="Banner" class="w-full h-full object-cover" />
										{:else}
											<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
												<ImageIcon class="size-4" />
											</div>
										{/if}
									{/if}
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="w-14 h-14 rounded border bg-muted overflow-hidden flex items-center justify-center">
									{#if b.mobileImage || b.mobileImageId}
										{@const mSrc = b.mobileImage ? imageUrl(b.mobileThumb || b.mobileImage) : getImageSrc(b.mobileImageId)}
										{#if mSrc}
											<img src={mSrc} alt="Mobile Banner" class="w-full h-full object-cover" />
										{:else}
											<span class="text-[10px] text-muted-foreground text-center">None</span>
										{/if}
									{:else}
										<span class="text-[10px] text-muted-foreground text-center px-1">Auto (Desktop)</span>
									{/if}
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="flex flex-col">
									<span class="font-medium text-foreground">{b.title || "Untitled Banner"}</span>
									{#if b.linkUrl}
										<a
											href={b.linkUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-0.5"
										>
											{b.linkUrl}
											<ExternalLinkIcon class="size-3" />
										</a>
									{:else}
										<span class="text-xs text-muted-foreground italic">No link assigned</span>
									{/if}
								</div>
							</Table.Cell>
							<Table.Cell>
								<button
									type="button"
									onclick={() => toggleBannerActive(b)}
									class="cursor-pointer inline-flex items-center"
									title="Click to toggle active/inactive"
								>
									{#if b.isActive === 1}
										<Badge variant="default" class="bg-emerald-600 hover:bg-emerald-700">Active</Badge>
									{:else}
										<Badge variant="secondary">Inactive</Badge>
									{/if}
								</button>
							</Table.Cell>
							<Table.Cell class="text-right">
								<Button variant="ghost" size="sm" onclick={() => startEdit(b)}>Edit</Button>
								<Button
									variant="ghost"
									size="sm"
									class="text-destructive hover:text-destructive/90"
									onclick={() => (deleteTarget = b)}
								>
									Delete
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
					{#if banners.length === 0}
						<Table.Row>
							<Table.Cell colspan={6} class="text-center text-muted-foreground py-8">
								No banners configured yet. Click "Add Banner" to create one.
							</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>

	<!-- Live Moving Carousel Preview Card -->
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between">
			<div>
				<Card.Title>Live Carousel Preview</Card.Title>
				<Card.Description>Preview how active banners cycle automatically on the storefront</Card.Description>
			</div>
			<div class="flex items-center gap-1 border rounded-lg p-1 bg-muted">
				<Button
					size="sm"
					variant={previewDevice === "desktop" ? "default" : "ghost"}
					class="h-7 px-2.5 text-xs gap-1.5"
					onclick={() => (previewDevice = "desktop")}
				>
					<MonitorIcon class="size-3.5" /> Desktop
				</Button>
				<Button
					size="sm"
					variant={previewDevice === "mobile" ? "default" : "ghost"}
					class="h-7 px-2.5 text-xs gap-1.5"
					onclick={() => (previewDevice = "mobile")}
				>
					<SmartphoneIcon class="size-3.5" /> Mobile
				</Button>
			</div>
		</Card.Header>
		<Card.Content>
			{#if activeBannersList.length === 0}
				<div class="flex h-48 w-full items-center justify-center rounded-lg border border-dashed bg-muted/40 text-sm text-muted-foreground">
					No active banners to preview. Activate or add a banner above.
				</div>
			{:else}
				<div class="flex flex-col items-center">
					<div
						class={[
							"relative overflow-hidden rounded-xl border bg-black shadow-lg transition-all duration-300",
							previewDevice === "desktop" ? "w-full h-64 max-w-4xl" : "w-64 h-96"
						]}
					>
						{#each activeBannersList as b, i (b.id)}
							{@const isSelected = i === previewIndex % activeBannersList.length}
							{@const currentUrl = previewDevice === "mobile" && (b.mobileImage || b.mobileImageId)
								? (b.mobileImage ? imageUrl(b.mobileImage) : getImageSrc(b.mobileImageId))
								: (b.desktopImage ? imageUrl(b.desktopImage) : getImageSrc(b.desktopImageId))}
							<div
								class={[
									"absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out",
									isSelected ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
								]}
								style="background-image: url('{currentUrl}');"
							>
								{#if b.title}
									<div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white">
										<p class="text-sm font-semibold drop-shadow">{b.title}</p>
										{#if b.linkUrl}
											<p class="text-xs text-white/80">{b.linkUrl}</p>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
					<!-- Carousel Indicators -->
					<div class="flex items-center gap-1.5 mt-3">
						{#each activeBannersList as b, i (b.id)}
							<button
								type="button"
								class={[
									"h-2 rounded-full transition-all cursor-pointer",
									i === previewIndex % activeBannersList.length ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
								]}
								onclick={() => (previewIndex = i)}
								aria-label={`Go to slide ${i + 1}`}
							></button>
						{/each}
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<!-- Hidden File Input for Image Upload -->
<input
	type="file"
	accept="image/*"
	class="hidden"
	bind:this={fileInputRef}
	onchange={handleUpload}
/>

<!-- Add / Edit Banner Dialog -->
<Dialog.Root bind:open={showAddModal}>
	<Dialog.Content class="max-w-xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>{editingBanner ? "Edit Banner" : "Add New Banner"}</Dialog.Title>
			<Dialog.Description>
				Configure the banner image, destination link, and carousel sequence.
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-5 py-4">
			<div class="grid gap-2">
				<Label for="banner-title">Banner Title</Label>
				<Input id="banner-title" bind:value={formTitle} placeholder="e.g. Summer Silk Collection" />
				<p class="text-xs text-muted-foreground">Optional label for your reference and accessibility.</p>
			</div>

			<div class="grid gap-2">
				<Label for="banner-link">Destination Link</Label>
				<Input id="banner-link" bind:value={formLinkUrl} placeholder="e.g. /category/mul-cotton or /product/p1" />
				<p class="text-xs text-muted-foreground">URL or page path opened when customer clicks the banner.</p>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label for="banner-order">Display Order</Label>
					<Input id="banner-order" type="number" min="1" bind:value={formDisplayOrder} />
				</div>
				<div class="grid gap-2">
					<Label>Status</Label>
					<div class="flex items-center h-10 gap-2">
						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input
								type="checkbox"
								class="size-4 rounded border-gray-300 text-primary focus:ring-primary"
								bind:checked={formIsActive}
							/>
							<span>Active on storefront</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Desktop Banner Upload -->
			<div class="grid gap-2 border rounded-lg p-3 bg-muted/20">
				<div class="flex items-center justify-between">
					<Label class="font-semibold flex items-center gap-1.5">
						<MonitorIcon class="size-4" /> Desktop Image (Required)
					</Label>
					<Button
						variant="outline"
						size="sm"
						onclick={() => triggerUpload("desktop")}
						disabled={isUploading}
					>
						{isUploading && uploadMode === "desktop" ? "Uploading..." : "Upload Desktop Banner"}
					</Button>
				</div>
				<p class="text-xs text-muted-foreground">Recommended ratio: ~1920x800px or 1600x900px.</p>

				{#if formDesktopImageId}
					{@const src = getImageSrc(formDesktopImageId)}
					{#if src}
						<div class="relative w-full h-32 rounded-md border overflow-hidden bg-black/5 mt-1">
							<img src={src} alt="Desktop banner preview" class="w-full h-full object-cover" />
							<button
								type="button"
								class="absolute top-2 right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full p-1.5 shadow transition-colors cursor-pointer"
								onclick={() => (formDesktopImageId = "")}
								title="Remove image"
								aria-label="Remove image"
							>
								<XIcon class="size-3.5" />
							</button>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Mobile Banner Upload -->
			<div class="grid gap-2 border rounded-lg p-3 bg-muted/20">
				<div class="flex items-center justify-between">
					<Label class="font-semibold flex items-center gap-1.5">
						<SmartphoneIcon class="size-4" /> Mobile Image (Optional)
					</Label>
					<Button
						variant="outline"
						size="sm"
						onclick={() => triggerUpload("mobile")}
						disabled={isUploading}
					>
						{isUploading && uploadMode === "mobile" ? "Uploading..." : "Upload Mobile Banner"}
					</Button>
				</div>
				<p class="text-xs text-muted-foreground">Recommended ratio: ~800x1200px or portrait. If omitted, desktop banner is used.</p>

				{#if formMobileImageId}
					{@const src = getImageSrc(formMobileImageId)}
					{#if src}
						<div class="relative w-32 h-44 rounded-md border overflow-hidden bg-black/5 mt-1">
							<img src={src} alt="Mobile banner preview" class="w-full h-full object-cover" />
							<button
								type="button"
								class="absolute top-2 right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full p-1.5 shadow transition-colors cursor-pointer"
								onclick={() => (formMobileImageId = "")}
								title="Remove mobile image"
								aria-label="Remove mobile image"
							>
								<XIcon class="size-3.5" />
							</button>
						</div>
					{/if}
				{/if}
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="secondary" onclick={() => (showAddModal = false)}>Cancel</Button>
			<Button onclick={handleSave} disabled={isSaving}>
				{isSaving ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root open={deleteTarget !== null} onOpenChange={(open) => { if (!open) deleteTarget = null; }}>
	{#if deleteTarget}
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Delete banner?</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to remove <span class="font-medium">{deleteTarget.title || `Banner #${deleteTarget.id}`}</span>? This action cannot be undone.
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

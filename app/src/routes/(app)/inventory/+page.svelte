<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import * as Table from "$lib/components/ui/table";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Alert from "$lib/components/ui/alert";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { toast } from "svelte-sonner";
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import PageHeading from "$lib/components/page-heading.svelte";
	import { productsState, updateProduct } from "$lib/stores/app.svelte";
	import type { DeadStock } from "$lib/types";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import CheckIcon from "@lucide/svelte/icons/check";
	import MegaphoneIcon from "@lucide/svelte/icons/megaphone";
	import TrashIcon from "@lucide/svelte/icons/trash";

	const lowThreshold = 3;

	let allCategories = $state<{id: string, name: string}[]>([]);
	let filterCat = $state("Any Category");

	onMount(async () => {
		try {
			const res = await fetch('http://localhost:3000/api/admin/raw-categories');
			if (res.ok) allCategories = await res.json();
		} catch (e) {
			console.error(e);
		}
	});

	const validFilters = ["in-stock", "out-of-stock", "low-stock"];

	function filterFromUrl() {
		const f = String(page.url.searchParams.get("filter"));
		return validFilters.includes(f) ? f : "in-stock";
	}

	let filter = $state(filterFromUrl());

	$effect(() => {
		filter = filterFromUrl();
	});

	const onHandTotal = $derived(productsState.reduce((a, p) => a + p.stock, 0));

	const withStatus = $derived(
		productsState.map((p) => {
			const status = p.stock === 0 ? "out-of-stock" : p.stock < lowThreshold ? "low-stock" : "in-stock";
			return { ...p, status };
		})
	);

	const statusFiltered = $derived(withStatus.filter((p) => p.status === filter));

	const typeRows = $derived(
		(filterCat === "Any Category" ? statusFiltered : withStatus)
			.reduce<Map<string, { name: string; units: number; count: number }>>((m, p) => {
				const cur = m.get(p.category) ?? { name: p.category, units: 0, count: 0 };
				cur.units += p.stock;
				cur.count += 1;
				m.set(p.category, cur);
				return m;
			}, new Map())
	);
	const typeList = $derived([...typeRows.values()].sort((a, b) => b.units - a.units));
	const filteredByCat = $derived(typeList.filter((t) => filterCat === "Any Category" || t.name === filterCat));

	const visible = $derived(
		statusFiltered
			.filter((p) => filterCat === "Any Category" || p.category === filterCat)
			.sort((a, b) => a.stock - b.stock)
	);

	const outList = $derived(productsState.filter((p) => p.stock === 0));

	function productName(id: string) {
		return productsState.find((p) => p.id === id)?.name ?? id;
	}
	function money(n: number) {
		return "₹" + n.toLocaleString("en-IN");
	}
	function stockStatus(n: number) {
		return n === 0 ? "out-of-stock" : n < lowThreshold ? "low-stock" : "in-stock";
	}

	// restock dialog state
	let restockOpen = $state(false);
	let restockItem = $state<import("$lib/types").Product | null>(null);
	let restockQty = $state<number>(0);

	function openRestock(p: import("$lib/types").Product) {
		restockItem = p;
		restockQty = 0;
		restockOpen = true;
	}

	function applyRestock() {
		if (!restockItem) return;
		if (!restockQty || restockQty <= 0) return toast.error("Enter a valid quantity");
		
		updateProduct(restockItem.id, { stock: restockItem.stock + restockQty });
		toast.success(`Restocked ${restockQty} units of "${restockItem.name}"`);
		restockOpen = false;
		restockItem = null;
	}
	function removeDead(id: string) {
		const p = productsState.find((x) => x.id === id);
		if (p) updateProduct(p.id, { deadStockDays: null });
		toast.success(`Removed "${productName(id)}" from dead stock`);
	}
</script>

<div class="flex flex-col gap-6">
	<PageHeading title="Inventory" description="Live stock counts and availability alerts" />

	<div class="grid grid-cols-2 gap-4 lg:grid-cols-2">
		<Card.Root>
			<Card.Header class="pb-2"><Card.Title>On-hand units</Card.Title></Card.Header>
			<Card.Content><span class="text-3xl font-semibold">{onHandTotal}</span></Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="pb-2"><Card.Title>Out of stock</Card.Title></Card.Header>
			<Card.Content><span class="text-3xl font-semibold text-destructive">{outList.length}</span></Card.Content>
		</Card.Root>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<Tabs.Root bind:value={filter} class="w-full min-w-0">
			<Tabs.List class="w-full justify-start overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{#each ["in-stock", "out-of-stock", "low-stock"] as f}
					<Tabs.Trigger value={f} class="flex-none capitalize px-3">{f.replace("-", " ")}</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</Tabs.Root>
		<div class="flex flex-wrap items-center gap-3">
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
					<DropdownMenu.Item onSelect={() => (filterCat = "Any Category")}>
						{#if filterCat === "Any Category"}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
						Any Category
					</DropdownMenu.Item>
					{#each allCategories as c}
						<DropdownMenu.Item onSelect={() => (filterCat = c.id)}>
							{#if c.id === filterCat}<CheckIcon class="size-4" />{:else}<span class="size-4"></span>{/if}
							{c.name}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Current stock counts</Card.Title>
			<Card.Description>
				{filterCat === "Any Category"
					? "On-hand units and status per category"
					: `Products in the ${allCategories.find(c => c.id === filterCat)?.name || filterCat} category`}
			</Card.Description>
		</Card.Header>
		<Card.Content class="p-0">
			{#if filterCat === "Any Category"}
					<Table.Root class="table-fixed">
						<colgroup>
							<col class="w-[46%]" />
							<col class="w-[24%]" />
							<col class="w-[30%]" />
						</colgroup>
						<Table.Header>
							<Table.Row>
								<Table.Head class="px-5">Category</Table.Head>
								<Table.Head class="px-5 text-center">On hand</Table.Head>
								<Table.Head class="px-5 text-center">Status</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredByCat as t (t.name)}
								{@const status = stockStatus(t.units)}
								<Table.Row>
									<Table.Cell class="px-5">
										<span class="block min-w-0 truncate font-medium" title={t.name}>{allCategories.find(c => c.id === t.name)?.name || t.name}</span>
										<span class="block text-xs text-muted-foreground">
											{t.count} product{t.count > 1 ? "s" : ""}
										</span>
									</Table.Cell>
									<Table.Cell class="px-5 text-center">
										<span class="block font-semibold {t.units === 0 ? 'text-destructive' : ''}">{t.units}</span>
									</Table.Cell>
									<Table.Cell class="px-5 text-center">
										{#if status === "out-of-stock"}
											<Badge variant="destructive">Out of stock</Badge>
										{:else if status === "low-stock"}
											<Badge variant="outline" class="text-muted-foreground">Low stock</Badge>
										{:else}
											<Badge variant="secondary">In stock</Badge>
										{/if}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{:else}
					<Table.Root class="table-fixed">
						<colgroup>
							<col class="w-[40%]" />
							<col class="w-[20%]" />
							<col class="w-[20%]" />
							<col class="w-[20%]" />
						</colgroup>
						<Table.Header>
							<Table.Row>
								<Table.Head class="px-5">Product</Table.Head>
								<Table.Head class="px-5 text-center">On hand</Table.Head>
								<Table.Head class="px-5 text-center">Status</Table.Head>
								<Table.Head class="px-5 text-center">Action</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each visible as p (p.id)}
								<Table.Row>
									<Table.Cell class="px-5">
										<span class="block min-w-0 truncate font-medium" title={p.name}>{p.name}</span>
										<span class="block text-xs text-muted-foreground">{allCategories.find(c => c.id === p.category)?.name || p.category}</span>
									</Table.Cell>
									<Table.Cell class="px-5 text-center">
										<span class="block min-w-0 font-semibold {p.stock === 0 ? 'text-destructive' : ''}">{p.stock}</span>
									</Table.Cell>
									<Table.Cell class="px-5 text-center">
										{#if p.status === "out-of-stock"}
											<Badge variant="destructive">Out of stock</Badge>
										{:else if p.status === "low-stock"}
											<Badge variant="outline" class="text-muted-foreground">Low stock</Badge>
										{:else}
											<Badge variant="secondary">In stock</Badge>
										{/if}
									</Table.Cell>
									<Table.Cell class="px-5 text-center">
										<Button variant="outline" size="sm" onclick={() => openRestock(p)}>Restock</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			</Card.Content>
		</Card.Root>
</div>

<Dialog.Root bind:open={restockOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Restock Product</Dialog.Title>
			<Dialog.Description>
				{restockItem ? `Add incoming inventory for ${restockItem.name}. Current stock: ${restockItem.stock}` : ""}
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-4 py-2">
			<div class="flex flex-col gap-1.5">
				<Label for="r-qty">Units Received</Label>
				<Input id="r-qty" type="number" min="1" bind:value={restockQty} placeholder="Enter quantity received" />
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (restockOpen = false)}>Cancel</Button>
			<Button onclick={applyRestock} disabled={!restockQty}>
				Confirm Restock
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

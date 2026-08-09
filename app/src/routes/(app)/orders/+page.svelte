<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Empty from "$lib/components/ui/empty";
	import { toast } from "svelte-sonner";
	import { page } from "$app/state";
	import PageHeading from "$lib/components/page-heading.svelte";
	import { ordersState, setOrderStatus } from "$lib/stores/app.svelte";
	import ShoppingCartIcon from "@lucide/svelte/icons/shopping-cart";
	import BellRingIcon from "@lucide/svelte/icons/bell-ring";
	import CheckIcon from "@lucide/svelte/icons/check";
	import type { Order } from "$lib/types";

	function money(n: number) {
		return "₹" + n.toLocaleString("en-IN");
	}

	const statusVariant: Record<Order["status"], "destructive" | "default" | "secondary" | "outline"> = {
		new: "destructive",
		processing: "default",
		shipped: "secondary",
		delivered: "secondary",
		cancelled: "outline"
	};

	const validTabs = ["new", "processing", "shipped", "delivered", "cancelled"];

	function tabFromUrl() {
		const t = String(page.url.searchParams.get("tab"));
		return validTabs.includes(t) ? t : "new";
	}

	let tab = $state(tabFromUrl());

	$effect(() => {
		tab = tabFromUrl();
	});

	const visible = $derived(ordersState.filter((o) => o.status === tab));
	const newCount = $derived(ordersState.filter((o) => o.status === "new").length);

	function advance(orderId: string, id: string, next: Order["status"]) {
		setOrderStatus(orderId, id, next);
		toast.success(`Order status updated to ${next}`);
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<PageHeading title="Orders" description="Live order notifications from the storefront" />
		{#if newCount > 0}
			<Badge variant="destructive" class="gap-1.5"><BellRingIcon /> {newCount} new orders</Badge>
		{/if}
	</div>

	<Tabs.Root bind:value={tab} class="w-full">
		<Tabs.List class="w-full justify-start overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{#each ["new", "processing", "shipped", "delivered", "cancelled"] as t}
				<Tabs.Trigger value={t} class="flex-none px-3">
					{t[0].toUpperCase() + t.slice(1)}
					{#if t === "new" && newCount > 0}({newCount}){/if}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
	</Tabs.Root>

	<div class="flex flex-col gap-3">
		{#if visible.length === 0}
			<Card.Root>
				<Card.Content>
					<Empty.Root>
						<Empty.Media variant="icon"><ShoppingCartIcon /></Empty.Media>
						<Empty.Header>
							<Empty.Title>No {tab} orders</Empty.Title>
							<Empty.Description>Orders matching this status will appear here.</Empty.Description>
						</Empty.Header>
					</Empty.Root>
				</Card.Content>
			</Card.Root>
		{/if}

		{#each visible as o (o.id)}
			<Card.Root>
				<Card.Header class="flex-row items-center gap-4">
					<div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
						#{o.id.slice(-4)}
					</div>
					<div class="flex flex-col gap-0.5">
						<Card.Title class="flex items-center gap-2">
							{o.customer}
							<span class="text-xs font-normal text-muted-foreground">· {o.time}</span>
						</Card.Title>
						<Card.Description>{o.qty} × {o.item}</Card.Description>
					</div>
				</Card.Header>
				<Card.Footer class="flex-wrap items-center justify-between gap-2">
					<div class="flex items-center gap-3">
						<span class="font-semibold">{money(o.total)}</span>
						<Badge variant={statusVariant[o.status]}>{o.status}</Badge>
					</div>
					<div class="flex gap-2">
						{#if o.status === "new"}
							<Button size="sm" onclick={() => advance(o.orderId, o.id, "processing")}>Accept</Button>
							<Button size="sm" variant="outline" class="text-destructive" onclick={() => advance(o.orderId, o.id, "cancelled")}>Cancel</Button>
						{:else if o.status === "processing"}
							<Button size="sm" variant="outline" onclick={() => advance(o.orderId, o.id, "shipped")}>Mark shipped</Button>
						{:else if o.status === "shipped"}
							<Button size="sm" variant="outline" onclick={() => advance(o.orderId, o.id, "delivered")}>
								<CheckIcon data-icon="inline-start" /> Delivered
							</Button>
						{/if}
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>

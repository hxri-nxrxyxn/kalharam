<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/state";
	import gsap from "gsap";
	import * as Sheet from "$lib/components/ui/sheet";
	import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import LayoutDashboardIcon from "@lucide/svelte/icons/layout-dashboard";
	import PackageIcon from "@lucide/svelte/icons/package";
	import BoxesIcon from "@lucide/svelte/icons/boxes";
	import ShoppingCartIcon from "@lucide/svelte/icons/shopping-cart";
	import ChartNoAxesCombinedIcon from "@lucide/svelte/icons/chart-no-axes-combined";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import GemIcon from "@lucide/svelte/icons/gem";
	import { auth, ordersState, productsState } from "$lib/stores/app.svelte";

	let { children } = $props();

	import LayoutTemplateIcon from "@lucide/svelte/icons/layout-template";
	import TagsIcon from "@lucide/svelte/icons/tags";

	const nav = [
		{ href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
		{ href: "/categories", label: "Categories", icon: TagsIcon },
		{ href: "/products", label: "Products & Upload", icon: PackageIcon },
		{ href: "/inventory", label: "Inventory", icon: BoxesIcon },
		{ href: "/orders", label: "Orders", icon: ShoppingCartIcon },
		{ href: "/layouts", label: "Layouts", icon: LayoutTemplateIcon }
	];

	let open = $state(false);

	// drawer content stagger
	let drawerEl: HTMLElement;
	onMount(() => {
		const mm = gsap.matchMedia();
		mm.add("(prefers-reduced-motion: no-preference)", () => {
			// page entrance
			gsap.from(".page-shell", { autoAlpha: 0, y: 12, duration: 0.45, ease: "power2.out" });
			gsap.from(".metric-card", {
				autoAlpha: 0,
				y: 24,
				duration: 0.5,
				stagger: 0.08,
				ease: "back.out(1.4)",
				delay: 0.1
			});
		});
		return () => mm.revert();
	});

	$effect(() => {
		if (open && drawerEl) {
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				gsap.fromTo(
					drawerEl.querySelectorAll(".nav-item"),
					{ autoAlpha: 0, x: -24 },
					{ autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
				);
			});
		}
	});

	const newOrders = $derived(ordersState.filter((o) => o.status === "new").length);
	const outOfStock = $derived(productsState.filter((p) => p.stock === 0).length);
	const initials = $derived((auth.user?.name ?? "A").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase());

	// Boutique logo — drop the file at `static/logo.png` and it replaces the gem.
	let logoLoaded = $state(true);
</script>

<div class="min-h-dvh bg-background text-foreground">
	<header class="sticky top-0 z-40 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur">
		<Sheet.Root bind:open>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="icon" aria-label="Open menu" {...props}>
						<MenuIcon class="size-5" />
					</Button>
				{/snippet}
			</Sheet.Trigger>

			<Sheet.Content side="left" class="w-[300px] bg-background">
				<Sheet.Header class="flex-row items-center gap-2 border-b px-4 pb-3">
					{#if logoLoaded}
						<img src="/logo.png" alt="Kalharam logo" class="size-9 rounded-lg object-contain" onerror={() => (logoLoaded = false)} />
					{:else}
						<div class="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<GemIcon class="size-4" />
						</div>
					{/if}
					<Sheet.Title class="text-lg font-semibold">Kalharam</Sheet.Title>
				</Sheet.Header>

				<div bind:this={drawerEl} class="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
					{#each nav as item (item.href)}
						{@const active = page.url.pathname === item.href}
						<Button
							variant="ghost"
							href={item.href}
							onclick={() => (open = false)}
							aria-current={active ? "page" : undefined}
							class={cn(
								"nav-item h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
								active ? "bg-accent text-accent-foreground" : ""
							)}
						>
							{@const Icon = item.icon}
							{#if Icon}<Icon class="size-5 shrink-0" />{/if}
							<span class="flex-1 text-left">{item.label}</span>
							{#if item.label === "Orders" && newOrders > 0}<Badge variant="destructive" class="size-5 justify-center rounded-full p-0 text-[11px]">{newOrders}</Badge>{/if}
							{#if item.label === "Inventory" && outOfStock > 0}<Badge variant="destructive" class="size-5 justify-center rounded-full p-0 text-[11px]">{outOfStock}</Badge>{/if}
					</Button>
				{/each}
			</div>
			</Sheet.Content>
		</Sheet.Root>

		<a href="/" class="flex items-center gap-2 font-semibold">
			{#if logoLoaded}
				<img src="/logo.png" alt="Kalharam logo" class="size-9 rounded-lg object-contain" onerror={() => (logoLoaded = false)} />
			{:else}
				<span class="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<GemIcon class="size-4" />
				</span>
			{/if}
			<span>Kalharam</span>
		</a>

		<div class="ml-auto flex items-center gap-3">
			{#if outOfStock > 0}
				<Badge variant="destructive" class="hidden sm:inline-flex">{outOfStock} out of stock</Badge>
			{/if}
			<Avatar class="size-8 border">
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
		</div>
	</header>

	<main class="page-shell mx-auto w-full max-w-6xl px-4 py-6">
		{@render children()}
	</main>
</div>

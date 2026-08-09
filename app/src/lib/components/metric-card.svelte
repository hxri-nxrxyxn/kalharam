<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import type { Component } from "svelte";

	let {
		label,
		value,
		sub,
		icon: Icon,
		tone = "primary",
		badge,
		badgeTone = "secondary",
		href
	}: {
		label: string;
		value: string;
		sub?: string;
		icon?: Component;
		tone?: "primary" | "success" | "warn" | "danger" | "muted";
		badge?: string;
		badgeTone?: "secondary" | "destructive" | "outline" | "success" | "warn";
		href?: string;
	} = $props();

	const toneClasses: Record<string, string> = {
		primary: "bg-primary/10 text-primary",
		success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		warn: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		danger: "bg-destructive/10 text-destructive",
		muted: "bg-muted text-muted-foreground"
	};

	const badgeClasses: Record<string, string> = {
		secondary: "bg-secondary text-secondary-foreground",
		destructive: "bg-destructive/10 text-destructive",
		outline: "border-border text-foreground",
		success: "border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
		warn: "border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
	};
</script>

<svelte:element this={href ? "a" : "div"} {href} class={href ? "metric-card group block" : "metric-card"}>
	<Card.Root class={href ? "h-full transition-shadow group-hover:shadow-md" : ""}>
		<Card.Header>
			<div class="flex flex-wrap items-center justify-between gap-2">
				<Card.Title class="text-sm">{label}</Card.Title>
				{#if badge}<Badge class={badgeClasses[badgeTone]}>{badge}</Badge>{/if}
			</div>
			{#if sub}<Card.Description>{sub}</Card.Description>{/if}
		</Card.Header>
		<Card.Content class="flex items-center justify-between gap-3">
			<span class="text-3xl font-semibold tracking-tight">{value}</span>
			{#if Icon}
				<div class="flex size-10 shrink-0 items-center justify-center rounded-xl {toneClasses[tone]}">
					<Icon class="size-5" />
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</svelte:element>

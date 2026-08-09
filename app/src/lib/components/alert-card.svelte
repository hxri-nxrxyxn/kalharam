<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import type { Component } from "svelte";

	let {
		title,
		value,
		hint,
		tone = "primary",
		icon: Icon,
		href
	}: {
		title: string;
		value: number;
		hint: string;
		tone?: "primary" | "danger" | "warn";
		icon?: Component;
		href: string;
	} = $props();

	const tones: Record<string, string> = {
		primary: "text-primary bg-primary/10",
		danger: "text-destructive bg-destructive/10",
		warn: "text-muted-foreground bg-muted"
	};

	const borders: Record<string, string> = {
		primary: "ring-foreground/10",
		danger: "ring-destructive/40",
		warn: "ring-border"
	};
</script>

<a href={href} class="metric-card group block">
	<Card.Root class="transition-shadow hover:shadow-md {borders[tone]}">
		<Card.Header class="flex-row items-center justify-between gap-2">
			<Card.Title class="text-sm">{title}</Card.Title>
			{#if Icon}
				<div class="flex size-10 shrink-0 items-center justify-center rounded-lg {tones[tone]}">
					<Icon class="size-5" />
				</div>
			{/if}
		</Card.Header>
		<Card.Content>
			<span class="text-2xl font-semibold tracking-tight">{value}</span>
			<p class="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
				<span class="truncate">{hint}</span>
				<span class="shrink-0 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">View →</span>
			</p>
		</Card.Content>
	</Card.Root>
</a>

<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<div class="page-heading flex flex-col gap-1">
	<h1 class="text-2xl font-semibold tracking-tight">{title}</h1>
	{#if description}<p class="text-sm text-muted-foreground">{description}</p>{/if}
</div>

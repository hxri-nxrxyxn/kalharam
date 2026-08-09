<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		icon?: string;
		inline?: boolean;
		children: Snippet;
	}

	let { label, icon, inline = false, children }: Props = $props();
</script>

<div class={['field', inline && 'field--inline']}>
	{#if label}
		<div class="field__label">
			{#if icon}
				<img src={icon} alt="" aria-hidden="true" />
			{/if}
			<h3>{label}</h3>
		</div>
	{/if}
	<div class="field__control">
		{@render children()}
	</div>
</div>

<style>
	.field {
		margin-bottom: var(--spacing-lg);
		width: 100%;
	}

	.field__label {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-sm);
		color: var(--color-secondary);
	}

	.field__label img {
		height: var(--height-icon);
		filter: var(--filter-secondary);
	}

	.field--inline .field__control {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.field--inline .field__control :global(p) {
		color: var(--color-primary);
		font-weight: 600;
	}
</style>

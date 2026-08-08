<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { toast } from '$lib/toast.svelte';
</script>

{#if toast.state.visible}
	<div 
		class="toast"
		transition:fly={{ y: 50, duration: 400 }}
	>
		<img src="/assets/stroke-3px-24px/circle-check.svg" alt="success" width="20" height="20" />
		<p>{toast.state.message}</p>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: var(--spacing-xl);
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-primary);
		color: var(--color-background);
		padding: var(--spacing-md) var(--spacing-lg);
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		z-index: 9999;
	}
	
	.toast img {
		filter: invert(1);
	}
	
	.toast p {
		margin: 0;
		font-weight: 500;
		letter-spacing: 0.5px;
		font-size: var(--font-sm);
	}
</style>

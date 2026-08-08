<script lang="ts">
	import Field from '$lib/components/Field.svelte';
	import { toast } from '$lib/toast.svelte';

	let email = $state('');

	function handleSubscribe() {
		if (email) {
			toast.show('Thank you! You are now an insider.');
			email = '';
		}
	}
</script>

<svelte:head>
	<title>Kalharam Newsletter - Kalharam Kalyani</title>
	<meta name="description" content="Subscribe to our newsletter for exclusive collections and offers." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>Kalharam Newsletter</h1>

		<p class="lead">Become an insider.</p>
		<p>Join the Kalharam Kalyani family. Subscribe to our newsletter to receive early access to our limited-edition handloom drops, styling guides, and exclusive invitations to our festive sales.</p>
		
		<div class="newsletter-form">
			<h2 style="margin-top: 0;">Subscribe</h2>
			<p style="margin-bottom: var(--spacing-lg);">Enter your email address below. We promise to only send you beautiful things.</p>
			
			<Field label="EMAIL">
				<input type="email" placeholder="Your email address" bind:value={email} />
			</Field>

			<button class="btn btn--primary" onclick={handleSubscribe} disabled={!email} style="width: 100%;">Subscribe</button>
		</div>
		
	</div>
</main>


<style>
	.page-container {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.page-content {
		width: 40%;
	}

	.page-content h1 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.page-content p {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.page-content h2 {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}

	.page-content .lead {
		font-weight: 500;
		font-size: 1.1rem;
		color: var(--color-primary);
	}

	.page-content ul {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
		padding-left: var(--spacing-lg);
	}

	.page-content li {
		margin-bottom: calc(var(--spacing-sm) / 2);
	}

	.newsletter-form {
		margin-top: calc(2 * var(--spacing-xl));
		background-color: var(--color-surface);
		padding: var(--spacing-xl);
	}

	@media (max-width: 900px) {
		.page-content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.page-content {
			width: 100%;
		}
	}
</style>

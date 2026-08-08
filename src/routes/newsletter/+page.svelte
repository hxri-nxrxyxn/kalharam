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

<main class="newsletter">
	<div class="newsletter__content">
		<h1 class="newsletter__title">Kalharam Newsletter</h1>
		
		<p class="newsletter__lead">Become an insider.</p>
		<p class="newsletter__paragraph">Join the Kalharam Kalyani family. Subscribe to our newsletter to receive early access to our limited-edition handloom drops, styling guides, and exclusive invitations to our festive sales.</p>
		
		<div class="newsletter__form">
			<h2 class="newsletter__subtitle">Subscribe</h2>
			<p class="newsletter__paragraph">Enter your email address below. We promise to only send you beautiful things.</p>
			
			<Field label="EMAIL">
				<input type="email" placeholder="Your email address" bind:value={email} />
			</Field>

			<button class="btn btn--primary newsletter__btn" onclick={handleSubscribe} disabled={!email}>Subscribe</button>
		</div>
		
	</div>
</main>

<style>
	.newsletter {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.newsletter__content {
		width: 40%;
	}

	.newsletter__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.newsletter__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.newsletter__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}

	.newsletter__lead {
		font-weight: 500;
		font-size: 1.1rem;
		color: var(--color-primary);
		margin-bottom: var(--spacing-md);
	}

	
	
	
	
	.newsletter__form {
		margin-top: calc(2 * var(--spacing-xl));
		background-color: var(--color-surface);
		padding: var(--spacing-xl);
	}
	
	.newsletter__btn {
		width: 100%;
	}

	@media (max-width: 900px) {
		.newsletter__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.newsletter__content {
			width: 100%;
		}
	}
</style>

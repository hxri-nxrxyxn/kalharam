<script lang="ts">
	import Field from '$lib/components/Field.svelte';
	import SimilarProducts from '$lib/components/SimilarProducts.svelte';
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
	<div class="newsletter__text">
		<h1 class="newsletter__title">Kalharam Newsletter</h1>
		
		<p class="newsletter__paragraph">Join the Kalharam Kalyani family. Subscribe to our newsletter to receive early access to our limited-edition handloom drops, styling guides, and exclusive invitations to our festive sales.</p>
		
		<div class="newsletter__form">
			<h2 class="newsletter__subtitle">Subscribe</h2>
			<p class="newsletter__paragraph">Enter your email address below. We promise to only send you beautiful things.</p>
			
			<Field label="EMAIL ADDRESS">
				<input type="email" placeholder="you@email.com" autocomplete="off" bind:value={email} />
			</Field>

			<button class="btn btn--primary newsletter__btn" onclick={handleSubscribe} disabled={!email}>Subscribe</button>
		</div>
	</div>
	<div class="newsletter__image">
		<img src="/assets/types/kanchi-cotton/example.webp" alt="Kalharam Newsletter">
	</div>
</main>

<SimilarProducts />

<style>
	.newsletter {
		display: flex;
		justify-content: space-between;
		gap: var(--spacing-xl);
	}

	.newsletter__text {
		width: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.newsletter__image {
		width: 40%;
		background-color: var(--color-input);
		height: 80vh;
	}

	.newsletter__image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
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
		margin-top: 0;
		margin-bottom: var(--spacing-sm);
	}

	
	.newsletter__form {
		margin-top: var(--spacing-lg);
		background-color: var(--color-surface);
		padding: var(--spacing-lg);
	}
	
	.newsletter__btn {
		width: 100%;
		margin-top: var(--spacing-sm);
	}

	@media (max-width: 900px) {
		.newsletter__text {
			width: 60%;
		}
		.newsletter__image {
			width: 35%;
		}
	}

	@media (max-width: 768px) {
		.newsletter {
			flex-direction: column;
		}
		.newsletter__text, .newsletter__image {
			width: 100%;
		}
		.newsletter__image {
			height: 50vh;
			order: -1;
		}
		.newsletter__form {
			padding: var(--spacing-lg);
		}
	}
</style>

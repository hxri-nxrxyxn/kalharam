<script lang="ts">
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
		
		<div style="margin-top: 2rem; background-color: var(--color-input); padding: 2rem;">
			<h2 style="margin-top: 0;">Subscribe</h2>
			<p>Enter your email address below. We promise to only send you beautiful things.</p>
			<div style="display: flex; gap: 1rem; margin-top: 1rem;">
				<input type="email" placeholder="Your email address" style="flex: 1; padding: 0.8rem; border: 1px solid var(--color-secondary); background: transparent; outline: none; color: var(--color-primary);" />
				<button class="btn btn--primary" style="padding: 0.8rem 2rem; font-size: 0.9rem;">Subscribe</button>
			</div>
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

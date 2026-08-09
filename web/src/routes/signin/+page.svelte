<script lang="ts">
	import Field from '$lib/components/Field.svelte';
</script>

<svelte:head>
	<title>Kalharam - Sign In</title>
	<meta name="description" content="Sign in to your Kalharam account." />
	<link rel="canonical" href="https://kalharam.com/signin" />
</svelte:head>

<main class="auth">
	<div class="auth__desc">
		<div class="auth__desc-text">
			<h1>Sign In</h1>
			<p>Welcome back to Kalharam. Sign in to your account to view your past orders, access your saved handcrafted treasures, and manage your preferences.</p>
		</div>
		<div class="auth__desc-image">
			<img src="/assets/types/banner-1.webp" alt="signin">
		</div>
	</div>
	<div class="auth__form">
		<div class="auth__fieldset">
			<Field label="EMAIL">
				<input
					type="email"
					placeholder="e.g. parvathy.n@example.com"
					aria-label="Email"
				/>
			</Field>

			<Field label="PASSWORD">
				<input
					type="password"
					placeholder="e.g. ••••••••"
					aria-label="Password"
				/>
			</Field>

			<Field>
				<input
					type="submit"
					value="SIGN IN"
					aria-label="Sign In"
					class="btn btn--primary"
				/>
			</Field>

			<div class="auth__switch">
				<p>Don't have an account? <a href="/signup">Sign Up &rarr;</a></p>
			</div>
		</div>
	</div>
</main>

<style>
	.auth {
		display: flex;
		justify-content: space-between;
		padding-bottom: var(--spacing-xl);
	}

	.auth__desc {
		width: 40%;
	}
	
	.auth__desc h1 {
		color: var(--color-primary);
	}

	.auth__desc p {
		margin: var(--spacing-md) 0;
		color: var(--color-secondary);
	}

	.auth__desc-image {
		margin-top: var(--spacing-lg);
		background-color: var(--color-input);
		aspect-ratio: 4 / 3;
	}

	.auth__desc-image img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.auth__form {
		width: 40%;
	}

	.auth__fieldset {
		width: 100%;
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
	}

	.auth__switch {
		margin-top: var(--spacing-lg);
		text-align: center;
	}

	.auth__switch p {
		color: var(--color-secondary);
	}

	.auth__switch a {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 500;
	}

	.auth__switch a:hover {
		text-decoration: underline;
	}

	.btn {
		width: 100%;
		cursor: pointer;
		margin-top: var(--spacing-sm);
	}
	
	@media (max-width: 768px) {
		.auth {
			flex-direction: column;
			gap: var(--spacing-xl);
		}
		
		.auth__desc, .auth__form {
			width: 100%;
		}
	}
</style>

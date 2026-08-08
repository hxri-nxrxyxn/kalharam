<script lang="ts">
	import Field from '$lib/components/Field.svelte';
</script>

<svelte:head>
	<title>Kalharam - Sign In</title>
	<meta name="description" content="Sign in to your Kalharam account." />
	<link rel="canonical" href="https://kalharam.com/signin" />
</svelte:head>

<main class="signup">
	<div class="signup__desc">
		<div class="signup__desc-text">
			<h1>Signup</h1>
			<p>Take a moment to review your chosen drapes before proceeding to secure checkout. Double-check your color choices and quantities, and leave us a note if this is a gift!</p>
		</div>
		<div class="signup__desc-image">
			<img src="#" alt="signup">
		</div>
	</div>
	<div class="signup__form">
		<div class="signup__fieldset">
			<Field label="NAME">
				<input
					type="text"
					placeholder="Enter Name"
					aria-label="Name"
				/>
			</Field>

			<Field label="MOBILE">
				<input
					type="tel"
					placeholder="Enter Mobile"
					aria-label="Mobile"
				/>
			</Field>

			<Field label="EMAIL">
				<input
					type="email"
					placeholder="Enter Email Address"
					aria-label="Email"
				/>
			</Field>

			<Field>
				<input
					type="submit"
					value="SIGN UP"
					aria-label="Sign Up"
					class="btn btn--primary"
				/>
			</Field>
		</div>
	</div>
</main>

<style>
	.signup {
		display: flex;
		justify-content: space-between;
		padding-bottom: var(--spacing-xl);
	}

	.signup__desc {
		width: 40%;
	}
	
	.signup__desc h1 {
		color: var(--color-primary);
	}

	.signup__desc p {
		margin: var(--spacing-lg) 0;
		color: var(--color-secondary);
	}

	.signup__desc-image {
		background-color: var(--color-input);
		aspect-ratio: 4 / 3;
	}

	.signup__desc-image img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	.signup__form {
		width: 40%;
	}

	.signup__fieldset {
		width: 100%;
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
	}

	.btn {
		width: 100%;
		cursor: pointer;
	}
	
	@media (max-width: 768px) {
		.signup {
			flex-direction: column;
			gap: var(--spacing-xl);
		}
		
		.signup__desc, .signup__form {
			width: 100%;
		}
	}
</style>

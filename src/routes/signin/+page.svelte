<script lang="ts">
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
			<div class="signup__field">
				<div class="signup__label">
					<h3>NAME</h3>
				</div>
				<div class="signup__input-wrapper">
					<input
						type="text"
						placeholder="Enter Name"
						aria-label="Name"
					/>
				</div>
			</div>

			<div class="signup__field">
				<div class="signup__label">
					<h3>MOBILE</h3>
				</div>
				<div class="signup__input-wrapper">
					<input
						type="tel"
						placeholder="Enter Mobile"
						aria-label="Mobile"
					/>
				</div>
			</div>

			<div class="signup__field">
				<div class="signup__label">
					<h3>EMAIL</h3>
				</div>
				<div class="signup__input-wrapper">
					<input
						type="email"
						placeholder="Enter Email Address"
						aria-label="Email"
					/>
				</div>
			</div>

			<div class="signup__field">
				<div class="signup__input-wrapper">
					<input
						type="submit"
						value="SIGN UP"
						aria-label="Sign Up"
					/>
				</div>
			</div>
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
		background-color: red;
	}

	.signup__desc-image img {
		height: 100%;
		width: 100%;
	}

	.signup__form {
		width: 40%;
	}

	.signup__fieldset {
		width: 100%;
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
	}

	.signup__field {
		margin-bottom: var(--spacing-lg);
		width: 100%;
	}

	.signup__label {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-sm);
		color: var(--color-secondary);
	}
</style>

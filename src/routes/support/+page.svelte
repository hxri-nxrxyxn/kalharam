<script lang="ts">
</script>

<svelte:head>
	<title>Kalharam - Customer Support</title>
	<meta name="description" content="Get in touch with Kalharam customer support." />
	<link rel="canonical" href="https://kalharam.com/support" />
</svelte:head>

<main class="support">
	<div class="support__image">
		<img src="/assets/others/support.png" alt="family">
	</div>	
	<div class="support__text">
		<h1>support</h1>
		<p>We would love to hear from you! Whether you need assistance finding the perfect drape, have a question about our handwoven collections, or want to book a bridal consultation, our team is here to help. Reach out to us below, and let us bring your saree vision to life.</p>
		<div class="support__rows">
			<div class="support__row">
				<div class="support__column">
					<h3>Whatsapp</h3>
					<p>+91 99952 83835</p>
				</div>
				<div class="support__column">
					<h3>Email</h3>
					<p>support@kalharam.com</p>
				</div>
			</div>
			<div class="support__row">
				<div class="support__column">
					<h3>Enquiry</h3>
					<p>enquiry@kalharam.com</p>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.support {
		display: flex;
		gap: var(--spacing-xl);
		padding-bottom: var(--spacing-xl);
	}

	.support__image {
		width: 40%;
	}

	.support__image img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.support__text {
		width: 40%;
	}

	.support__text h1 {
		color: var(--color-primary);
	}

	.support__text > p {
		margin: var(--spacing-lg) 0;
		color: var(--color-secondary);
	}

	.support__row {
		display: flex;
	}

	.support__column {
		width: 40%;
	}

	.support__row h3 {
		color: var(--color-primary);
	}

	.support__row p {
		color: var(--color-secondary);
	}

	.support__row:not(:first-child) {
		margin-top: var(--spacing-lg);
	}

</style>

<script lang="ts">
	import Field from '$lib/components/Field.svelte';
	import { toast } from '$lib/toast.svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');

	function handleSend() {
		if (name && email && message) {
			toast.show('Thank you! We have received your message and will get back to you shortly.');
			name = '';
			email = '';
			message = '';
		}
	}
</script>

<svelte:head>
	<title>Kalharam - Customer Support</title>
	<meta name="description" content="Get in touch with Kalharam customer support." />
	<link rel="canonical" href="https://kalharam.com/support" />
</svelte:head>

<main class="support">
	<div class="support__image">
		<img src="/assets/others/support.webp" alt="family">
	</div>	
	<div class="support__text">
		<h1>Contact Us</h1>
		<p>Whether you need assistance finding the perfect drape, have a question about the care of our handwoven collections, or wish to inquire about a recent order, our dedicated support team is at your service. Let us bring your saree vision to life.</p>
		
		<div class="support__rows">
			<div class="support__row">
				<div class="support__column">
					<h3>WhatsApp</h3>
					<p>+91 81570 75657</p>
					<p class="support__small-text">Mon - Sat, 10 AM to 7 PM</p>
				</div>
				<div class="support__column">
					<h3>Customer Support</h3>
					<p>support@kalharam.com</p>
					<p class="support__small-text">Expect a reply within 24 hours</p>
				</div>
			</div>
			<div class="support__row">
				<div class="support__column">
					<h3>General Enquiry</h3>
					<p>enquiry@kalharam.com</p>
				</div>
				<div class="support__column">
					<h3>Boutique Location</h3>
					<p>kalharam.com</p>
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
		margin: var(--spacing-md) 0;
		color: var(--color-secondary);
		line-height: 1.6;
	}

	.support__rows {
		margin-bottom: calc(2 * var(--spacing-lg));
	}

	.support__row {
		display: flex;
	}

	.support__column {
		width: 50%;
	}

	.support__row h3 {
		color: var(--color-primary);
		margin-bottom: calc(var(--spacing-sm) / 2);
	}

	.support__row p {
		color: var(--color-secondary);
	}
	
	.support__small-text {
		font-size: var(--font-sm);
		opacity: 0.7;
		margin-top: 4px;
	}

	.support__row:not(:first-child) {
		margin-top: var(--spacing-lg);
	}
</style>

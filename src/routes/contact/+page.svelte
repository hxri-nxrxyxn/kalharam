<script lang="ts">
</script>

<svelte:head>
	<title>Contact Kalharam Kalyani - Kalharam Kalyani</title>
	<meta name="description" content="Get in touch with our team for inquiries and support." />
</svelte:head>

<main class="contact">
	<div class="contact__content">
		<h1 class="contact__title">Contact Kalharam Kalyani</h1>
		
		<p class="contact__paragraph">Whether you need assistance finding the perfect drape, have a question about our handwoven collections, or want to book a bridal consultation, our team is here to help.</p>

		<h2 class="contact__subtitle">Direct Contact</h2>
		<ul class="contact__list">
			<li class="contact__list-item"><strong class="contact__strong">WhatsApp:</strong> +91 81570 75657</li>
			<li class="contact__list-item"><strong class="contact__strong">Customer Support:</strong> support@kalharam.com</li>
			<li class="contact__list-item"><strong class="contact__strong">General Enquiry:</strong> enquiry@kalharam.com</li>
			<li class="contact__list-item"><strong class="contact__strong">Address:</strong> kalharam.com</li>
		</ul>

		<h2 class="contact__subtitle">Boutique Hours</h2>
		<p class="contact__paragraph">Our online support team is available Monday through Saturday, from 10:00 AM to 7:00 PM (IST). We aim to respond to all inquiries within 24 hours.</p>
		
	</div>
</main>

<style>
	.contact {
		display: flex;
		padding-bottom: var(--spacing-xl);
	}

	.contact__content {
		width: 40%;
	}

	.contact__title {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.contact__paragraph {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
	}
	
	.contact__subtitle {
		color: var(--color-primary);
		margin-top: var(--spacing-lg);
		margin-bottom: var(--spacing-sm);
	}


	
	
	.contact__list {
		color: var(--color-secondary);
		line-height: 1.6;
		margin-bottom: var(--spacing-md);
		padding-left: var(--spacing-lg);
	}

	.contact__list-item {
		margin-bottom: calc(var(--spacing-sm) / 2);
	}
	
	.contact__strong {
		color: var(--color-primary);
	}
	
	

	@media (max-width: 900px) {
		.contact__content {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		.contact__content {
			width: 100%;
		}
	}
</style>

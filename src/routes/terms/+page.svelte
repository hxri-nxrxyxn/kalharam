<script lang="ts">
</script>

<svelte:head>
	<title>Kalharam - Terms of Service</title>
	<meta name="description" content="Read the terms and conditions governing your use of Kalharam." />
</svelte:head>

<main class="page-container">
	<div class="page-content">
		<h1>Terms of Service</h1>
		<p>Read the terms and conditions governing your use of Kalharam.</p>
		
		<!-- Placeholder content -->
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		
		<h2>Section Title</h2>
		<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		
		<p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.</p>
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

<script lang="ts">
	import { page } from '$app/state';
</script>

<nav class="nav">
	<a href="/" class="nav__logo">
		<img src="/assets/filled-shapes/logo.svg" alt="logo" />
		<img src="/assets/filled-shapes/branding.svg" alt="branding" />
	</a>
	<div class="nav__links">
		<a href="/signin" class={['nav__link', page.url.pathname === '/signin' && 'nav__link--active']}>
			<img src="/assets/stroke-4px-32px/signin.svg" alt="signin" />
			<span>Sign In</span>
		</a>
		<a href="/support" class={['nav__link', page.url.pathname === '/support' && 'nav__link--active']}>
			<img src="/assets/stroke-4px-32px/support.svg" alt="support" />
			<span>Support</span>
		</a>
		<a href="/cart" class={['nav__link', page.url.pathname === '/cart' && 'nav__link--active']}>
			<img src="/assets/stroke-4px-32px/cart.svg" alt="cart" />
			<span>My Cart</span>
		</a>
	</div>
</nav>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: var(--spacing-lg) var(--spacing-xl);
		background-color: var(--color-surface);
		z-index: 99;
	}

	.nav__logo {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.nav__logo img {
		height: var(--height-logo);
		filter: var(--filter-secondary);
	}

	.nav__links {
		display: flex;
		gap: calc(var(--spacing-xl) - var(--spacing-lg));
		align-items: center;
	}

	.nav__link {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		color: var(--color-secondary);
		font-weight: 500;
		align-items: center;
		text-decoration: none;
		cursor: pointer;
	}

	.nav__link img {
		height: var(--spacing-lg);
		filter: var(--filter-secondary);
	}

	.nav__link--active {
		color: var(--color-primary);
	}

	.nav__link--active img {
		filter: var(--filter-primary);
	}

	@media (max-width: 768px) {
		.nav {
			padding: var(--spacing-md) var(--spacing-lg);
		}

		.nav__logo {
			gap: var(--spacing-sm);
		}

		.nav__link {
			font-size: var(--font-sm);
			gap: 0.25rem;
		}
	}
</style>
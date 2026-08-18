<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';

	let menuOpen = $state(false);

	afterNavigate(() => {
		menuOpen = false;
	});
</script>

<nav class="nav">
	<a href="/" class="nav__logo">
		<img src="/assets/filled-shapes/logo.svg" alt="logo" />
		<img src="/assets/filled-shapes/branding.svg" alt="branding" />
	</a>
	<div class="nav__links">
		<a href="/signin" class={['nav__link', 'nav__link--desktop', page.url.pathname === '/signin' && 'nav__link--active']}>
			<img src="/assets/stroke-4px-32px/signin.svg" alt="signin" />
			<span>Sign In</span>
		</a>
		<a href="/support" class={['nav__link', 'nav__link--desktop', page.url.pathname === '/support' && 'nav__link--active']}>
			<img src="/assets/stroke-4px-32px/support.svg" alt="support" />
			<span>Support</span>
		</a>
		<a href="/cart" class={['nav__link', page.url.pathname === '/cart' && 'nav__link--active']}>
			<img src="/assets/stroke-4px-32px/cart.svg" alt="cart" />
			<span>My Cart</span>
		</a>
		<button
			type="button"
			class="nav__toggle"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			{#if menuOpen}
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
					<path d="M8 8l16 16M24 8L8 24" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
				</svg>
			{:else}
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
					<path d="M6 10h20M6 16h20M6 22h20" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
				</svg>
			{/if}
		</button>
	</div>

	{#if menuOpen}
		<div class="nav__menu">
			<a href="/signin" class={['nav__menu-link', page.url.pathname === '/signin' && 'nav__menu-link--active']} onclick={() => (menuOpen = false)}>
				<img src="/assets/stroke-4px-32px/signin.svg" alt="" aria-hidden="true" />
				<span>Sign In</span>
			</a>
			<a href="/support" class={['nav__menu-link', page.url.pathname === '/support' && 'nav__menu-link--active']} onclick={() => (menuOpen = false)}>
				<img src="/assets/stroke-4px-32px/support.svg" alt="" aria-hidden="true" />
				<span>Support</span>
			</a>
			<a href="/cart" class={['nav__menu-link', page.url.pathname === '/cart' && 'nav__menu-link--active']} onclick={() => (menuOpen = false)}>
				<img src="/assets/stroke-4px-32px/cart.svg" alt="" aria-hidden="true" />
				<span>My Cart</span>
			</a>
		</div>
	{/if}
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

	.nav__toggle {
		display: none;
		background: none;
		border: 0;
		padding: 0;
		color: var(--color-secondary);
		cursor: pointer;
		align-items: center;
		justify-content: center;
	}

	.nav__toggle[aria-expanded='true'] {
		color: var(--color-primary);
	}

	.nav__menu {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		flex-direction: column;
		background-color: var(--color-surface);
		padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
		border-top: 2px solid var(--color-input);
	}

	.nav__menu-link {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		color: var(--color-secondary);
		font-weight: 500;
		text-decoration: none;
		padding: var(--spacing-md) 0;
		border-bottom: 2px solid var(--color-input);
	}

	.nav__menu-link:last-child {
		border-bottom: 0;
	}

	.nav__menu-link img {
		height: var(--spacing-lg);
		filter: var(--filter-secondary);
	}

	.nav__menu-link--active {
		color: var(--color-primary);
	}

	.nav__menu-link--active img {
		filter: var(--filter-primary);
	}

	@media (max-width: 768px) {
		.nav {
			padding: var(--spacing-md) var(--spacing-lg);
		}

		.nav__link--desktop {
			display: none;
		}

		.nav__logo {
			gap: var(--spacing-sm);
		}

		.nav__link {
			font-size: var(--font-sm);
			gap: 0.25rem;
		}

		.nav__toggle {
			display: flex;
		}

		.nav__menu {
			display: flex;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let navLogo: HTMLAnchorElement;
	let navLinks: HTMLDivElement;

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.from(navLogo, {
				y: -20,
				autoAlpha: 0,
				duration: 0.8,
				ease: 'power3.out'
			});

			gsap.from('.nav__link', {
				y: -15,
				autoAlpha: 0,
				duration: 0.6,
				stagger: 0.1,
				delay: 0.2,
				ease: 'power3.out'
			});
		});

		return () => ctx.revert();
	});

	function handleLinkEnter(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const img = target.querySelector('img');
		gsap.to(target, { y: -3, duration: 0.25, ease: 'power2.out' });
		if (img) {
			gsap.to(img, { scale: 1.15, rotation: 5, duration: 0.3, ease: 'back.out(1.7)' });
		}
	}

	function handleLinkLeave(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const img = target.querySelector('img');
		gsap.to(target, { y: 0, duration: 0.25, ease: 'power2.out' });
		if (img) {
			gsap.to(img, { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.out' });
		}
	}

	function handleLogoEnter() {
		if (navLogo) {
			gsap.to(navLogo, { scale: 1.04, duration: 0.3, ease: 'back.out(1.5)' });
		}
	}

	function handleLogoLeave() {
		if (navLogo) {
			gsap.to(navLogo, { scale: 1, duration: 0.3, ease: 'power2.out' });
		}
	}
</script>

<nav class="nav">
	<a
		href="/"
		class="nav__logo"
		bind:this={navLogo}
		onmouseenter={handleLogoEnter}
		onmouseleave={handleLogoLeave}
	>
		<img src="/assets/filled-shapes/logo.svg" alt="logo" />
		<img src="/assets/filled-shapes/branding.svg" alt="branding" />
	</a>
	<div class="nav__links" bind:this={navLinks}>
		<a
			href="#signin"
			class="nav__link"
			onmouseenter={handleLinkEnter}
			onmouseleave={handleLinkLeave}
		>
			<img src="/assets/stroke-4px-32px/signin.svg" alt="signin" />
			Sign In
		</a>
		<a
			href="#support"
			class="nav__link"
			onmouseenter={handleLinkEnter}
			onmouseleave={handleLinkLeave}
		>
			<img src="/assets/stroke-4px-32px/support.svg" alt="support" />
			Support
		</a>
		<a
			href="#cart"
			class="nav__link"
			onmouseenter={handleLinkEnter}
			onmouseleave={handleLinkLeave}
		>
			<img src="/assets/stroke-4px-32px/cart.svg" alt="cart" />
			My Cart
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
		filter: var(--filter-primary);
	}

	.nav__links {
		display: flex;
		gap: calc(var(--spacing-xl) - var(--spacing-lg));
	}

	.nav__link {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		color: var(--color-secondary);
		font-weight: 500;
		align-items: center;
	}

	.nav__link img {
		height: var(--spacing-lg);
		filter: var(--filter-secondary);
	}
</style>

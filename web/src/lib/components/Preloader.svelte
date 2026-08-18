<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	interface Props {
		onDone?: () => void;
	}

	let { onDone }: Props = $props();
	let overlayRef = $state<HTMLElement>();
	let prevOverflow = '';

	onMount(() => {
		if (!overlayRef) return;
		const overlay = overlayRef;

		prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const finish = () => {
			if (overlayRef) gsap.set(overlayRef, { display: 'none' });
			document.body.style.overflow = prevOverflow;
			onDone?.();
		};

		const mm = gsap.matchMedia();

		mm.add(
			{
				reduceMotion: '(prefers-reduced-motion: reduce)',
				noReduce: '(prefers-reduced-motion: no-preference)'
			},
			(ctx) => {
				if (ctx.conditions?.reduceMotion) {
					finish();
					return;
				}

				const tl = gsap.timeline({
					defaults: { ease: 'power3.out' },
					onComplete: finish
				});

				tl.fromTo(
					'.preloader__logo',
					{ autoAlpha: 0, scale: 0.92 },
					{ autoAlpha: 1, scale: 1, duration: 0.7 }
				)
					.fromTo(
						'.preloader__branding',
						{ autoAlpha: 0, y: 10 },
						{ autoAlpha: 1, y: 0, duration: 0.55 },
						'-=0.4'
					)
					.fromTo(
						'.preloader__line',
						{ scaleX: 0 },
						{ scaleX: 1, duration: 0.7, ease: 'power2.inOut' },
						'-=0.45'
					)
					.to(
						'.preloader__content',
						{ autoAlpha: 0, y: -16, duration: 0.45, ease: 'power2.in' },
						'+=1.15'
					)
					.to(overlay, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, '<');
			},
			overlayRef
		);

		return () => {
			mm.revert();
			document.body.style.overflow = prevOverflow;
		};
	});
</script>

<div class="preloader" bind:this={overlayRef}>
	<div class="preloader__content">
		<img class="preloader__logo" src="/assets/filled-shapes/logo.svg" alt="Kalharam" />
		<img class="preloader__branding" src="/assets/filled-shapes/branding.svg" alt="Kalharam" />
		<div class="preloader__line" aria-hidden="true"></div>
	</div>
</div>

<style>
	.preloader {
		position: fixed;
		inset: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface);
	}

	.preloader__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
	}

	.preloader__logo {
		height: var(--height-logo);
		filter: var(--filter-primary);
	}

	.preloader__branding {
		height: 1.5rem;
		filter: var(--filter-primary);
	}

	.preloader__line {
		width: 100%;
		height: 2px;
		background-color: var(--color-primary);
		transform-origin: center;
		transform: scaleX(0);
	}
</style>
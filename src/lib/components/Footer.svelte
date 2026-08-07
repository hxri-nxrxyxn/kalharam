<script>

</script>

<footer>
	<div class="footer__boxes">
		<div class="footer__box">
			<h3>Legal</h3>
			<a href="#shipping">Shipping Policy</a>
			<a href="#privacy">Privacy Policy</a>
			<a href="#terms">Terms of Service</a>
			<a href="#return">Return Policy</a>
		</div>
		<div class="footer__box">
			<h3>Information</h3>
			<a href="#faq">FAQ</a>
			<a href="#blog">Blog</a>
			<a href="#newsletter">Newsletter</a>
			<a href="#about">About Us</a>
			<a href="#contact">Contact Us</a>
		</div>
	</div>
	<div class="footer__media">
        <div class="footer__media-icon">
			<img src="/assets/filled-shapes/instagram.svg" alt="instagram" />
			<a href="#instagram">Instagram</a>
		</div>
		<div class="footer__media-icon">
			<img src="/assets/filled-shapes/youtube.svg" alt="youtube" />
			<a href="#youtube">YouTube</a>
		</div>
		<div class="footer__media-icon">
			<img src="/assets/filled-shapes/facebook.svg" alt="facebook" />
			<a href="#facebook">Facebook</a>
		</div>
	</div>
</footer>

<style>
	footer {
		display: flex;
		padding: var(--spacing-lg) var(--spacing-xl);
		background-color: var(--color-surface);
		justify-content: space-between;
	}
	footer a {
		color: var(--color-secondary);
		font-weight: 500;
	}
	footer h3 {
		color: var(--color-primary);
	}
	.footer__boxes {
		display: flex;
		gap: var(--spacing-xl);
	}
	.footer__box {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
    }
	.footer__media {
		justify-content: flex-end;
		align-items: flex-end;
		display: flex;
		gap: var(--spacing-lg);
	}
	.footer__media-icon {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
	.footer__media-icon img {
		height: var(--height-icon);
		filter: var(--filter-secondary);
	}

	@media (max-width: 768px) {
		footer {
			flex-direction: column;
			gap: var(--spacing-xl);
		}

		.footer__boxes {
			flex-direction: column;
			gap: var(--spacing-lg);
		}

		.footer__media {
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;
		}
	}
</style>
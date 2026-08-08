<script lang="ts">
	import Field from '$lib/components/Field.svelte';
</script>

<div class="checkout">
	<div class="checkout__section">
		<h3>Delivery</h3>
		<div class="checkout__fieldset">
			<Field label="Name">
				<input type="text" placeholder="Enter Full Name" aria-label="Full Name" />
			</Field>

			<Field label="Address">
				<input type="text" placeholder="Street Address" aria-label="Address" />
			</Field>

			<Field label="Apartment/Suite">
				<input type="text" placeholder="Apartment, suite, unit, etc." aria-label="Apartment or Suite" />
			</Field>

			<div class="checkout__row">
				<Field label="City">
					<input type="text" placeholder="City" aria-label="City" />
				</Field>

				<Field label="State">
					<input type="text" placeholder="State" aria-label="State" />
				</Field>

				<Field label="PIN">
					<input type="text" placeholder="PIN Code" aria-label="PIN Code" />
				</Field>
			</div>
		</div>
	</div>

	<div class="checkout__section">
		<h3>Contact</h3>
		<div class="checkout__fieldset">
			<Field label="Phone">
				<input type="tel" placeholder="Enter Phone Number" aria-label="Phone Number" />
			</Field>

			<Field label="Email">
				<input type="email" placeholder="Enter Email Address" aria-label="Email Address" />
			</Field>
		</div>
	</div>

	<button class="btn btn--primary" style="width: 100%; margin-top: var(--spacing-sm);">PROCEED TO PAYMENT</button>
</div>

<style>
	.checkout {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}
	
	.checkout__section h3 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.checkout__fieldset {
		width: 100%;
		padding: var(--spacing-lg);
		background-color: var(--color-surface);
	}

	.checkout__row {
		display: flex;
		gap: var(--spacing-md);
	}

	.checkout__row :global(.field) {
		flex: 1;
	}

	@media (max-width: 768px) {
		.checkout__row {
			flex-direction: column;
			gap: 0;
		}
	}
</style>

<script lang="ts">
	import Field from '$lib/components/Field.svelte';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/cart.svelte';
	import { toast } from '$lib/toast.svelte';
	import { API_BASE } from '$lib/config';
	
	let customerName = $state('');
	let address = $state('');
	let apt = $state('');
	let city = $state('');
	let userState = $state('');
	let pin = $state('');
	let phone = $state('');
	let email = $state('');
	let isSubmitting = $state(false);

	const indianStates = [
		'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
		'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
		'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
		'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
		'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
		'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
		'Ladakh', 'Lakshadweep', 'Puducherry'
	];

	async function handleProceed() {
		if (cart.items.length === 0) return;
		
		if (!customerName || !email || !phone || !address || !city || !pin || !userState) {
			toast.show("Please fill out all required delivery and contact fields.");
			return;
		}

		const phoneDigits = phone.replace(/\D/g, '');
		if (phoneDigits.length < 10) {
			toast.show("Please enter a valid 10-digit phone number.");
			return;
		}

		if (!/^\d{6}$/.test(pin.trim())) {
			toast.show("Please enter a valid 6-digit PIN code.");
			return;
		}

		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			toast.show("Please enter a valid email address.");
			return;
		}

		isSubmitting = true;
		
		try {
			const res = await fetch(`${API_BASE}/orders`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customerName,
					email,
					phone,
					address: `${address} ${apt}`.trim(),
					city,
					state: userState,
					pin: pin.trim(),
					total: cart.total,
					items: cart.items
				})
			});
			
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || 'Order failed to process');
			}
			
			cart.clear();
			goto('/success');
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.show(error.message || 'Failed to process order. Please try again.');
			} else {
				toast.show('Failed to process order. Please try again.');
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="checkout">
	<div class="checkout__section">
		<h3>Delivery</h3>
		<div class="checkout__fieldset">
			<Field label="Name">
				<input type="text" placeholder="e.g. Lakshmi Narayanan" aria-label="Full Name" autocomplete="off" bind:value={customerName} />
			</Field>

			<Field label="Address">
				<input type="text" placeholder="e.g. 12/4, Temple Road, Mylapore" aria-label="Address" autocomplete="off" bind:value={address} />
			</Field>

			<Field label="Apartment/Suite">
				<input type="text" placeholder="e.g. Flat 3B, Krishna Apartments" aria-label="Apartment or Suite" autocomplete="off" bind:value={apt} />
			</Field>

			<div class="checkout__row">
				<Field label="City">
					<input type="text" placeholder="e.g. Chennai" aria-label="City" autocomplete="off" bind:value={city} />
				</Field>

				<Field label="State">
					<select aria-label="State" bind:value={userState}>
						<option value="" disabled selected>Select State</option>
						{#each indianStates as s}
							<option value={s}>{s}</option>
						{/each}
					</select>
				</Field>

				<Field label="PIN">
					<input type="text" placeholder="e.g. 600004" aria-label="PIN Code" autocomplete="off" bind:value={pin} />
				</Field>
			</div>
		</div>
	</div>

	<div class="checkout__section">
		<h3>Contact</h3>
		<div class="checkout__fieldset">
			<Field label="Phone">
				<input type="tel" placeholder="e.g. +91 98765 43210" aria-label="Phone Number" autocomplete="off" bind:value={phone} />
			</Field>

			<Field label="Email">
				<input type="email" placeholder="e.g. lakshmi.n@example.com" aria-label="Email Address" autocomplete="off" bind:value={email} />
			</Field>
		</div>
	</div>

	<button class="btn btn--primary" onclick={handleProceed} disabled={cart.items.length === 0 || isSubmitting}>
		{isSubmitting ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
	</button>
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

	.checkout :global(.btn) {
		width: 100%;
		margin-top: var(--spacing-sm);
	}

	@media (max-width: 768px) {
		.checkout__row {
			flex-direction: column;
			gap: 0;
		}
	}
</style>

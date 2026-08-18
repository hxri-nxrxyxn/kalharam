<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Card from "$lib/components/ui/card";
	import { Separator } from "$lib/components/ui/separator";
	import { toast } from "svelte-sonner";
	import { signIn } from "$lib/stores/app.svelte";
	import GemIcon from "@lucide/svelte/icons/gem";
	import MonitorSmartphoneIcon from "@lucide/svelte/icons/monitor-smartphone";

	let email = $state("admin@kalharam.example");
	let password = $state("demo1234");
	let busy = $state(false);

	async function submit() {
		if (!email.trim() || !password) {
			toast.error("Enter email and password");
			return;
		}
		busy = true;
		try {
			const res = await fetch('http://localhost:3000/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Login failed');
			
			localStorage.setItem('admin_token', data.token);
			
			signIn({ name: "Admin", email, role: "admin" });
			toast.success("Signed in");
			goto("/");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			busy = false;
		}
	}
</script>

<div class="flex min-h-dvh items-center justify-center bg-muted/40 px-4">
	<div class="w-full max-w-sm">
		<Card.Root class="border shadow-lg">
			<Card.Header class="items-center text-center">
				<div class="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
					<GemIcon class="size-5" />
				</div>
				<Card.Title class="text-xl">Kalharam · Admin</Card.Title>
				<Card.Description>Boutique operations console</Card.Description>
			</Card.Header>

			<Card.Content class="flex flex-col gap-4">
				<div class="flex flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={email} />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} />
				</div>

				<Button onclick={submit} disabled={busy}>
					{busy ? "Signing in…" : "Sign in"}
				</Button>

				<Separator />
				<p class="flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
					<MonitorSmartphoneIcon class="mt-0.5 size-4 shrink-0" />
					<span>Demo credentials are pre-filled. The same account can be signed in from multiple devices — every
					update stays in sync across them.</span>
				</p>
			</Card.Content>
		</Card.Root>
	</div>
</div>

import type { ActiveSession, Category, Order, Product } from "$lib/types";
import { API_BASE, BACKEND_URL } from "$lib/config";
import {
	type SessionUser,
	type StorePatch,
	type SyncMessage,
	type SyncTransport,
	createTransport,
	currentPlatform,
	getOrCreateDeviceId
} from "$lib/sync/transport";

export type { SessionUser } from "$lib/sync/transport";

/**
 * Reactive global state shared across the app (client-side).
 *
 * Multi-device sync: every mutation is broadcast as a patch through the sync
 * transport and applied locally on every connected device. `initSync()` wires
 * up the transport (BroadcastChannel today — backend later).
 */
export const productsState = $state<Product[]>([]);
export const ordersState = $state<Order[]>([]);
export const categoriesState = $state<Category[]>([]);
export const sessionsState = $state<ActiveSession[]>([]);

/** Auth state — the account is shared; any device can sign in on it. */
export const auth = $state<{ user: SessionUser | null }>({ user: null });

let transport: SyncTransport | null = null;
let syncStarted = false;
/** monotonic revision of the shared state; grows on every applied mutation */
let revision = 0;

function myId() {
	return transport?.deviceId ?? "";
}

function shortId(id: string) {
	return id.replace(/-/g, "").slice(0, 4).toUpperCase();
}

function bump() {
	revision += 1;
}

function selfSession(): ActiveSession {
	return {
		device: `This tab (${shortId(myId())})`,
		os: currentPlatform(),
		location: "Local",
		ip: "127.0.0.1",
		loggedInAt: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
		current: true,
		deviceId: myId()
	};
}

function broadcast(patch: StorePatch) {
	transport?.broadcast({ kind: "patch", deviceId: transport.deviceId, patch });
}

function removeSession(deviceId: string) {
	const i = sessionsState.findIndex((s) => s.deviceId === deviceId);
	if (i >= 0) sessionsState.splice(i, 1);
}

function resetState() {
	productsState.length = 0;
	ordersState.length = 0;
	categoriesState.length = 0;
	sessionsState.length = 0;
	sessionsState.push(selfSession());
	auth.user = null;
}

function applyPatch(patch: StorePatch) {
	switch (patch.action) {
		case "product:add":
			if (!productsState.some((p) => p.id === patch.payload.id)) {
				productsState.push(patch.payload);
				bump();
			}
			break;
		case "product:update": {
			const existing = productsState.find((x) => x.id === patch.payload.id);
			if (existing) {
				Object.assign(existing, patch.payload.fields);
				bump();
			}
			break;
		}
		case "product:restock": {
			const p = productsState.find((x) => x.id === patch.payload.productId);
			if (p) {
				p.stock += patch.payload.qty;
				bump();
			}
			break;
		}
		case "order:status": {
			const o = ordersState.find((x) => x.id === patch.payload.id);
			if (o) {
				o.status = patch.payload.status;
				bump();
			}
			break;
		}
		case "auth:login":
			auth.user = patch.payload;
			bump();
			break;
		case "auth:logout":
			auth.user = null;
			bump();
			break;
		case "session:end":
			removeSession(patch.payload.deviceId);
			if (patch.payload.deviceId === myId()) auth.user = null;
			bump();
			break;
		case "reset":
			resetState();
			bump();
			break;
	}
}

function handleMessage(message: SyncMessage) {
	if (!transport) return;
	switch (message.kind) {
		case "session-hello":
			if (message.deviceId === myId()) return;
			if (!sessionsState.some((s) => s.deviceId === message.deviceId)) {
				sessionsState.push({ ...message.session, current: false });
			}
			break;
		case "session-bye":
			if (message.deviceId === myId()) return;
			removeSession(message.deviceId);
			break;
		case "patch":
			if (message.deviceId === myId()) return;
			applyPatch(message.patch);
			break;
	}
}

export async function loadBackendData() {
	try {
		const [prodRes, ordRes, catRes] = await Promise.all([
			fetch(`${API_BASE}/admin/products`, { cache: 'no-store' }),
			fetch(`${API_BASE}/admin/orders`, { cache: 'no-store' }),
			fetch(`${API_BASE}/admin/raw-categories`, { cache: 'no-store' })
		]);
		
		if (prodRes.ok) {
			const data = await prodRes.json();
			productsState.length = 0;
			productsState.push(...data);
		}
		
		if (ordRes.ok) {
			const data = await ordRes.json();
			ordersState.length = 0;
			ordersState.push(...data);
		}
		
		if (catRes.ok) {
			const data = await catRes.json();
			categoriesState.length = 0;
			categoriesState.push(...data);
		}
	} catch (err) {
		// handle or swallow error
	}
}

/** Refresh just the category list (e.g. after a rename) without disturbing other state. */
export async function refreshCategories() {
	try {
		const res = await fetch(`${API_BASE}/admin/raw-categories`, { cache: 'no-store' });
		if (!res.ok) return;
		const data = await res.json();
		categoriesState.length = 0;
		categoriesState.push(...data);
	} catch (err) {
		// handle or swallow error
	}
}

/** Lightweight poller that syncs new/customer-updated orders without disturbing products. */
export async function refreshOrders() {
	try {
		const res = await fetch(`${API_BASE}/admin/orders`, { cache: 'no-store' });
		if (!res.ok) return;
		const data = await res.json();
		ordersState.length = 0;
		ordersState.push(...data);
	} catch (err) {
		// handle or swallow error
	}
}

/** Wire up the sync transport. Call once from the root layout (browser only). */
export function initSync() {
	if (typeof window === "undefined" || syncStarted) return;
	syncStarted = true;
	
	// Fetch real data on init
	loadBackendData();
	
	if (typeof window !== "undefined") {
		window.addEventListener('reload-store', loadBackendData);
		// Keep an eye out for orders placed on the storefront
		setInterval(refreshOrders, 15000);
	}

	transport = createTransport(getOrCreateDeviceId());
	transport.onMessage(handleMessage);
	sessionsState.push(selfSession());
	transport.broadcast({ kind: "session-hello", deviceId: transport.deviceId, session: selfSession() });
	window.addEventListener("beforeunload", () => {
		transport?.broadcast({ kind: "session-bye", deviceId: transport.deviceId });
		transport?.close();
		transport = null;
	});
}

/** Current device's stable id (used to mark "this device" in session lists). */
export function myDeviceId() {
	return myId();
}

export function addCategory(name: string) {
	const t = name.trim();
	if (!t) return;
	const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
	if (!categoriesState.some((c) => c.id === slug)) {
		categoriesState.push({ id: slug, name: t, imageId: '' });
		bump();
	}
}

export function addProduct(p: Product) {
	productsState.push(p);
	bump();
	const patch: StorePatch = { action: "product:add", payload: p };
	broadcast(patch);
}

export async function updateProduct(id: string, fields: Partial<Product>) {
	const p = productsState.find((x) => x.id === id);
	if (!p) return;
	
	// optimistic update
	Object.assign(p, fields);
	bump();
	const patch: StorePatch = { action: "product:update", payload: { id, fields } };
	broadcast(patch);

	// send to backend
	try {
		await fetch(`${API_BASE}/admin/products/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(fields)
		});
	} catch (e) {
		// handle or swallow error
	}
}

export async function setOrderStatus(orderId: string, id: string, status: Order["status"]) {
	const o = ordersState.find((x) => x.id === id);
	if (o) o.status = status;
	bump();
	const patch: StorePatch = { action: "order:status", payload: { id, status } };
	broadcast(patch);

	try {
		await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status })
		});
	} catch (e) {
		// handle or swallow error
	}
}

export function buyBackStock(productId: string, qty: number) {
	const p = productsState.find((x) => x.id === productId);
	if (p) p.stock += qty;
	bump();
	const patch: StorePatch = { action: "product:restock", payload: { productId, qty } };
	broadcast(patch);
}

export function signIn(user: SessionUser) {
	auth.user = user;
	bump();
	const patch: StorePatch = { action: "auth:login", payload: user };
	broadcast(patch);
}

export function signOut() {
	auth.user = null;
	bump();
	const patch: StorePatch = { action: "auth:logout", payload: null };
	broadcast(patch);
}

/** End a device session (any device). Ending a remote device signs it out there too. */
export function endSession(deviceId: string) {
	removeSession(deviceId);
	if (deviceId === myId()) auth.user = null;
	bump();
	const patch: StorePatch = { action: "session:end", payload: { deviceId } };
	broadcast(patch);
}

export function resetDemo() {
	resetState();
	bump();
	const patch: StorePatch = { action: "reset", payload: null };
	broadcast(patch);
	// Repopulate from the backend DB (never mock/hardcoded data)
	loadBackendData();
}

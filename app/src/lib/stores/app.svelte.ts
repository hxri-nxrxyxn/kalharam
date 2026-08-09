import type { ActiveSession, Order, Product } from "$lib/types";
import { seedOrders, seedProducts, CATEGORIES } from "$lib/mock/data";
import {
	type SessionUser,
	type SnapshotData,
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
export const categoriesState = $state<string[]>([...CATEGORIES]);
export const sessionsState = $state<ActiveSession[]>([]);

/** Auth state — the account is shared; any device can sign in on it. */
export const auth = $state<{ user: SessionUser | null }>({ user: null });

let transport: SyncTransport | null = null;
let syncStarted = false;
/** monotonic revision of the shared state; grows on every applied mutation */
let revision = 0;
/** true once this device has adopted a peer snapshot (history we didn't witness) */
let hydrated = false;
/** local mutations made before hydration — replayed on top of the snapshot */
let pendingLocalPatches: StorePatch[] = [];

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
	productsState.push(...seedProducts);
	ordersState.length = 0;
	ordersState.push(...seedOrders);
	sessionsState.length = 0;
	sessionsState.push(selfSession());
	auth.user = null;
}

function applySnapshot(data: SnapshotData) {
	if (hydrated && data.revision <= revision) return;
	revision = data.revision;
	productsState.length = 0;
	productsState.push(...data.products);
	ordersState.length = 0;
	ordersState.push(...data.orders);
	sessionsState.length = 0;
	for (const s of data.sessions) {
		if (s.deviceId === myId()) continue;
		sessionsState.push({ ...s, current: false });
	}
	if (!sessionsState.some((s) => s.deviceId === myId())) {
		sessionsState.push(selfSession());
	}
	auth.user = data.user;
	hydrated = true;
	// any change this device made before hydrating is re-applied on top
	for (const p of pendingLocalPatches) applyPatch(p);
	pendingLocalPatches = [];
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
		case "request-snapshot":
			if (message.deviceId === myId()) return;
			transport.broadcast({
				kind: "snapshot",
				deviceId: myId(),
				requestId: message.requestId,
				data: {
					products: [...productsState],
					orders: [...ordersState],
					sessions: [...sessionsState],
					user: auth.user,
					revision
				}
			});
			break;
		case "snapshot":
			if (message.deviceId === myId()) return;
			applySnapshot(message.data);
			break;
		case "patch":
			if (message.deviceId === myId()) return;
			applyPatch(message.patch);
			break;
	}
}

export async function loadBackendData() {
	try {
		const [prodRes, ordRes] = await Promise.all([
			fetch('http://localhost:3000/api/admin/products'),
			fetch('http://localhost:3000/api/admin/orders')
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
	} catch (err) {
		console.error('Failed to load backend data:', err);
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
	}

	transport = createTransport(getOrCreateDeviceId());
	transport.onMessage(handleMessage);
	sessionsState.push(selfSession());
	transport.broadcast({ kind: "session-hello", deviceId: transport.deviceId, session: selfSession() });
	transport.broadcast({
		kind: "request-snapshot",
		deviceId: transport.deviceId,
		requestId: crypto.randomUUID()
	});
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
	if (!categoriesState.includes(t)) {
		categoriesState.push(t);
		bump();
	}
}

export function addProduct(p: Product) {
	productsState.push(p);
	bump();
	const patch: StorePatch = { action: "product:add", payload: p };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);
}

export async function updateProduct(id: string, fields: Partial<Product>) {
	const p = productsState.find((x) => x.id === id);
	if (!p) return;
	
	// optimistic update
	Object.assign(p, fields);
	bump();
	const patch: StorePatch = { action: "product:update", payload: { id, fields } };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);

	// send to backend
	try {
		await fetch(`http://localhost:3000/api/admin/products/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(fields)
		});
	} catch (e) {
		console.error("Failed to sync product update:", e);
	}
}

export async function setOrderStatus(orderId: string, id: string, status: Order["status"]) {
	const o = ordersState.find((x) => x.id === id);
	if (o) o.status = status;
	bump();
	const patch: StorePatch = { action: "order:status", payload: { id, status } };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);

	try {
		await fetch(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status })
		});
	} catch (e) {
		console.error("Failed to sync order status:", e);
	}
}

export function buyBackStock(productId: string, qty: number) {
	const p = productsState.find((x) => x.id === productId);
	if (p) p.stock += qty;
	bump();
	const patch: StorePatch = { action: "product:restock", payload: { productId, qty } };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);
}

export function signIn(user: SessionUser) {
	auth.user = user;
	bump();
	const patch: StorePatch = { action: "auth:login", payload: user };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);
}

export function signOut() {
	auth.user = null;
	bump();
	const patch: StorePatch = { action: "auth:logout", payload: null };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);
}

/** End a device session (any device). Ending a remote device signs it out there too. */
export function endSession(deviceId: string) {
	removeSession(deviceId);
	if (deviceId === myId()) auth.user = null;
	bump();
	const patch: StorePatch = { action: "session:end", payload: { deviceId } };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);
}

export function resetDemo() {
	resetState();
	bump();
	const patch: StorePatch = { action: "reset", payload: null };
	if (!hydrated) pendingLocalPatches.push(patch);
	broadcast(patch);
}

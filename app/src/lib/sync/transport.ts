import type { ActiveSession, Order, Product } from "$lib/types";

export interface SessionUser {
	name: string;
	email: string;
	role: "admin";
}

/** Oplog patches exchanged between devices. Each maps 1:1 to a store mutation. */
export type StorePatch =
	| { action: "product:add"; payload: Product }
	| { action: "product:update"; payload: { id: string; fields: Partial<Product> } }
	| { action: "product:restock"; payload: { productId: string; qty: number } }
	| { action: "order:status"; payload: { id: string; status: Order["status"] } }
	| { action: "auth:login"; payload: SessionUser }
	| { action: "auth:logout"; payload: null }
	| { action: "session:end"; payload: { deviceId: string } }
	| { action: "reset"; payload: null };

/** Full state snapshot used to hydrate a newly connected device. */
export interface SnapshotData {
	products: Product[];
	orders: Order[];
	sessions: ActiveSession[];
	user: SessionUser | null;
	/** monotonic revision of the sender; receivers only apply snapshots with a higher revision */
	revision: number;
}

export type SyncMessage =
	| { kind: "request-snapshot"; deviceId: string; requestId: string }
	| { kind: "snapshot"; deviceId: string; requestId: string; data: SnapshotData }
	| { kind: "patch"; deviceId: string; patch: StorePatch }
	| { kind: "session-hello"; deviceId: string; session: ActiveSession }
	| { kind: "session-bye"; deviceId: string };

/**
 * Pluggable sync transport. Today it uses BroadcastChannel (same-origin
 * tabs/windows) so the multi-device behaviour is demonstrable without a
 * server. When the real backend lands, swap this for a WebSocket/SSE
 * implementation with the same interface — nothing else changes.
 */
export interface SyncTransport {
	readonly deviceId: string;
	broadcast(message: SyncMessage): void;
	onMessage(handler: (message: SyncMessage) => void): void;
	close(): void;
}

const CHANNEL_NAME = "kalharam-sync";
const DEVICE_KEY = "kalharam-device-id";

/** Stable per-tab id, persisted in sessionStorage so reloads keep the same identity. */
/** crypto.randomUUID requires a secure context (HTTPS). Fall back to Math.random on plain HTTP. */
function generateId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	// Fallback for non-secure HTTP contexts
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
}

export function getOrCreateDeviceId(): string {
	if (typeof sessionStorage === 'undefined') return generateId();
	let id = sessionStorage.getItem(DEVICE_KEY);
	if (!id) {
		id = generateId();
		sessionStorage.setItem(DEVICE_KEY, id);
	}
	return id;
}

export function currentPlatform(): string {
	if (typeof navigator === "undefined") return "Unknown";
	// @ts-expect-error navigator.userAgentData is a newer API
	return navigator.userAgentData?.platform || navigator.platform || "Browser";
}

class BroadcastChannelTransport implements SyncTransport {
	readonly deviceId: string;
	private channel: BroadcastChannel | null = null;
	private handler: ((message: SyncMessage) => void) | null = null;

	constructor(deviceId: string) {
		this.deviceId = deviceId;
		if (typeof BroadcastChannel !== "undefined") {
			this.channel = new BroadcastChannel(CHANNEL_NAME);
			this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
				if (event.data) this.handler?.(event.data);
			};
		}
	}

	broadcast(message: SyncMessage) {
		this.channel?.postMessage(message);
	}

	onMessage(handler: (message: SyncMessage) => void) {
		this.handler = handler;
	}

	close() {
		this.channel?.close();
		this.channel = null;
		this.handler = null;
	}
}

export function createTransport(deviceId: string): SyncTransport {
	return new BroadcastChannelTransport(deviceId);
}

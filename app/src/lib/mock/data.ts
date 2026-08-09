import type { ActiveSession, Order, PendingStock, Product } from "$lib/types";

export const CATEGORIES: string[] = [];

export const seedProducts: Product[] = [];

export const seedOrders: Order[] = [
	{ orderId: "ORD-901", id: "ORD-9012", customer: "Aisha R.", item: "Linen Casual Saree", productId: "P-1004", qty: 2, total: 178, status: "new", time: "2m ago" },
	{ orderId: "ORD-901", id: "ORD-9011", customer: "Maya K.", item: "Designer Silk Saree", productId: "P-1007", qty: 1, total: 349, status: "new", time: "9m ago" },
	{ orderId: "ORD-901", id: "ORD-9010", customer: "Sofia L.", item: "Kanjivaram Silk Saree", productId: "P-1001", qty: 1, total: 299, status: "processing", time: "24m ago" },
	{ orderId: "ORD-901", id: "ORD-9009", customer: "Priya M.", item: "Chiffon Pastel Saree", productId: "P-1005", qty: 3, total: 222, status: "processing", time: "41m ago" },
	{ orderId: "ORD-901", id: "ORD-9008", customer: "Elena V.", item: "Kanjivaram Party Saree", productId: "P-1010", qty: 1, total: 199, status: "shipped", time: "1h ago" },
	{ orderId: "ORD-901", id: "ORD-9007", customer: "Nina P.", item: "Cotton Handloom Saree", productId: "P-1003", qty: 2, total: 118, status: "shipped", time: "2h ago" },
	{ orderId: "ORD-901", id: "ORD-9006", customer: "Riya S.", item: "Georgette Floral Saree", productId: "P-1006", qty: 1, total: 64, status: "delivered", time: "5h ago" },
	{ orderId: "ORD-901", id: "ORD-9005", customer: "Ananya T.", item: "Daily Wear Cotton Saree", productId: "P-1008", qty: 1, total: 49, status: "delivered", time: "8h ago" },
	{ orderId: "ORD-901", id: "ORD-9004", customer: "Zara Q.", item: "Banarasi Work Saree", productId: "P-1013", qty: 1, total: 279, status: "cancelled", time: "1d ago" }
];

export const seedPending: PendingStock[] = [
	{
		category: "Kanjivaram Silk",
		imageTone: "bg-emerald-500",
		supplier: "Chettynadu Silks",
		expectedDate: "Aug 06",
		totalQty: 120,
		lines: [
			{ name: "Kanjivaram Silk Saree", qty: 60 },
			{ name: "Kanjivaram Party Saree", qty: 60 }
		]
	},
	{
		category: "Banarasi Silk",
		imageTone: "bg-emerald-500",
		supplier: "Varanasi Heritage Weaves",
		expectedDate: "Aug 09",
		totalQty: 80,
		lines: [
			{ name: "Banarasi Silk Saree", qty: 35 },
			{ name: "Banarasi Work Saree", qty: 45 }
		]
	},
	{
		category: "Chiffon",
		imageTone: "bg-emerald-500",
		supplier: "Aurum Textiles",
		expectedDate: "Aug 12",
		totalQty: 150,
		lines: [
			{ name: "Chiffon Pastel Saree", qty: 90 },
			{ name: "Chiffon Designer Saree", qty: 60 }
		]
	},
	{
		category: "Designer",
		imageTone: "bg-emerald-500",
		supplier: "Struct & Weave",
		expectedDate: "Aug 15",
		totalQty: 40,
		lines: [{ name: "Designer Silk Saree", qty: 40 }]
	}
];

export const seedSessions: ActiveSession[] = [];

/** monthly revenue + order volume trend */
export const salesTrend = [
	{ month: "Feb", revenue: 8400, orders: 182 },
	{ month: "Mar", revenue: 10900, orders: 214 },
	{ month: "Apr", revenue: 13200, orders: 261 },
	{ month: "May", revenue: 11800, orders: 243 },
	{ month: "Jun", revenue: 15400, orders: 298 },
	{ month: "Jul", revenue: 17200, orders: 337 },
	{ month: "Aug", revenue: 19600, orders: 389 }
];

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Product {
	id: string;
	name: string;
	category: string;
	color?: string;
	/** short description shown to buyers */
	details: string;
	price: number;
	offerPrice: number | null;
	rating?: number;
	/** current stock on hand */
	stock: number;
	/** lifetime units sold */
	sold: number;
	/** demand index (units wanted / month) */
	demand: number;
	/** days since last sale; null if actively selling */
	deadStockDays: number | null;
	/** main/cover image (first photo in `images`) */
	image: string;
	imageId: string;
	/** additional photos shown in the product gallery */
	images?: string[];
	imageTone: string; // tailwind solid color class for the image placeholder
	createdAt: string;
}

export interface Order {
	id: string;
	orderId: string;
	customer: string;
	item: string;
	productId: string;
	qty: number;
	total: number;
	status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
	time: string;
	email?: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	pin?: string;
}

export interface PendingLine {
	name: string;
	qty: number;
}

export interface PendingStock {
	category: string;
	imageTone: string;
	supplier: string;
	expectedDate: string;
	totalQty: number;
	lines: PendingLine[];
}

export interface DeadStock {
	productId: string;
	reason: string;
	days: number;
	qty: number;
	value: number;
	severity: "low" | "medium" | "high";
}

export interface ActiveSession {
	device: string;
	os: string;
	location: string;
	ip: string;
	loggedInAt: string;
	current: boolean;
	/** unique id of the device/tab owning this session (used for multi-device sync) */
	deviceId?: string;
}

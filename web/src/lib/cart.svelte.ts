import type { CartItem, Product } from '$lib/types';

class CartState {
	items = $state<CartItem[]>([]);

	get total() {
		return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
	}

	get count() {
		return this.items.reduce((total, item) => total + item.quantity, 0);
	}

	add(product: Product, quantity: number = 1) {
		if (product.stock <= 0) return;
		const qty = Math.min(quantity, product.stock);
		const existingItem = this.items.find((item) => item.id === product.id);
		
		if (existingItem) {
			existingItem.quantity = Math.min(existingItem.quantity + qty, existingItem.stock);
		} else {
			this.items.push({
				id: product.id,
				title: product.title,
				subtitle: product.subtitle,
				image: product.image,
				rating: product.rating,
				stock: product.stock,
				mrp: product.mrp,
				price: product.salePrice,
				quantity: qty
			});
		}
	}

	increase(id: string) {
		const item = this.items.find((i) => i.id === id);
		if (item && item.quantity < item.stock) item.quantity += 1;
	}

	decrease(id: string) {
		const item = this.items.find((i) => i.id === id);
		if (item && item.quantity > 1) {
			item.quantity -= 1;
		}
	}

	remove(id: string) {
		this.items = this.items.filter((i) => i.id !== id);
	}

	clear() {
		this.items = [];
	}
}

export const cart = new CartState();

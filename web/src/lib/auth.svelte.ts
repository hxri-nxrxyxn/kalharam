import { browser } from '$app/environment';

class AuthState {
	token = $state<string | null>(null);

	constructor() {
		if (browser) {
			this.token = localStorage.getItem('token');
		}
	}

	login(token: string) {
		this.token = token;
		if (browser) {
			localStorage.setItem('token', token);
		}
	}

	logout() {
		this.token = null;
		if (browser) {
			localStorage.removeItem('token');
		}
	}

	get isAuthenticated() {
		return !!this.token;
	}
}

export const auth = new AuthState();

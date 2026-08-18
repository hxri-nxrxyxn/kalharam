class ToastState {
	message = $state('');
	visible = $state(false);
	private timeoutId?: ReturnType<typeof setTimeout>;

	show(msg: string, duration: number = 3000) {
		this.message = msg;
		this.visible = true;
		
		if (this.timeoutId) clearTimeout(this.timeoutId);
		
		this.timeoutId = setTimeout(() => {
			this.visible = false;
		}, duration);
	}
}

export const toast = new ToastState();

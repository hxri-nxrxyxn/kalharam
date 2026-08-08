const state = $state({
	message: '',
	visible: false
});

let timeoutId: ReturnType<typeof setTimeout>;

export const toast = {
	get state() {
		return state;
	},
	show(msg: string, duration: number = 3000) {
		state.message = msg;
		state.visible = true;
		
		if (timeoutId) clearTimeout(timeoutId);
		
		timeoutId = setTimeout(() => {
			state.visible = false;
		}, duration);
	}
};

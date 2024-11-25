
export class Focus {

	IS_DEBUG = false;

	constructor() {
		if (this.IS_DEBUG) console.log('constructor focus.js');

		const focusReminder = document.getElementById('focusReminder');
		focusReminder.classList.remove('d-none'); // show this element

		const inputBlocker = document.getElementById('inputBlocker');
		inputBlocker.classList.remove('d-none');

		focusReminder.addEventListener('mouseover', () => {
			if (this.IS_DEBUG) console.log('mouseover');
			this.onRemoveFocus();
		});

		inputBlocker.addEventListener('mouseover', () => {
			if (this.IS_DEBUG) console.log('inputBlocker mouseover');
			this.onSetFocus();
		});


		// Add an active state style to the body when it gains focus
		document.body.addEventListener('focus', () => {
			if (this.IS_DEBUG) console.log('focus');
			this.onSetFocus();
		});

		// Remove active state styling when the body loses focus
		document.body.addEventListener('blur', () => {
			if (this.IS_DEBUG) console.log('blur');
			this.onRemoveFocus();
		});

	}

	onSetFocus() {
		if (this.IS_DEBUG) console.log('Focus.onSetFocus()');
		focusReminder.classList.add('d-none');
		inputBlocker.classList.add('d-none');
		document.body.classList.add('active');// Remove any active state styling
		document.body.focus();
	}

	onRemoveFocus() {
		if (this.IS_DEBUG) console.log('Focus.onRemoveFocus()');
		focusReminder.classList.remove('d-none');
		inputBlocker.classList.remove('d-none');
		document.body.classList.remove('active');
	}

}

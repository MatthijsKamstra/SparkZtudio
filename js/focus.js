
export class Focus {

	IS_DEBUG = true;

	constructor() {
		console.log('constructor focus.js');

		const focusReminder = document.getElementById('focusReminder');
		focusReminder.classList.remove('d-none'); // show this element

		const inputBlocker = document.getElementById('inputBlocker');
		inputBlocker.classList.remove('d-none');

		focusReminder.addEventListener('mouseover', () => {
			console.log('mouseover');
			this.onRemoveFocus();
		});

		inputBlocker.addEventListener('mouseover', () => {
			console.log('inputBlocker mouseover');
			this.onSetFocus();
		});

		// document.body.addEventListener('mouseover', () => {
		// 	console.log('body mouseover');
		// 	this.onFocus();
		// 	document.body.removeEventListener('mouseover', () => { console.log('removed') });
		// });

		// Add an active state style to the body when it gains focus
		document.body.addEventListener('focus', () => {
			console.log('focus');
			this.onSetFocus();
		});

		// Remove active state styling when the body loses focus
		document.body.addEventListener('blur', () => {
			console.log('blur');
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

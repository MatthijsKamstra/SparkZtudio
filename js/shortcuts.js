import { Export } from './export.js';
import { Globals } from './globals.js';
import { Model } from './model/model.js';
import { Video } from './video.js';


export class Shortcuts {

	IS_DEBUG = true;

	constructor() { }

	init() {
		if (this.IS_DEBUG) console.info(`init shortcuts.js`);

		document.addEventListener('keydown', function (event) {
			// console.log('keydown');

			if (event.metaKey && event.key === 'n') {
				// ⌘N
				event.preventDefault(); // Prevent the default action
				new Model().newFile();

			} else if (event.metaKey && event.key === 'o') {
				console.log('open');

				// ⌘O
				event.preventDefault(); // Prevent the default action
				new Model().openFile();

			} else if (event.metaKey && event.key === 's') {
				// ⌘S
				event.preventDefault(); // Prevent the default action
				new Model().saveFile();

			} else if (event.shiftKey && event.metaKey && event.key === 's') {
				// ⇧⌘S
				event.preventDefault(); // Prevent the default action
				new Model().saveAsFile();

			} else if (event.metaKey && event.key === 'w') {
				// ⌘W
				event.preventDefault(); // Prevent the default action
				new Model().closeFile();

			} else if (event.metaKey && event.key === 'i') {
				console.log('iomport');
				// ⌘I
				event.preventDefault(); // Prevent the default action
				new Model().importFile();

			} else if (event.metaKey && event.key === 'e') {
				// ⌘E
				event.preventDefault(); // Prevent the default action
				new Model().exportFile();
			}

			else if (event.shiftKey && event.metaKey && event.key === 'e') {
				// ⇧⌘E
				event.preventDefault(); // Prevent the default action
				new Model().exportMovie();

			}
		});

	}

	// const openFileInput = document.getElementById('openFileInput');
	// openFileInput.addEventListener('change', function () {
	// 	const file = openFileInput.files[0];
	// 	if (file) {
	// 		// Implement your open file logic here
	// 		console.log('File opened:', file.name);
	// 	}
	// });




	// importFile() {
	// 	console.log('importFile');

	// 	// doesn't work

	// 	// Create the file input element
	// 	const fileInput = document.createElement('input');
	// 	fileInput.type = 'file';
	// 	fileInput.accept = '.svg';
	// 	fileInput.style.display = 'none';
	// 	fileInput.id = 'openFileInputww';

	// 	// Create the label element
	// 	const label = document.createElement('label');
	// 	label.for = 'openFileInputww';
	// 	label.textContent = 'Open...';
	// 	label.className = 'dropdown-item';


	// 	// Append the file input to the body
	// 	document.body.appendChild(label);
	// 	document.body.appendChild(fileInput);

	// 	// Add change event listener to the file input
	// 	fileInput.addEventListener('change', function (event) {
	// 		const file = event.target.files[0];
	// 		if (file) {
	// 			const reader = new FileReader();
	// 			reader.onload = function (e) {
	// 				console.log('File content:', e.target.result);
	// 				// Add your logic to handle the file content here
	// 			};
	// 			reader.readAsText(file);
	// 		}
	// 	});

	// 	label.click();
	// 	fileInput.click();
	// 	// Trigger the file input click on label click
	// 	label.addEventListener('click', function () {
	// 		console.log('click');

	// 	});
	// }
}

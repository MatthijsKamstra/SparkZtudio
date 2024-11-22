import { Export } from './export.js';
import { Globals } from './globals.js';
import { Video } from './video.js';

const IS_DEBUG = false;


function init() {
	if (IS_DEBUG) console.info(`init shortcust.js`);

	document.addEventListener('keydown', function (event) {
		// console.log('keydown');

		if (event.metaKey && event.key === 's') {
			event.preventDefault(); // Prevent the default action
			Export.file()

		} else if (event.metaKey && event.key === 'o') {
			event.preventDefault(); // Prevent the default action
			openFileInput.click(); // Trigger the open file input

		} else if (event.metaKey && event.key === 'n') {
			// might never work ????
			event.preventDefault(); // Prevent the default action
			newFile(); // Call the new file function

		} else if (event.metaKey && event.key === 'w') {
			event.preventDefault(); // Prevent the default action
			closeFile(); // Call the new file function

		} else if (event.metaKey && event.key === 'i') {
			event.preventDefault(); // Prevent the default action
			importFile(); // Call the new file function

		} else if (event.shiftKey && event.metaKey && event.key === 's') {
			event.preventDefault(); // Prevent the default action
			saveAsFile(); // Call the new file function
		}
		else if (event.shiftKey && event.metaKey && event.key === 'e') {
			event.preventDefault(); // Prevent the default action
			Export.image(); // Call the new file function

		}
		else if (event.metaKey && event.key === 'e') {
			event.preventDefault(); // Prevent the default action
			// moet dit niet centraal?
			const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
			modal.show();
			Video.initializeCanvas();
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

// function saveFile() {
// 	// Implement your save file logic here
// 	console.log('Save file triggered');
// }

function saveAsFile() {
	// Implement your save file logic here
	console.log('saveAsFile file triggered');
}

function closeFile() {
	// Implement your save file logic here
	console.log('closeFile file triggered');
}

function newFile() {
	// Implement your new file logic here
	console.log('New file triggered');
}

function importFile() {
	console.log('importFile');

	// doesn't work

	// Create the file input element
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = '.svg';
	fileInput.style.display = 'none';
	fileInput.id = 'openFileInputww';

	// Create the label element
	const label = document.createElement('label');
	label.for = 'openFileInputww';
	label.textContent = 'Open...';
	label.className = 'dropdown-item';


	// Append the file input to the body
	document.body.appendChild(label);
	document.body.appendChild(fileInput);

	// Add change event listener to the file input
	fileInput.addEventListener('change', function (event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				console.log('File content:', e.target.result);
				// Add your logic to handle the file content here
			};
			reader.readAsText(file);
		}
	});

	label.click();
	fileInput.click();
	// Trigger the file input click on label click
	label.addEventListener('click', function () {
		console.log('click');

	});
}

// Export an object to group the functions
export const Shortcuts = {
	init,
};

import { Export } from './export.js';
import { Globals } from './globals.js';

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
			exportFile(); // Call the new file function
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






function exportFile() {
	// Implement your save file logic here
	console.log('exportFile file triggered');

	// // Example usage with an SVG string
	// const svgString = ` <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
	// <rect x="0" y="0" width="300" height="400" fill="red" />
	// </svg> `;


	const svgContainer = document.getElementById('svg-container');
	const svgElement = svgContainer.querySelector('svg');
	if (!svgElement) {
		console.error('SVG element not found in the container'); return;
	}
	// Serialize the SVG element to a string
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString(svgElement);

	// Get width and height from the SVG element
	const width = svgElement.getAttribute('width');
	const height = svgElement.getAttribute('height');
	if (!width || !height) {
		console.error('Width or height attribute not found on the SVG element');
		return;
	}

	console.log(width);
	console.log(height);


	// Call the function to export and download the PNG
	exportSvgToPng1(svgString, width, height);
}







function exportSvgToPng1(svgData, width, height) {
	// Parse the SVG data string
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
	const svgElement = svgDoc.documentElement;

	// Create a canvas element
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	// Create a Blob from the SVG data
	const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(svgBlob);

	// Create an image element to draw the SVG
	const img = new Image();
	img.onload = function () {
		URL.revokeObjectURL(url);

		// Clear the canvas before drawing
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(img, 0, 0, width, height);

		// Handle external images and other elements sequentially
		const elements = Array.from(svgElement.children);
		processElementsSequentially(elements, 0, ctx, width, height).then(() => {
			// Convert canvas to PNG and trigger download
			const pngData = canvas.toDataURL('image/png');
			const downloadLink = document.createElement('a');
			downloadLink.href = pngData;
			downloadLink.download = 'exported_image.png';
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}).catch(error => {
			console.error('Error processing elements:', error);
		});
	};
	img.onerror = function () {
		URL.revokeObjectURL(url);
		console.error('Error loading main SVG image');
	};
	img.src = url;
}

function processElementsSequentially(elements, index, ctx, width, height) {
	if (index >= elements.length) {
		return Promise.resolve();
	}

	const element = elements[index];
	if (element.tagName === 'image') {
		const href = element.getAttribute('href');
		const x = parseFloat(element.getAttribute('x')) || 0;
		const y = parseFloat(element.getAttribute('y')) || 0;
		const imgWidth = parseFloat(element.getAttribute('width'));
		const imgHeight = parseFloat(element.getAttribute('height'));

		return new Promise((resolve, reject) => {
			const externalImage = new Image();
			externalImage.crossOrigin = 'Anonymous'; // Handle CORS if necessary
			externalImage.onload = function () {
				ctx.drawImage(externalImage, x, y, imgWidth, imgHeight);
				resolve();
			};
			externalImage.onerror = function () {
				console.error('Error loading external image:', href);
				resolve(); // Continue even if the image fails to load
			};
			externalImage.src = href;
		}).then(() => processElementsSequentially(elements, index + 1, ctx, width, height));
	} else {
		return new Promise((resolve, reject) => {
			// Wrap the element in a full SVG wrapper
			const elementString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${new XMLSerializer().serializeToString(element)}</svg>`;
			const tempBlob = new Blob([elementString], { type: 'image/svg+xml;charset=utf-8' });
			const tempUrl = URL.createObjectURL(tempBlob);
			const tempImg = new Image();
			tempImg.onload = function () {
				ctx.drawImage(tempImg, 0, 0, width, height);
				URL.revokeObjectURL(tempUrl);
				resolve();
			};
			tempImg.onerror = function () {
				console.error('Error loading SVG element:', elementString);
				resolve(); // Continue even if the element fails to load
			};
			tempImg.src = tempUrl;
		}).then(() => processElementsSequentially(elements, index + 1, ctx, width, height));
	}
}

// Example usage
// const svgString = `
// <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
//     <!-- Background Rectangle -->
//     <rect id="background" x="0" y="0" width="600" height="400" fill="#f0f0f0" opacity="0.5"></rect>
//     <!-- Image -->
//     <image href="https://placehold.co/600x400/FF3333/000000" x="0" y="0" width="600" height="400" id="id-m2eoxdwuj"></image>
//     <!-- Text Element -->
//     <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="black" id="id-yyjfgemox">
//         Hello, SVG World!
//     </text>
//     <!-- Rectangle -->
//     <rect id="rectangle" x="50" y="60" width="100" height="50" fill="blue" stroke="black" stroke-width="2"></rect>
//     <!-- Circle -->
//     <circle cx="200" cy="85" r="30" fill="green" stroke="black" stroke-width="2" id="id-pbbh8lun8"></circle>
// </svg>
// `;
// exportSvgToPng1(svgString, 600, 400);




function exportSvgToPng(svgData, width, height) {
	// Parse the SVG data string
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
	const svgElement = svgDoc.documentElement;

	// Create a canvas element
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	// Create a Blob from the SVG data
	const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(svgBlob);

	// Create an image element and draw the SVG on the canvas
	const img = new Image();
	img.onload = function () {
		ctx.drawImage(img, 0, 0, width, height);
		URL.revokeObjectURL(url);

		// Convert canvas to PNG and trigger download
		const pngData = canvas.toDataURL('image/png');
		const downloadLink = document.createElement('a');
		downloadLink.href = pngData;
		downloadLink.download = 'exported_image.png';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};
	img.src = url;
}

// // Example usage with an SVG string
// const svgString = `
// <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
//     <rect x="0" y="0" width="600" height="400" fill="rgba(0,0,0,0)" />
// </svg>
// `;

// // Call the function to export and download the PNG
// exportSvgToPng(svgString, 600, 400);


// Export an object to group the functions
export const Shortcuts = {
	init,
};

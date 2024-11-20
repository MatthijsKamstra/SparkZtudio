import { Globals } from './globals.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

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




export function initMenu() {
	console.info('menu.js');

	// File menu items
	document.getElementById('newFile').onclick = function () {
		const modal = new bootstrap.Modal(document.getElementById('svgPropertiesModal'));
		modal.show();
	};
	document.getElementById('saveFile').onclick = function () { alert('Save File'); };
	// document.getElementById('openFile').onclick = openFileFunc();
	document.getElementById('saveAsFile').onclick = function () { alert('Save As File'); };
	document.getElementById('importFile').onclick = function () { alert('importFile As File'); };
	document.getElementById('exportFile').onclick = function () { alert('Edsport As File'); };
	document.getElementById('closeFile').onclick = function () { alert('Close File'); };

	// Open file input
	document.getElementById('openFileInput').addEventListener('change', function (event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const svgContent = e.target.result;
				document.getElementById('svg-container').innerHTML = svgContent;

				// start timeline and properties
				Timeline.setSvg(svgContent);
				Properties.setDocument(svgContent);
			};
			reader.readAsText(file);
		}
	});

	// Create SVG with user-provided properties
	document.getElementById('createSvgButton').onclick = function () {
		const width = document.getElementById('svgWidth').value;
		const height = document.getElementById('svgHeight').value;
		const viewBox = document.getElementById('svgViewBox').value;

		let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"`;
		if (viewBox) {
			svgContent += ` viewBox="${viewBox}"`;
		}
		svgContent += `>
            <rect width="100%" height="100%" fill="white" stroke="black" stroke-width="1"/>
        </svg>`;

		document.getElementById('canvasWrapper').innerHTML = svgContent;

		// Close the modal
		const modal = bootstrap.Modal.getInstance(document.getElementById('svgPropertiesModal'));
		modal.hide();

		// Display SVG properties
		document.getElementById('propertiesWrapper').innerHTML = `
            <div class="card">
                <div class="card-header">
                    SVG Properties
                </div>
                <div class="card-body">
                    <p><strong>Width:</strong> ${width}</p>
                    <p><strong>Height:</strong> ${height}</p>
                    <p><strong>ViewBox:</strong> ${viewBox || 'N/A'}</p>
                </div>
            </div>
        `;
	};

	document.addEventListener('keydown', function (event) {
		// console.log('keydown');

		if (event.metaKey && event.key === 's') {
			event.preventDefault(); // Prevent the default action
			saveFile(); // Call the save file function
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

		} else if (event.shiftKey && event.metaKey && event.key === 's') {
			event.preventDefault(); // Prevent the default action
			saveAsFile(); // Call the new file function
		}
		else if (event.shiftKey && event.metaKey && event.key === 'e') {
			event.preventDefault(); // Prevent the default action
			exportFile(); // Call the new file function
		}
	});






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

		// Call the function to export and download the PNG
		exportSvgToPng(svgString, width, height);
	}



	function saveFile() {
		// Implement your save file logic here
		console.log('Save file triggered');
	}

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

	const openFileInput = document.getElementById('openFileInput');
	openFileInput.addEventListener('change', function () {
		const file = openFileInput.files[0];
		if (file) {
			// Implement your open file logic here
			console.log('File opened:', file.name);
		}
	});



	// Edit menu items
	document.getElementById('undo').onclick = function () { alert('Undo'); };
	document.getElementById('redo').onclick = function () { alert('Redo'); };
	document.getElementById('cut').onclick = function () { alert('Cut'); };
	document.getElementById('copy').onclick = function () { alert('Copy'); };
	document.getElementById('paste').onclick = function () { alert('Paste'); };

	// View menu items
	document.getElementById('zoomIn').onclick = function () { alert('Zoom In'); };
	document.getElementById('zoomOut').onclick = function () { alert('Zoom Out'); };
	document.getElementById('fitToScreen').onclick = function () { alert('Fit to Screen'); };

	// Layer menu items
	document.getElementById('newLayer').onclick = function () { alert('New Layer'); };
	document.getElementById('deleteLayer').onclick = function () { alert('Delete Layer'); };
	document.getElementById('duplicateLayer').onclick = function () { alert('Duplicate Layer'); };

	// Window menu items
	document.getElementById('minimize').onclick = function () { alert('Minimize'); };
	document.getElementById('maximize').onclick = function () { alert('Maximize'); };
	document.getElementById('closeWindow').onclick = function () { alert('Close Window'); };

	// Help menu items
	document.getElementById('helpTopics').onclick = function () { alert('Help Topics'); };
	document.getElementById('about').onclick = function () { alert('About'); };
}



// Export an object to group the functions
export const Menu = {
	init: initMenu,
};

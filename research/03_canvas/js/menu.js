import { Canvas } from './canvas.js';
import { Export } from './export.js';
import { Globals } from './globals.js';
import { Project } from './project.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

let IS_DEBUG = true;

export function initMenu() {
	if (IS_DEBUG) console.info('menu.js');

	// File menu items
	document.getElementById('newFile').onclick = function () {
		const modal = new bootstrap.Modal(document.getElementById('svgPropertiesModal'));
		modal.show();
	};
	document.getElementById('saveFile').onclick = function () {
		Export.file();
	};

	document.getElementById('saveAsFile').onclick = function () {
		alert('Save As File');
	};

	document.getElementById('exportFile').onclick = function () {
		Export.image();
	};

	document.getElementById('closeFile').onclick = function () {
		alert('Close File');
	};

	// document.getElementById('importFile').onclick = function () { alert('importFile As File'); };
	// Open file input
	document.getElementById('importFile3').addEventListener('change', function (event) {
		console.log('importFile');

		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const svgContent = e.target.result;
				// document.getElementById('svg-container').innerHTML = svgContent;

				// start timeline and properties
				Canvas.setSvg(svgContent);
				Timeline.setSvg(svgContent);
				Properties.setDocument(svgContent);
			};
			reader.readAsText(file);
		}
	});

	// document.getElementById('openFile').onclick = openFileFunc();
	// Open file input
	document.getElementById('openFileInput3').addEventListener('change', function (event) {
		console.log('openFileInput');
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const projectFile = e.target.result;
				// console.log(projectFile);
				Project.file(projectFile);
				// document.getElementById('svg-container').innerHTML = svgContent;

				// // start timeline and properties
				// Canvas.setSvg(svgContent);
				// Timeline.setSvg(svgContent);
				// Properties.setDocument(svgContent);
			};
			reader.readAsText(file);
		}
	});

	// // Create SVG with user-provided properties
	// document.getElementById('createSvgButton').onclick = function () {
	// 	const width = document.getElementById('svgWidth').value;
	// 	const height = document.getElementById('svgHeight').value;
	// 	const viewBox = document.getElementById('svgViewBox').value;

	// 	let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"`;
	// 	if (viewBox) {
	// 		svgContent += ` viewBox="${viewBox}"`;
	// 	}
	// 	svgContent += `>
	//         <rect width="100%" height="100%" fill="white" stroke="black" stroke-width="1"/>
	//     </svg>`;

	// 	document.getElementById('canvasWrapper').innerHTML = svgContent;

	// 	// Close the modal
	// 	const modal = bootstrap.Modal.getInstance(document.getElementById('svgPropertiesModal'));
	// 	modal.hide();

	// 	// Display SVG properties
	// 	document.getElementById('propertiesWrapper').innerHTML = `
	//         <div class="card">
	//             <div class="card-header">
	//                 SVG Properties
	//             </div>
	//             <div class="card-body">
	//                 <p><strong>Width:</strong> ${width}</p>
	//                 <p><strong>Height:</strong> ${height}</p>
	//                 <p><strong>ViewBox:</strong> ${viewBox || 'N/A'}</p>
	//             </div>
	//         </div>
	//     `;
	// };



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

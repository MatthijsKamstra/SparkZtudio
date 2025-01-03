document.addEventListener('DOMContentLoaded', function () {
	// File menu items
	document.getElementById('newFile').onclick = function () {
		const modal = new bootstrap.Modal(document.getElementById('svgPropertiesModal'));
		modal.show();
	};
	document.getElementById('saveFile').onclick = function () { alert('Save File'); };
	document.getElementById('saveAsFile').onclick = function () { alert('Save As File'); };
	document.getElementById('closeFile').onclick = function () { alert('Close File'); };

	// Open file input
	document.getElementById('openFileInput').addEventListener('change', function (event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const svgContent = e.target.result;
				document.getElementById('canvasWrapper').innerHTML = svgContent;

				// Load SVG properties
				const parser = new DOMParser();
				const doc = parser.parseFromString(svgContent, "image/svg+xml");
				const svgElement = doc.querySelector('svg');
				if (svgElement) {
					const width = svgElement.getAttribute('width') || 'N/A';
					const height = svgElement.getAttribute('height') || 'N/A';
					const viewBox = svgElement.getAttribute('viewBox') || 'N/A';

					document.getElementById('propertiesWrapper').innerHTML = `
                        <div class="card">
                            <div class="card-header">
                                SVG Properties
                            </div>
                            <div class="card-body">
                                <p><strong>Width:</strong> ${width}</p>
                                <p><strong>Height:</strong> ${height}</p>
                                <p><strong>ViewBox:</strong> ${viewBox}</p>
                            </div>
                        </div>
                    `;
				}
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

	// Tools buttons
	document.getElementById('selectTool').onclick = function () { alert('Select Tool'); };
	document.getElementById('drawRectTool').onclick = function () { alert('Draw Rectangle'); };
	document.getElementById('drawCircleTool').onclick = function () { alert('Draw Circle'); };
	document.getElementById('drawLineTool').onclick = function () { alert('Draw Line'); };
	document.getElementById('drawTextTool').onclick = function () { alert('Draw Text'); };
	document.getElementById('zoomTool').onclick = function () { alert('Zoom Tool'); };
});

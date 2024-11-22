import { Globals } from './globals.js';
import { Model, ProjectVars } from './model.js';


const IS_DEBUG = false;

// Define your functions
function initProperties() {
	if (IS_DEBUG) console.info('init properties.js');
}

function projectFile() {

	if (IS_DEBUG) {
		console.info('> projectFile');
		console.log(ProjectVars);
	}

	// document.getElementById('propertiesDocument').innerHTML = `

	// 						<ul class="ps-0">
	// 						<li><strong>ProjectName:</strong> ${ProjectVars.projectName}</li>
	// 						<li><strong>ExportName:</strong> ${ProjectVars.exportName}</li>
	// 						<li><strong>creationDate:</strong> ${ProjectVars.creationDate}</li>
	//                             <li><strong>Width:</strong> ${ProjectVars.width}</li>
	//                             <li><strong>Height:</strong> ${ProjectVars.height}</li>
	//                             <li><strong>frameRate:</strong> ${ProjectVars.frameRate}</li>
	//                             <li><strong>frameLength:</strong> ${ProjectVars.frameLength}</li>

	// 						</ul>
	//                 `;

	document.getElementById('propertiesDocument').innerHTML =
		`
	<form id="projectDetailsForm">
		<div class="form-group">
			<label for="projectName"><strong>ProjectName:</strong></label>
			<input type="text" class="form-control" id="projectName" value="${ProjectVars.projectName}">
		</div>
		<div class="form-group">
			<label for="exportName"><strong>ExportName:</strong></label>
			<input type="text" class="form-control" id="exportName" value="${ProjectVars.exportName}">
		</div>
		<div class="form-group">
			<label for="creationDate"><strong>creationDate:</strong></label>
			<input type="text" class="form-control" id="creationDate" value="${ProjectVars.creationDate}">
		</div>
		<div class="form-group">
			<label for="width"><strong>Width:</strong></label>
			<input type="number" class="form-control" id="width" value="${ProjectVars.width}">
		</div>
		<div class="form-group">
			<label for="height"><strong>Height:</strong></label>
			<input type="number" class="form-control" id="height" value="${ProjectVars.height}">
		</div>
		<div class="form-group">
			<label for="frameRate"><strong>frameRate:</strong></label>
			<input type="number" class="form-control" id="frameRate" value="${ProjectVars.frameRate}">
		</div>
		<div class="form-group">
			<label for="frameLength"><strong>frameLength:</strong></label>
			<input type="number" class="form-control" id="frameLength" value="${ProjectVars.frameLength}">
		</div>
		<button type="submit" class="btn btn-primary">Save</button>
	</form>
	`;


	const form = document.getElementById('projectDetailsForm');

	form.addEventListener('submit', function (event) {
		event.preventDefault(); // Prevent the form from submitting the traditional way

		// Update ProjectVars with values from the form
		ProjectVars.projectName = document.getElementById('projectName').value;
		ProjectVars.exportName = document.getElementById('exportName').value;
		ProjectVars.creationDate = document.getElementById('creationDate').value;
		ProjectVars.width = parseInt(document.getElementById('width').value, 10);
		ProjectVars.height = parseInt(document.getElementById('height').value, 10);
		ProjectVars.frameRate = parseInt(document.getElementById('frameRate').value, 10);
		ProjectVars.frameLength = parseInt(document.getElementById('frameLength').value, 10);

		// Perform any additional actions such as saving the data or updating the UI
		console.log('ProjectVars updated:', ProjectVars);

		// Optionally, display a success message or redirect the user
		// alert('Project details saved successfully!');

		Model.update();
	});



}

function setSvg(svgElement) {

	if (IS_DEBUG) {
		console.info('setPropertyDocument');
		console.log(svgElement);
	}

	if (typeof svgElement === 'string') {
		if (IS_DEBUG) console.log('The svgElement is a string.'); // Further processing of the string data can go here
	} else {
		if (IS_DEBUG) console.log('The svgElement is not a string.'); // Handle other data types accordingly
		const serializer = new XMLSerializer();
		svgElement = serializer.serializeToString(svgElement);
		if (IS_DEBUG) console.log(svgElement);
	}

	// Load SVG properties
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgElement, "image/svg+xml");
	const svgEl = svgDoc.querySelector('svg');
	if (svgEl) {
		const width = svgEl.getAttribute('width') || 'N/A';
		const height = svgEl.getAttribute('height') || 'N/A';
		const viewBox = svgEl.getAttribute('viewBox') || 'N/A';

		document.getElementById('propertiesDocument').innerHTML = `
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
}

function update() {
	console.log('update');
}

// Export an object to group the functions
export const Properties = {
	init: initProperties,
	setSvg,
	projectFile,
	update,
};

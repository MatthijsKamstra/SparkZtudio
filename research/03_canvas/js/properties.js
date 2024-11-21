import { Globals } from './globals.js';
import { Project, ProjectVars } from './project.js';


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

	document.getElementById('propertiesDocument').innerHTML = `

							<ul class="ps-0">
							<li><strong>ProjectName:</strong> ${ProjectVars.projectName}</li>
							<li><strong>ExportName:</strong> ${ProjectVars.exportName}</li>
							<li><strong>creationDate:</strong> ${ProjectVars.creationDate}</li>
                                <li><strong>Width:</strong> ${ProjectVars.width}</li>
                                <li><strong>Height:</strong> ${ProjectVars.height}</li>
                                <li><strong>frameRate:</strong> ${ProjectVars.frameRate}</li>
                                <li><strong>frameLength:</strong> ${ProjectVars.frameLength}</li>

							</ul>
                    `;
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

// Export an object to group the functions
export const Properties = {
	init: initProperties,
	setSvg,
	projectFile,
};

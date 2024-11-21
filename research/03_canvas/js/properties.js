import { Globals } from './globals.js';

const IS_DEBUG = true;

// Define your functions
function initProperties() {
	if (IS_DEBUG) console.info('init properties.js');
}

function setPropertyDocument(data) {
	if (IS_DEBUG) console.info('setPropertyDocument');
	if (IS_DEBUG) console.info(data);

	if (typeof data === 'string') {
		if (IS_DEBUG) console.log('The data is a string.'); // Further processing of the string data can go here
	} else {
		if (IS_DEBUG) console.log('The data is not a string.'); // Handle other data types accordingly
		const serializer = new XMLSerializer();
		data = serializer.serializeToString(data);
		if (IS_DEBUG) console.log(data);
	}

	// Load SVG properties
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(data, "image/svg+xml");
	const svgElement = svgDoc.querySelector('svg');
	if (svgElement) {
		const width = svgElement.getAttribute('width') || 'N/A';
		const height = svgElement.getAttribute('height') || 'N/A';
		const viewBox = svgElement.getAttribute('viewBox') || 'N/A';

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
	setDocument: setPropertyDocument,
};

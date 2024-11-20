import { Globals } from './globals.js';

// Define your functions
function initProperties() {
	console.info('properties.js');
}

function setPropertyDocument(data) {
	console.info('setPropertyDocument');
	console.info(data);
}

// Export an object to group the functions
export const Properties = {
	init: initProperties,
	setDocument: setPropertyDocument,
};

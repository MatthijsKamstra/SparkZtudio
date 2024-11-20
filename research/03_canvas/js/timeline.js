import { Globals } from './globals.js';

const IS_DEBUG = false;

// Function to generate a random ID
function generateId() {
	return 'id-' + Math.random().toString(36).substr(2, 9);
}

function initTimeline() {
	console.info('timeline.js');
}

function createLayerItem(id) {
	const layerItem = document.createElement('div');
	layerItem.className = 'list-group-item layer-item';
	layerItem.dataset.layerId = id;

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.className = 'form-check-input';

	const layerName = document.createElement('span');
	layerName.textContent = id;
	layerName.className = 'ml-2';

	const visibleButton = document.createElement('button');
	visibleButton.className = 'btn btn-secondary btn-sm';
	visibleButton.textContent = 'Visible';
	visibleButton.addEventListener('click', () => {
		const layer = document.getElementById(id);
		layer.style.display = layer.style.display === 'none' ? 'block' : 'none';
		visibleButton.textContent = layer.style.display === 'none' ? 'Show' : 'Visible';
	});

	const lockButton = document.createElement('button');
	lockButton.className = 'btn btn-secondary btn-sm';
	lockButton.textContent = 'Lock';
	lockButton.addEventListener('click', () => {
		const layer = document.getElementById(id);
		const isLocked = layer.getAttribute('pointer-events') === 'none';
		layer.setAttribute('pointer-events', isLocked ? 'all' : 'none');
		lockButton.textContent = isLocked ? 'Lock' : 'Unlock';
	});

	const deleteButton = document.createElement('button');
	deleteButton.className = 'btn btn-danger btn-sm';
	deleteButton.textContent = 'Delete';
	deleteButton.addEventListener('click', () => {
		const layer = document.getElementById(id);
		layer.remove();
		layerItem.remove();
	});

	const moveUpButton = document.createElement('button');
	moveUpButton.className = 'btn btn-primary btn-sm';
	moveUpButton.textContent = 'Up';
	moveUpButton.addEventListener('click', () => {
		const layer = document.getElementById(id);
		const previousLayer = layer.previousElementSibling;
		if (previousLayer) {
			layer.parentNode.insertBefore(layer, previousLayer);
			layerItem.parentNode.insertBefore(layerItem, layerItem.previousElementSibling);
		}
	});

	const moveDownButton = document.createElement('button');
	moveDownButton.className = 'btn btn-primary btn-sm';
	moveDownButton.textContent = 'Down';
	moveDownButton.addEventListener('click', () => {
		const layer = document.getElementById(id);
		const nextLayer = layer.nextElementSibling;
		if (nextLayer) {
			layer.parentNode.insertBefore(nextLayer, layer);
			layerItem.parentNode.insertBefore(layerItem.nextElementSibling, layerItem);
		}
	});

	layerItem.appendChild(checkbox);
	layerItem.appendChild(layerName);
	layerItem.appendChild(visibleButton);
	layerItem.appendChild(lockButton);
	layerItem.appendChild(moveUpButton);
	layerItem.appendChild(moveDownButton);
	layerItem.appendChild(deleteButton);

	return layerItem;
}


function setSvg(data) {
	if (IS_DEBUG) console.info('> setSvg');
	if (IS_DEBUG) console.info(data);

	// Check if data is a string
	if (typeof data !== 'string') {
		if (IS_DEBUG) console.log('The data is not a string.');
		const serializer = new XMLSerializer();
		data = serializer.serializeToString(data);
		if (IS_DEBUG) console.log(data);
	}

	// Parse the string to create a document fragment
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(data, 'image/svg+xml');

	// Extract all elements from the parsed SVG
	const elements = svgDoc.querySelectorAll('*');
	const elementIds = [];

	elements.forEach(element => {
		// console.log(element.nodeName);
		if (!element.id && element.nodeName !== 'svg') {
			element.setAttribute('id', generateId());
		}
		if (element.nodeName !== 'svg') elementIds.push(element.id);
	});

	// Display the shuffled array of IDs as layers in the panel
	const layerList = document.getElementById('timelineWrapper');
	layerList.innerHTML = ''; // clear content
	elementIds.forEach(id => {
		const layerItem = createLayerItem(id);
		layerList.appendChild(layerItem);
	});

	// Serialize the modified SVG back to a string
	const serializer = new XMLSerializer();
	const updatedSvgString = serializer.serializeToString(svgDoc);

	// Assume svgContainer is defined elsewhere in your script
	const svgContainer = document.getElementById('svg-container');
	if (!svgContainer) {
		console.error('SVG container not found');
		return;
	}

	// Clear existing content and set the updated SVG string
	svgContainer.innerHTML = updatedSvgString;

	if (IS_DEBUG) console.log('Updated SVG:', updatedSvgString);
}

// Export an object to group the functions
export const Timeline = {
	init: initTimeline,
	setSvg,
};

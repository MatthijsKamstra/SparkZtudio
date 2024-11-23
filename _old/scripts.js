let zoomScale = 1;
const svgNS = "http://www.w3.org/2000/svg";

// Function to generate a random ID
function generateId() {
	return 'id-' + Math.random().toString(36).substr(2, 9);
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

function addNewLayer() {
	const svgElement = document.getElementById('svgContainer').querySelector('svg');
	const newLayer = document.createElementNS(svgNS, 'rect');
	const newId = generateId();
	newLayer.setAttribute('id', newId);
	newLayer.setAttribute('x', Math.random() * 300);
	newLayer.setAttribute('y', Math.random() * 100);
	newLayer.setAttribute('width', 50);
	newLayer.setAttribute('height', 50);
	newLayer.setAttribute('fill', 'green');
	svgElement.appendChild(newLayer);

	const layerList = document.getElementById('layerList');
	const layerItem = createLayerItem(newId);
	layerList.appendChild(layerItem);
}

document.getElementById('addLayer').addEventListener('click', addNewLayer);


// Fetch the SVG content from an external file
fetch('example.svg')
	.then(response => response.text())
	.then(svgContent => {
		// Insert the SVG content into the container
		const svgContainer = document.querySelector('.svg-container');
		svgContainer.innerHTML = svgContent;

		// Extract the SVG element
		const svgElement = svgContainer.querySelector('svg');
		const elements = svgElement.querySelectorAll('*');
		const elementIds = [];

		// Loop through each element to assign IDs if not present and collect them
		elements.forEach(element => {
			if (!element.id) {
				element.id = generateId();
			}
			elementIds.push(element.id);
		});

		const shuffledIds = elementIds;

		// Reorder SVG elements based on the shuffled array
		shuffledIds.forEach(id => {
			const element = document.getElementById(id);
			svgElement.appendChild(element); // Re-append the element to reorder it
		});

		// Display the shuffled array of IDs as layers in the panel
		const layerList = document.getElementById('layerList');
		shuffledIds.forEach(id => {
			const layerItem = createLayerItem(id);
			layerList.appendChild(layerItem);
		});

		// Get the SVG size and adjust the container
		// Check if viewBox is valid before accessing it
		if (!svgElement.viewBox.baseVal) {
			svgElement.setAttribute('viewBox', `0 0 ${svgElement.getBBox().width} ${svgElement.getBBox().height}`);
		}

		const svgWidth = svgElement.viewBox.baseVal.width;
		const svgHeight = svgElement.viewBox.baseVal.height;
		svgContainer.style.width = `${svgWidth}px`;
		svgContainer.style.height = `${svgHeight}px`;

		// Center the SVG within the canvas
		svgContainer.style.margin = "auto";

		// Add zoom functionality
		document.getElementById('zoomIn').addEventListener('click', function () {
			zoomScale += 0.1;
			svgElement.style.transform = `scale(${zoomScale})`;
		});

		document.getElementById('zoomOut').addEventListener('click', function () {
			if (zoomScale > 0.1) {
				zoomScale -= 0.1;
				svgElement.style.transform = `scale(${zoomScale})`;
			}
		});

		document.getElementById('zoomTo100').addEventListener('click', function () {
			zoomScale = 1;
			svgElement.style.transform = `scale(${zoomScale})`;
		});

		document.getElementById('zoomToFit').addEventListener('click', function () {
			const canvasWidth = document.querySelector('.canvas-panel').clientWidth;
			const canvasHeight = document.querySelector('.canvas-panel').clientHeight;
			const scale = Math.min(canvasWidth / svgWidth, canvasHeight / svgHeight);
			zoomScale = scale;
			svgElement.style.transform = `scale(${zoomScale})`;
		});
	})
	.catch(error => console.error('Error loading SVG:', error));

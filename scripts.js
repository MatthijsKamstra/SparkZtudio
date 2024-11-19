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

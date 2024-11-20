import { Globals } from './globals.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

export function init() {
	console.info('canvas.js');
	// let Globals.zoomScale = 1;

	initSvg();

	// Add zoom functionality
	document.getElementById('zoomIn').addEventListener('click', () => {
		Globals.zoomScale += 0.1;
		svgElement.style.transform = `scale(${Globals.zoomScale})`;
	});

	document.getElementById('zoomOut').addEventListener('click', () => {
		if (Globals.zoomScale > 0.1) {
			Globals.zoomScale -= 0.1;
			svgElement.style.transform = `scale(${Globals.zoomScale})`;
		}
	});

	document.getElementById('zoomTo100').addEventListener('click', () => {
		Globals.zoomScale = 1;
		svgElement.style.transform = `scale(${Globals.zoomScale})`;
	});

	document.getElementById('zoomToFit').addEventListener('click', () => {
		const svgRect = svgElement.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();
		const scale = Math.min(containerRect.width / svgRect.width, containerRect.height / svgRect.height);
		Globals.zoomScale = scale;
		svgElement.style.transform = `scale(${Globals.zoomScale})`;
	});

	// document.getElementById('zoomToFit').addEventListener('click', function () {
	// 	const canvasWidth = document.querySelector('.canvas-panel').clientWidth;
	// 	const canvasHeight = document.querySelector('.canvas-panel').clientHeight;
	// 	const scale = Math.min(canvasWidth / svgWidth, canvasHeight / svgHeight);
	// 	zoomScale = scale;
	// 	svgElement.style.transform = `scale(${zoomScale})`;
	// });
}

function initSvg() {
	const svgContainer = document.getElementById('svg-container');

	// Create SVG element
	const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	svgElement.setAttribute('width', `${Globals.defaultSvgWidth}`);
	svgElement.setAttribute('height', `${Globals.defaultSvgHeight}`);
	svgElement.setAttribute('viewBox', `0 0 ${Globals.defaultSvgWidth} ${Globals.defaultSvgHeight}`);

	// Create a rectangle element with transparent color
	const rectElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rectElement.setAttribute('id', 'Background Layer');
	rectElement.setAttribute('x', '0');
	rectElement.setAttribute('y', '0');
	rectElement.setAttribute('width', `${Globals.defaultSvgWidth}`);
	rectElement.setAttribute('height', `${Globals.defaultSvgHeight}`);
	rectElement.setAttribute('fill', 'rgba(0,0,0,0)'); // Adjust the transparency as needed

	// Append rectangle to SVG
	svgElement.appendChild(rectElement);

	// Create a text element
	const textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	textElement.setAttribute('id', 'Text Layer');
	textElement.setAttribute('x', '50%');
	textElement.setAttribute('y', '50%');
	textElement.setAttribute('dominant-baseline', 'middle');
	textElement.setAttribute('text-anchor', 'middle');
	textElement.setAttribute('fill', 'pink'); // Set the text color to pink
	textElement.setAttribute('font-size', '100'); // Set the font size to 100
	textElement.textContent = 'SparkStudio'; // Set the text content

	// Append text element to SVG
	svgElement.appendChild(textElement);

	// Append SVG to container
	svgContainer.appendChild(svgElement);

	// start timeline and properties
	Timeline.setSvg(svgElement);
	Properties.setDocument(svgElement);

}


// Export an object to group the functions
export const Canvas = {
	init,
	initSvg,
};


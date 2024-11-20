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
	const svgContainer = document.getElementById(Globals.svgContainerID);

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
	textElement.setAttribute('font-family', 'Arial');
	textElement.textContent = 'SparkStudio'; // Set the text content

	// <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="black" id="id-osgfjmigo">
	// 	Hello, SVG World!
	// </text>

	// Append text element to SVG
	svgElement.appendChild(textElement);

	// Append SVG to container
	svgContainer.appendChild(svgElement);

	// start timeline and properties
	// Canvas.setSvg(svgElement);
	Timeline.setSvg(svgElement);
	Properties.setDocument(svgElement);

}

function setSvg(svgContent) {
	const svgContainer = document.getElementById(Globals.svgContainerID);
	svgContainer.innerHTML = svgContent;

	Timeline.setSvg(svgContent);
	Properties.setDocument(svgContent);
}

function initGrab() {
	const svgElement = document.querySelector('svg');
	let selectedElement = null;
	let offset = { x: 0, y: 0 };

	svgElement.addEventListener('mouseover', (event) => {
		if (event.target.nodeName !== 'svg') {
			event.target.style.cursor = 'grab';
		}
	});

	svgElement.addEventListener('mousedown', (event) => {
		if (event.target.nodeName !== 'svg') {
			selectedElement = event.target;
			const bbox = selectedElement.getBBox();
			offset.x = event.clientX - bbox.x;
			offset.y = event.clientY - bbox.y;
			selectedElement.style.cursor = 'grabbing';
		}
	});

	svgElement.addEventListener('mousemove', (event) => {
		if (selectedElement) {
			const x = event.clientX - offset.x;
			const y = event.clientY - offset.y;
			selectedElement.setAttribute('x', x);
			selectedElement.setAttribute('y', y);

			if (selectedElement.tagName === 'circle') {
				selectedElement.setAttribute('cx', x + selectedElement.getAttribute('r'));
				selectedElement.setAttribute('cy', y + selectedElement.getAttribute('r'));
			}

			if (selectedElement.tagName === 'text') {
				selectedElement.setAttribute('x', event.clientX);
				selectedElement.setAttribute('y', event.clientY);
			}
		}
	});

	svgElement.addEventListener('mouseup', () => {
		if (selectedElement) {
			selectedElement.style.cursor = 'grab';
			selectedElement = null;
		}
	});

	svgElement.addEventListener('mouseleave', () => {
		if (selectedElement) {
			selectedElement.style.cursor = 'grab';
			selectedElement = null;
		}
	});
};



// Export an object to group the functions
export const Canvas = {
	init,
	initSvg,
	setSvg,
};


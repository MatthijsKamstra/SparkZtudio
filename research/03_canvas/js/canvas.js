import { Globals } from './globals.js';
import { Model, ProjectVars } from './model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

let IS_DEBUG = false;

function init() {
	if (IS_DEBUG) console.info('init canvas.js');
	defaultSVG();
	setup();
}

/**
 * setup UI
 */
function setup() {
	if (IS_DEBUG) console.info('Canvas.setup');

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
}

function defaultSVG() {
	if (IS_DEBUG) console.info('defaultSVG');

	// Create SVG element
	const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	svgElement.setAttribute('width', `${Globals.defaultSvgWidth}`);
	svgElement.setAttribute('height', `${Globals.defaultSvgHeight}`);
	svgElement.setAttribute('viewBox', `0 0 ${Globals.defaultSvgWidth} ${Globals.defaultSvgHeight}`);

	// Create a rectangle element with transparent color
	const rectElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rectElement.setAttribute('id', 'Background Layer');
	rectElement.setAttribute('x', '20');
	rectElement.setAttribute('y', '20');
	rectElement.setAttribute('width', `${Globals.defaultSvgWidth - 40}`);
	rectElement.setAttribute('height', `${Globals.defaultSvgHeight - 40}`);
	rectElement.setAttribute('fill', 'rgba(255,128,255,0.5)'); // Adjust the transparency as needed

	// Append rectangle to SVG
	svgElement.appendChild(rectElement);

	// Create a text element
	const textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	textElement.setAttribute('id', 'Text Layer');
	textElement.setAttribute('x', '50%');
	textElement.setAttribute('y', '50%');
	textElement.setAttribute('dominant-baseline', 'middle');
	textElement.setAttribute('text-anchor', 'middle');
	textElement.setAttribute('fill', '#800080'); // Set the text color to pink
	textElement.setAttribute('font-size', '80'); // Set the font size to 100
	textElement.setAttribute('font-family', 'Kenia, sans-serif');
	// textElement.setAttribute('font-family', 'Kenia');
	textElement.setAttribute('font-weight', '400');
	textElement.setAttribute('font-style', 'normal');
	textElement.textContent = 'SparkZtudio'; // Set the text content

	// Append text element to SVG
	svgElement.appendChild(textElement);

	// send svg to Model
	Model.setSvgElement(svgElement);
}

function setSvg(svgElement) {
	if (IS_DEBUG) console.info('setSvg');

	const svgContainer = document.getElementById(Globals.svgContainerID);
	svgContainer.innerHTML = svgElement;

	// Introduce a short delay before initializing drag functionality
	setTimeout(() => initGrab(svgContainer.querySelector('svg')), 100);
}

function initGrab(svgElement) {
	if (IS_DEBUG) console.info('initGrab');

	let selectedElement = null;
	let offset = { x: 0, y: 0 };

	function removeEventListeners() {
		if (IS_DEBUG) console.info('removeEventListeners');

		svgElement.removeEventListener('mouseover', handleMouseOver);
		svgElement.removeEventListener('mousedown', handleMouseDown);
		svgElement.removeEventListener('mousemove', handleMouseMove);
		svgElement.removeEventListener('mouseup', handleMouseUp);
		svgElement.removeEventListener('mouseleave', handleMouseLeave);
	}

	function handleMouseOver(event) {
		if (IS_DEBUG) console.info('handleMouseOver');
		if (event.target.nodeName !== 'svg') {
			event.target.style.cursor = 'grab';
		}
	}

	function handleMouseDown(event) {
		if (IS_DEBUG) console.info('handleMouseDown');
		if (event.target.nodeName !== 'svg') {
			selectedElement = event.target;
			const bbox = selectedElement.getBBox();
			offset.x = event.clientX - bbox.x;
			offset.y = event.clientY - bbox.y;
			selectedElement.style.cursor = 'grabbing';
		}
	}

	function handleMouseMove(event) {
		if (IS_DEBUG) console.info('handleMouseMove');
		if (selectedElement) {
			const x = event.clientX - offset.x;
			const y = event.clientY - offset.y;

			if (selectedElement.tagName === 'circle') {
				selectedElement.setAttribute('cx', x + parseFloat(selectedElement.getAttribute('r')));
				selectedElement.setAttribute('cy', y + parseFloat(selectedElement.getAttribute('r')));
			} else if (selectedElement.tagName === 'text') {
				const bbox = selectedElement.getBBox();
				selectedElement.setAttribute('x', x + bbox.width / 2);
				selectedElement.setAttribute('y', y + bbox.height / 2);
			} else {
				selectedElement.setAttribute('x', x);
				selectedElement.setAttribute('y', y);
			}
		}
	}

	function handleMouseUp() {
		if (IS_DEBUG) console.info('handleMouseUp');
		if (selectedElement) {
			selectedElement.style.cursor = 'grab';
			selectedElement = null;
		}
	}

	function handleMouseLeave() {
		if (IS_DEBUG) console.info('handleMouseLeave');
		if (selectedElement) {
			selectedElement.style.cursor = 'grab';
			selectedElement = null;
		}
	}

	// Remove existing listeners
	removeEventListeners();

	// Add new listeners
	svgElement.addEventListener('mouseover', handleMouseOver);
	svgElement.addEventListener('mousedown', handleMouseDown);
	svgElement.addEventListener('mousemove', handleMouseMove);
	svgElement.addEventListener('mouseup', handleMouseUp);
	svgElement.addEventListener('mouseleave', handleMouseLeave);
}

function update() {
	console.log('update');
}


// Export an object to group the functions
export const Canvas = {
	init,
	// svgElement,
	setSvg,
	update,
};

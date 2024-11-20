import { Globals } from './globals.js';


const svgNS = "http://www.w3.org/2000/svg";
let zoomScale = 1;

const svgWidth = 600;
const svgHeight = 400;

export function initCanvas() {

	console.info('canvas.js');


	const svgContainer = document.getElementById('svg-container');

	// Create SVG element
	const svgElement = document.createElementNS(svgNS, 'svg');
	svgElement.setAttribute('width', `${svgWidth}`);
	svgElement.setAttribute('height', `${svgHeight}`);
	svgElement.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
	// svgElement.style.border = '2px solid black';
	// svgElement.style.background = 'white';
	// svgElement.style.display = 'block';
	// svgElement.style.margin = 'auto';

	// Create a rectangle element with transparent color
	const rectElement = document.createElementNS(svgNS, 'rect');
	rectElement.setAttribute('id', 'Background Layer');
	rectElement.setAttribute('x', '0');
	rectElement.setAttribute('y', '0');
	rectElement.setAttribute('width', `${svgWidth}`);
	rectElement.setAttribute('height', `${svgHeight}`);
	rectElement.setAttribute('fill', 'rgba(0,0,0,0)'); // Adjust the transparency as needed

	// Append rectangle to SVG
	svgElement.appendChild(rectElement);

	// Append SVG to container
	svgContainer.appendChild(svgElement);

	// Add zoom functionality
	document.getElementById('zoomIn').addEventListener('click', () => {
		zoomScale += 0.1;
		svgElement.style.transform = `scale(${zoomScale})`;
	});

	document.getElementById('zoomOut').addEventListener('click', () => {
		if (zoomScale > 0.1) {
			zoomScale -= 0.1;
			svgElement.style.transform = `scale(${zoomScale})`;
		}
	});

	document.getElementById('zoomTo100').addEventListener('click', () => {
		zoomScale = 1;
		svgElement.style.transform = `scale(${zoomScale})`;
	});

	document.getElementById('zoomToFit').addEventListener('click', () => {
		const svgRect = svgElement.getBoundingClientRect();
		const containerRect = svgContainer.getBoundingClientRect();
		const scale = Math.min(containerRect.width / svgRect.width, containerRect.height / svgRect.height);
		zoomScale = scale;
		svgElement.style.transform = `scale(${zoomScale})`;
	});

	// document.getElementById('zoomToFit').addEventListener('click', function () {
	// 	const canvasWidth = document.querySelector('.canvas-panel').clientWidth;
	// 	const canvasHeight = document.querySelector('.canvas-panel').clientHeight;
	// 	const scale = Math.min(canvasWidth / svgWidth, canvasHeight / svgHeight);
	// 	zoomScale = scale;
	// 	svgElement.style.transform = `scale(${zoomScale})`;
	// });
}



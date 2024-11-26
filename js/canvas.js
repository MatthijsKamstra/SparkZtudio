import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

export class Canvas {

	IS_DEBUG = false;

	svgElement = null;
	selectedElement = null;
	offset = { x: 0, y: 0 };

	constructor() {
		if (this.IS_DEBUG) console.info('constructor Canvas');
	}

	init() {
		if (this.IS_DEBUG) console.info('new Canvas().init()');
		this.defaultSVG();
	}

	update() {
		if (this.IS_DEBUG) console.info('Canvas.update');
	}

	setup() {
		if (this.IS_DEBUG) console.info('Canvas.setup');
	}

	projectFile() {
		if (this.IS_DEBUG) console.info('Canvas.projectFile');
		const svgElement = ProjectVars.frames[0].svg;
		this.setSvg(svgElement);
	}

	defaultSVG() {
		if (this.IS_DEBUG) console.info('defaultSVG');

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

		this.svgElement = svgElement;

		// send svg to Model
		new Model().setProjectViaSvgElement(svgElement);
	}

	setSvg(svgElement) {
		if (this.IS_DEBUG) console.info('setSvg');

		const svgContainer = document.getElementById(Globals.svgContainerID);
		svgContainer.innerHTML = svgElement;

		this.svgElement = svgElement;

		// Introduce a short delay before initializing drag ality
		setTimeout(() => this.initGrab(svgContainer.querySelector('svg')), 100);
	}


	removeEventListeners() {
		if (this.IS_DEBUG) console.info('Canvas.removeEventListeners');

		this.svgElement.removeEventListener('mouseover', (e) => { this.handleMouseOver(e) });
		this.svgElement.removeEventListener('mousedown', (e) => { this.handleMouseDown(e) });
		this.svgElement.removeEventListener('mousemove', (e) => { this.handleMouseMove(e) });
		this.svgElement.removeEventListener('mouseup', (e) => { this.handleMouseUp(e) });
		this.svgElement.removeEventListener('mouseleave', (e) => { this.handleMouseLeave(e) });
	}

	handleMouseOver(event) {
		if (this.IS_DEBUG) console.info('Canvas.handleMouseOver');
		if (event.target.nodeName !== 'svg') {
			event.target.style.cursor = 'grab';
		}
	}

	handleMouseDown(event) {
		if (this.IS_DEBUG) console.info('Canvas.handleMouseDown');
		if (event.target.nodeName !== 'svg') {
			this.selectedElement = event.target;
			const bbox = this.selectedElement.getBBox();
			this.offset.x = event.clientX - bbox.x;
			this.offset.y = event.clientY - bbox.y;
			this.selectedElement.style.cursor = 'grabbing';
		}
	}

	handleMouseMove(event) {
		if (this.IS_DEBUG) console.info('Canvas.handleMouseMove');
		if (this.selectedElement) {
			const x = event.clientX - this.offset.x;
			const y = event.clientY - this.offset.y;

			if (this.selectedElement.tagName === 'circle') {
				this.selectedElement.setAttribute('cx', x + parseFloat(this.selectedElement.getAttribute('r')));
				this.selectedElement.setAttribute('cy', y + parseFloat(this.selectedElement.getAttribute('r')));
			} else if (this.selectedElement.tagName === 'text') {
				const bbox = this.selectedElement.getBBox();
				this.selectedElement.setAttribute('x', x + bbox.width / 2);
				this.selectedElement.setAttribute('y', y + bbox.height / 2);
			} else {
				this.selectedElement.setAttribute('x', x);
				this.selectedElement.setAttribute('y', y);
			}
		}
	}

	handleMouseUp() {
		if (this.IS_DEBUG) console.info('Canvas.handleMouseUp');
		if (this.selectedElement) {
			this.selectedElement.style.cursor = 'grab';
			this.selectedElement = null;
		}
	}

	handleMouseLeave() {
		if (this.IS_DEBUG) console.info('Canvas.handleMouseLeave');
		if (this.selectedElement) {
			this.selectedElement.style.cursor = 'grab';
			this.selectedElement = null;
		}
	}


	initGrab(svgElement) {
		if (this.IS_DEBUG) console.info('Canvas.initGrab');

		this.svgElement = svgElement;

		// Remove existing listeners
		this.removeEventListeners();

		// Add new listeners
		svgElement.addEventListener('mouseover', (e) => { this.handleMouseOver(e) });
		svgElement.addEventListener('mousedown', (e) => { this.handleMouseDown(e) });
		svgElement.addEventListener('mousemove', (e) => { this.handleMouseMove(e) });
		svgElement.addEventListener('mouseup', (e) => { this.handleMouseUp(e) });
		svgElement.addEventListener('mouseleave', (e) => { this.handleMouseLeave(e) });
	}

}

import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

let IS_DEBUG = false;

let svgElement;
let canvasWrapper;

function init() {
	if (IS_DEBUG) console.info('init canvas-menu.js');
	svgElement = document.getElementById(Globals.svgContainerID);
	canvasWrapper = document.getElementById('canvasWrapper');
	setup();
}

/**
 * setup UI
 */
function setup() {
	if (IS_DEBUG) console.info('CanvasMenu.setup');

	// Add zoom functionality
	document.getElementById('canvas-menu-zoomIn').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click btn zoomIn');
		zoomIn();
	});

	document.getElementById('canvas-menu-zoomOut').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click btn zoomOut');
		zoomOut();
	});

	document.getElementById('canvas-menu-zoomTo100').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click btn zoomTo100');
		zoomTo100();
	});

	document.getElementById('canvas-menu-zoomToFit').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click btn zoomToFit');
		zoomToFit();
	});
}

function update() {
	if (IS_DEBUG) console.info('CanvasMenu.update');
}

function projectFile() {
	if (IS_DEBUG) console.info('CanvasMenu.projectFile');
	const svgElement = ProjectVars.frames[0].svg;
}

function zoomIn() {
	if (IS_DEBUG) console.info('zoomIn');
	Globals.zoomScale += 0.1;
	svgElement.style.transform = `scale(${Globals.zoomScale})`;
}

function zoomOut() {
	if (IS_DEBUG) console.info('zoomOut');
	if (Globals.zoomScale > 0.1) {
		Globals.zoomScale -= 0.1;
		svgElement.style.transform = `scale(${Globals.zoomScale})`;
	}
}

function zoomTo100() {
	if (IS_DEBUG) console.info('zoomTo100');
	Globals.zoomScale = 1;
	svgElement.style.transform = `scale(${Globals.zoomScale})`;
}

function zoomToFit() {
	if (IS_DEBUG) console.info('zoomToFit');
	const containerRect = canvasWrapper.getBoundingClientRect();
	const svgRect = svgElement.getBoundingClientRect();
	const scale = Math.min(containerRect.width / svgRect.width, containerRect.height / svgRect.height);
	Globals.zoomScale = scale;
	svgElement.style.transform = `scale(${Globals.zoomScale})`;
}

// Export an object to group the functions
export const CanvasMenu = {
	init,
	setup,
	update,
	projectFile,
};

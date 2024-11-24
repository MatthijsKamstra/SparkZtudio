import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

let IS_DEBUG = true;

let svgElement;
let canvasWrapper;
let isPlaying = false;
let isLooping = false

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

	// Add keyframe functionality
	document.getElementById('prevKeyframe').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click prevKeyframe');
		prevKeyframe();
	});

	document.getElementById('togglePlayStop').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click togglePlayStop');
		togglePlayStop();
	});

	document.getElementById('nextKeyframe').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click nextKeyframe');
		nextKeyframe();
	});


	// Add loop functionality
	document.getElementById('toggleLoop').addEventListener('click', () => {
		if (IS_DEBUG) console.log('click toggleLoop');
		toggleLoop();
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

function togglePlayStop() {
	if (isPlaying) {
		new Model().play();
	} else {
		new Model().stop();
	}
	isPlaying = !isPlaying;
	const toggleButton = document.getElementById('togglePlayStop');
	toggleButton.innerHTML = isPlaying ? '<i class="fa fa-stop"></i>' : '<i class="fa fa-play"></i>';
	// Logic to toggle play/stop
}

// Loop functionality
function toggleLoop() {
	if (isLooping) {
		new Model().loop(true);
	} else {
		new Model().loop(false);
	}
	isLooping = !isLooping;
	const loopButton = document.getElementById('toggleLoop');
	loopButton.classList.toggle('active', isLooping); // Logic to toggle looping
}

// Keyframe navigation functions
function prevKeyframe() {
	// Logic to move to the previous keyframe
	new Model().previousKeyframe();
}

function nextKeyframe() {
	// Logic to move to the next keyframe
	new Model().nextKeyframe();
}

// Export an object to group the functions
export const CanvasMenu = {
	init,
	setup,
	update,
	projectFile,
};

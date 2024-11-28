import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

export class CanvasMenu {

	IS_DEBUG = false;

	svgElement;
	canvasWrapper;
	isPlaying = false;
	isLooping = false

	constructor() {
		if (this.IS_DEBUG) console.info('constructor canvas-menu.js');
	}

	init() {
		if (this.IS_DEBUG) console.info('CanvasMenu.init()');
		this.svgElement = document.getElementById(Globals.svgContainerID);
		this.canvasWrapper = document.getElementById('canvasWrapper');
		this.setup();
	}

	/**
	 * setup UI
	 */
	setup() {
		if (this.IS_DEBUG) console.info('CanvasMenu.setup');

		// Add zoom lity
		document.getElementById('canvas-menu-zoomIn').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click btn zoomIn');
			this.zoomIn();
		});

		document.getElementById('canvas-menu-zoomOut').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click btn zoomOut');
			this.zoomOut();
		});

		document.getElementById('canvas-menu-zoomTo100').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click btn zoomTo100');
			this.zoomTo100();
		});

		document.getElementById('canvas-menu-zoomToFit').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click btn zoomToFit');
			this.zoomToFit();
		});

		// Add keyframe lity
		document.getElementById('prevKeyframe').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click prevKeyframe');
			this.prevKeyframe();
		});

		document.getElementById('togglePlayStop').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click togglePlayStop');
			this.togglePlayStop();
		});

		document.getElementById('nextKeyframe').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click nextKeyframe');
			this.nextKeyframe();
		});


		// Add loop lity
		document.getElementById('toggleLoop').addEventListener('click', () => {
			if (this.IS_DEBUG) console.log('click toggleLoop');
			this.toggleLoop();
		});
	}

	update() {
		if (this.IS_DEBUG) console.info('CanvasMenu.update');
	}

	projectFile() {
		if (this.IS_DEBUG) console.info('CanvasMenu.projectFile');
		const svgElement = ProjectVars.frames[0].svg;
	}

	// ____________________________________ button function  ____________________________________

	zoomIn() {
		if (this.IS_DEBUG) console.info('zoomIn');
		Globals.zoomScale += 0.1;
		this.svgElement.style.transform = `scale(${Globals.zoomScale})`;
	}

	zoomOut() {
		if (this.IS_DEBUG) console.info('zoomOut');
		if (Globals.zoomScale > 0.1) {
			Globals.zoomScale -= 0.1;
			this.svgElement.style.transform = `scale(${Globals.zoomScale})`;
		}
	}

	zoomTo100() {
		if (this.IS_DEBUG) console.info('zoomTo100');
		Globals.zoomScale = 1;
		this.svgElement.style.transform = `scale(${Globals.zoomScale})`;
	}

	zoomToFit() {
		if (this.IS_DEBUG) console.info('zoomToFit');
		const containerRect = canvasWrapper.getBoundingClientRect();
		const svgRect = this.svgElement.getBoundingClientRect();
		const scale = Math.min(containerRect.width / svgRect.width, containerRect.height / svgRect.height);
		Globals.zoomScale = scale;
		this.svgElement.style.transform = `scale(${Globals.zoomScale})`;
	}

	togglePlayStop() {
		if (this.isPlaying) {
			new Model().play();
		} else {
			new Model().stop();
		}
		this.isPlaying = !this.isPlaying;
		const toggleButton = document.getElementById('togglePlayStop');
		toggleButton.innerHTML = this.isPlaying ? '<i class="fa fa-stop"></i>' : '<i class="fa fa-play"></i>';
		// Logic to toggle play/stop
	}

	// Loop lity
	toggleLoop() {
		if (this.isLooping) {
			new Model().loop(true);
		} else {
			new Model().loop(false);
		}
		this.isLooping = !this.isLooping;
		const loopButton = document.getElementById('toggleLoop');
		loopButton.classList.toggle('active', this.isLooping); // Logic to toggle looping
	}

	// Keyframe navigation
	prevKeyframe() {
		// Logic to move to the previous keyframe
		new Model().previousKeyframe();
	}

	nextKeyframe() {
		// Logic to move to the next keyframe
		new Model().nextKeyframe();
	}

}

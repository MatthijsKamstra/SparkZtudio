import { CanvasMenu } from '../canvas-menu.js';
import { Canvas } from '../canvas.js';
import { Defaults } from '../defaults.js';
import { Globals } from '../globals.js';
import { Inter } from '../inter.js';
import { Layout } from '../layout.js';
import { LocalStorageHandler } from '../local-storage.js';
import { Menu } from '../menu.js';
import { Properties } from '../properties.js';
import { Shortcuts } from '../shortcuts.js';
import { Timeline } from '../timeline.js';
import { Tools } from '../tools.js';
import { Video } from '../video.js';
// import { Model, ProjectVars } from './model/model.js';



// Shared global variables
export const ProjectVars = {
	exportName: 'sparkztudio-project',
	projectName: 'SparkZtudio Project',
	creationDate: '',
	description: 'SparkZtudio Project description',
	version: '1',
	width: 600,
	height: 400,
	frameRate: 24,
	frameLength: 24 * 5, // 5 seconds
	time: 5, // 5 seconds
	frames: [],
	calculated: []
};


export class Model {

	IS_DEBUG = false;

	constructor() { }

	init() {
		if (this.IS_DEBUG) {
			console.group(`new Model().init`);
			console.info(`init js/model/model.js`);
			console.log(`version: ${Globals.version}`);
			console.groupEnd();
		}

		// jumpstart all
		Canvas.init();
		new CanvasMenu().init();
		Layout.init();
		new Menu().init();
		Timeline.init();
		Properties.init();
		Tools.init();
		Shortcuts.init();
		Video.init();
		// Inter.init();

		// Example usage:
		const storage = new LocalStorageHandler();
		storage.setItem('user', { name: 'John Doe', age: 30 });
		const user = storage.getItem('user');
		console.log(user); // Output: { name: 'John Doe', age: 30 }
		// storage.removeItem('user');
		// storage.clearAll();
	}

	setup() {
		if (this.IS_DEBUG) console.info(`new Model().setup`);
	}

	setProjectViaFile(jsonString) {
		console.clear();
		if (this.IS_DEBUG) console.info('new Model().setProjectViaFile');

		this.file(jsonString);

		if (this.IS_DEBUG) console.log(ProjectVars.exportName);


		// setSvgString2Element(ProjectVars.frames[0].svg);


		// Canvas.setSvg(svgElement);
		Canvas.projectFile();

		// Timeline.setSvg(svgElement);
		Timeline.projectFile();

		// Properties.setSvg(svgElement); // not sure this is usefull
		Properties.projectFile();
	}

	file(jsonString) {

		if (this.IS_DEBUG) {
			console.group('new Model().file');
			// console.info(jsonString);

		}

		// Check if data is a string
		if (typeof jsonString !== 'string') {
			if (this.IS_DEBUG) console.log('The jsonString is not a string.');
			jsonString = JSON.stringify(jsonString)
			if (this.IS_DEBUG) console.log(jsonString);
		}

		// Parse the JSON string
		const json = JSON.parse(jsonString);


		// TODO: clean up svg in height and width
		// make sure the values of the svg are same as json.width and .height
		const projectWidth = json.width;
		const projectHeight = json.height;

		json.frames.forEach(frame => {
			frame.svg = frame.svg.replace(/width='[^']*'/, `width='${projectWidth}'`);
			frame.svg = frame.svg.replace(/height='[^']*'/, `height='${projectHeight}'`);
			frame.svg = frame.svg.replace('\n', '');
		});

		// Extract basic project information
		const exportName = json.exportName;
		const projectName = json.projectName;
		const creationDate = json.creationDate;
		const description = json.description;
		const version = json.version;
		const width = json.width;
		const height = json.height;
		const frameRate = json.frameRate;
		const frameLength = json.frameLength;

		const time = (json.frameLength / json.frameRate);
		const calculated = json.calculated;

		// Extract frame data
		const frames = json.frames.map(frame => ({
			frameNumber: frame.frameNumber,
			svg: frame.svg,
			keyframe: frame.keyframe,
			tween: frame.tween
		}));


		ProjectVars.exportName = exportName;
		ProjectVars.projectName = projectName;
		ProjectVars.creationDate = creationDate;
		ProjectVars.description = description;
		ProjectVars.version = version;
		ProjectVars.width = width;
		ProjectVars.height = height;
		ProjectVars.frameRate = frameRate;
		ProjectVars.frameLength = frameLength;
		ProjectVars.time = time; // calculate
		ProjectVars.frames = frames;
		ProjectVars.calculated = calculated; // calculate

		if (this.IS_DEBUG) console.log(ProjectVars.exportName);
		if (this.IS_DEBUG) console.log(ProjectVars);

		if (this.IS_DEBUG) console.groupEnd();

	}


	setSvgString2Element(svgString) {
		// Parse the string to create a document fragment
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
		const svgElement = svgDoc.querySelector('svg');
		setProjectViaSvgElement(svgElement);
	}

	setSvg(data) {
		if (this.IS_DEBUG) console.info('> setSvg');
		if (this.IS_DEBUG) console.info(data);

		// Check if data is a string
		if (typeof data !== 'string') {
			if (this.IS_DEBUG) console.log('The data is not a string.');
			const serializer = new XMLSerializer();
			data = serializer.serializeToString(data);
			if (this.IS_DEBUG) console.log(data);
		}


		// Parse the string to create a document fragment
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(data, 'image/svg+xml');
		const svgElement = svgDoc.querySelector('svg');
		if (svgElement) {
			ProjectVars.width = parseInt(svgElement.getAttribute('width')) || 600;
			ProjectVars.height = parseInt(svgElement.getAttribute('height')) || 400;
			ProjectVars.creationDate = new Date().toLocaleDateString();
			ProjectVars.frames = [
				{
					"frameNumber": 1,
					"svg": data,
					"tween": "linear",
					"keyframe": true
				}];
			ProjectVars.calculated = [
				{
					"frameNumber": 1,
					"svg": data,
				}];
		}
		if (this.IS_DEBUG) console.log(ProjectVars);
	}


	cleanupSvg(svgElement) {
		if (this.IS_DEBUG) console.log('WIP new Model().cleanupSvg');
		// - [ ] fix missing id
		// - [ ] remove comment?
		// - [ ] add viewbox
		return svgElement
	}

	/**\
	 *
	 * haal info uit de svg die we kunnen gebruiken voor projectvars
	 * - width
	 * - height
	 */
	convertSvg2projectfile(svgElement) {
		if (this.IS_DEBUG) console.group('new Model().convertSvg2projectfile');
		if (svgElement) {
			ProjectVars.width = parseInt(svgElement.getAttribute('width')) || Defaults.width;
			ProjectVars.height = parseInt(svgElement.getAttribute('height')) || Defaults.height;
			ProjectVars.creationDate = new Date().toISOString();
			ProjectVars.frames = [
				{
					"frameNumber": 1,
					"svg": new XMLSerializer().serializeToString(svgElement),
					"tween": "linear",
					"keyframe": true
				}];
			ProjectVars.calculated = [
				{
					"frameNumber": 1,
					"svg": new XMLSerializer().serializeToString(svgElement),
				}];
			// if (this.IS_DEBUG) console.log('frames: ' + JSON.stringify(ProjectVars.frames));
			// if (this.IS_DEBUG) console.log('calculated: ' + JSON.stringify(ProjectVars.calculated));
			// if (this.IS_DEBUG) console.log(ProjectVars);
		}
		if (this.IS_DEBUG) console.groupEnd();
	}

	/**
	 * use the default values
	 */
	projectFileDefault() {
		// ProjectVars = JSON.parse(JSON.stringify(Defaults));
		// use default values
		ProjectVars.exportName = Defaults.exportName;
		ProjectVars.projectName = Defaults.projectName;
		ProjectVars.creationDate = Defaults.creationDate;
		ProjectVars.description = Defaults.description;
		ProjectVars.version = Defaults.version;
		ProjectVars.width = Defaults.width;
		ProjectVars.height = Defaults.height;
		ProjectVars.frameRate = Defaults.frameRate;
		ProjectVars.frameLength = Defaults.frameLength;
		ProjectVars.time = new Date().toISOString(); // calculate
		ProjectVars.frames = Defaults.frames;
		ProjectVars.calculated = Defaults.calculated; // calculate

		// console.log(Defaults.calculated);
		// console.log(ProjectVars.calculated);

	}

	setProjectViaSvgElement(svgElement) {
		if (this.IS_DEBUG) {
			console.group('new Model().setProjectViaSvgElement');
			console.log(svgElement);
			console.groupEnd();
		}
		// const svgContainer = document.getElementById(Globals.svgContainerID);
		// Append SVG to container
		// svgContainer.appendChild(svgElement);
		if (!svgElement) return;

		// cleanup svg
		svgElement = this.cleanupSvg(svgElement);
		// set in projectfile
		this.projectFileDefault();
		// console.log('1. ------------------------------');
		// console.log(ProjectVars);
		// console.log(ProjectVars.calculated.length);

		this.convertSvg2projectfile(svgElement);

		// console.log('2. ------------------------------');
		// console.log(ProjectVars);
		// console.log(ProjectVars.calculated);
		// console.log(ProjectVars.calculated.length);

		this.file(ProjectVars);

		// console.log('3. ------------------------------');
		// console.log(ProjectVars);
		// console.log(ProjectVars.calculated);
		// console.log(ProjectVars.calculated.length);

		// set in canvas
		Canvas.setSvg(svgElement);
		// set in timeline
		Timeline.setSvg(svgElement);
		// set in properties
		Properties.setSvg(svgElement); // not sure this is usefull
		Properties.projectFile(); // usefull
	}

	update() {
		if (this.IS_DEBUG) console.log('update');
		Canvas.update();
		Timeline.update();
		Properties.update();
	}

	play() {
		if (this.IS_DEBUG) console.log('new Model().play');
	}

	stop() {
		if (this.IS_DEBUG) console.log('new Model().stop');
	}

	nextKeyframe() {
		if (this.IS_DEBUG) console.log('new Model().nextKeyframe');
	}

	previousKeyframe() {
		if (this.IS_DEBUG) console.log('new Model().previousKeyframe');
	}

	loop(isLoop) {
		if (this.IS_DEBUG) console.log(`new Model().loop (${isLoop})`);
	}

}

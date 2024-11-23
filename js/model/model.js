import { CanvasMenu } from '../canvas-menu.js';
import { Canvas } from '../canvas.js';
import { Defaults } from '../defaults.js';
import { Globals } from '../globals.js';
import { Inter } from '../inter.js';
import { Layout } from '../layout.js';
import { Menu } from '../menu.js';
import { Properties } from '../properties.js';
import { Shortcuts } from '../shortcuts.js';
import { Timeline } from '../timeline.js';
import { Tools } from '../tools.js';
import { Video } from '../video.js';
// import { Model, ProjectVars } from './model/model.js';

const IS_DEBUG = false;

function init() {
	if (IS_DEBUG) {
		console.group(`Model.init`);
		console.info(`init js/model/model.js`);
		console.log(`version: ${Globals.version}`);
		console.groupEnd();
	}

	// jumpstart all
	Canvas.init();
	CanvasMenu.init();
	Layout.init();
	Menu.init();
	Timeline.init();
	Properties.init();
	Tools.init();
	Shortcuts.init();
	Video.init();
	// Inter.init();
}

function setup() {
	if (IS_DEBUG) console.info(`Model.setup`);
}

function setProjectViaFile(jsonString) {
	console.clear();
	if (IS_DEBUG) console.info('Model.setProjectViaFile');

	file(jsonString);

	if (IS_DEBUG) console.log(ProjectVars.exportName);


	// setSvgString2Element(ProjectVars.frames[0].svg);


	// Canvas.setSvg(svgElement);
	Canvas.projectFile();

	// Timeline.setSvg(svgElement);
	Timeline.projectFile();

	// Properties.setSvg(svgElement); // not sure this is usefull
	Properties.projectFile();
}

function file(jsonString) {

	if (IS_DEBUG) {
		console.group('Model.file');
		// console.info(jsonString);

	}

	// Check if data is a string
	if (typeof jsonString !== 'string') {
		if (IS_DEBUG) console.log('The jsonString is not a string.');
		jsonString = JSON.stringify(jsonString)
		if (IS_DEBUG) console.log(jsonString);
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

	if (IS_DEBUG) console.log(ProjectVars.exportName);
	if (IS_DEBUG) console.log(ProjectVars);

	if (IS_DEBUG) console.groupEnd();

}


function setSvgString2Element(svgString) {
	// Parse the string to create a document fragment
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
	const svgElement = svgDoc.querySelector('svg');
	setProjectViaSvgElement(svgElement);
}

function setSvg(data) {
	if (IS_DEBUG) console.info('> setSvg');
	if (IS_DEBUG) console.info(data);

	// Check if data is a string
	if (typeof data !== 'string') {
		if (IS_DEBUG) console.log('The data is not a string.');
		const serializer = new XMLSerializer();
		data = serializer.serializeToString(data);
		if (IS_DEBUG) console.log(data);
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
	if (IS_DEBUG) console.log(ProjectVars);
}


function cleanupSvg(svgElement) {
	if (IS_DEBUG) console.log('WIP Model.cleanupSvg');
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
function convertSvg2projectfile(svgElement) {
	if (IS_DEBUG) console.group('Model.convertSvg2projectfile');
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
		// if (IS_DEBUG) console.log('frames: ' + JSON.stringify(ProjectVars.frames));
		// if (IS_DEBUG) console.log('calculated: ' + JSON.stringify(ProjectVars.calculated));
		// if (IS_DEBUG) console.log(ProjectVars);
	}
	if (IS_DEBUG) console.groupEnd();
}

/**
 * use the default values
 */
function projectFileDefault() {
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

function setProjectViaSvgElement(svgElement) {
	if (IS_DEBUG) {
		console.group('Model.setProjectViaSvgElement');
		console.log(svgElement);
		console.groupEnd();
	}
	// const svgContainer = document.getElementById(Globals.svgContainerID);
	// Append SVG to container
	// svgContainer.appendChild(svgElement);

	// cleanup svg
	svgElement = cleanupSvg(svgElement);
	// set in projectfile
	projectFileDefault();
	// console.log('1. ------------------------------');
	// console.log(ProjectVars);
	// console.log(ProjectVars.calculated.length);

	convertSvg2projectfile(svgElement);

	// console.log('2. ------------------------------');
	// console.log(ProjectVars);
	// console.log(ProjectVars.calculated);
	// console.log(ProjectVars.calculated.length);

	file(ProjectVars);

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

function update() {
	if (IS_DEBUG) console.log('update');
	Canvas.update();
	Timeline.update();
	Properties.update();
}

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

// Export an object to group the functions
export const Model = {
	init,
	setup,
	file,
	setSvg,
	update,
	setProjectViaSvgElement,
	setProjectViaFile,
};

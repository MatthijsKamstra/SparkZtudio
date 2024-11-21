import { Canvas } from './canvas.js';
import { Globals } from './globals.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Properties } from './properties.js';
import { Shortcuts } from './shortcuts.js';
import { Timeline } from './timeline.js';
import { Tools } from './tools.js';
// import { Project, ProjectVars } from './project.js';

const IS_DEBUG = true;

function initProject() {
	if (IS_DEBUG) console.info(`init project.js`);
	if (IS_DEBUG) console.log(`version: ${Globals.version}`);

	Canvas.init();
	Layout.init();
	Menu.init();
	Timeline.init();
	Properties.init();
	Tools.init();
	Shortcuts.init();
}

function initProjectFile(jsonString) {

	// Parse the JSON string
	const json = JSON.parse(jsonString);
	if (IS_DEBUG) console.info('> initProjectFile');
	if (IS_DEBUG) console.info(json);


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
	ProjectVars.frames = frames;


	// console.log(frames);
	// console.log(frames[0]);
	// console.log(frames[0].svg);

	setSvgString2Element(frames[0].svg);


	return {
		exportName,
		projectName,
		creationDate,
		description,
		version,
		width,
		height,
		frameRate,
		frameLength,
		frames
	};


}


function setSvgString2Element(svgString) {
	// Parse the string to create a document fragment
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
	const svgElement = svgDoc.querySelector('svg');
	setSvgElement(svgElement);
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
	}
	if (IS_DEBUG) console.log(ProjectVars);

}


function cleanupSvg(svgElement) {
	if (IS_DEBUG) console.log('cleanupSvg');
	// - [ ] fix missing id
	// - [ ] remove comment?
	// - [ ] add viewbox
	return svgElement
}

function convertSvg2projectfile(svgElement) {
	if (IS_DEBUG) console.group('convertSvg2projectfile');
	if (svgElement) {
		ProjectVars.width = parseInt(svgElement.getAttribute('width')) || 600;
		ProjectVars.height = parseInt(svgElement.getAttribute('height')) || 400;
		ProjectVars.creationDate = new Date().toLocaleDateString();
		ProjectVars.frames = [
			{
				"frameNumber": 1,
				"svg": new XMLSerializer().serializeToString(svgElement),
				"tween": "linear",
				"keyframe": true
			}];
		if (IS_DEBUG) console.log(ProjectVars);
	}
	if (IS_DEBUG) console.groupEnd();
}

function setSvgElement(svgElement) {
	if (IS_DEBUG) {
		console.group('setSvgElement');
		console.log(svgElement);
		console.groupEnd();
	}
	// const svgContainer = document.getElementById(Globals.svgContainerID);
	// Append SVG to container
	// svgContainer.appendChild(svgElement);

	// cleanup svg
	svgElement = cleanupSvg(svgElement);
	// set in projectfile
	convertSvg2projectfile(svgElement);

	// set in canvas
	Canvas.setSvg(svgElement);
	// set in timeline
	Timeline.setSvg(svgElement);
	// set in properties
	Properties.setSvg(svgElement); // not sure this is usefull
	Properties.projectFile(); // usefull
}

function update() {
	console.log('update');
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
	frames: []
};


// Export an object to group the functions
export const Project = {
	init: initProject,
	file: initProjectFile,
	setSvg: setSvg,
	setSvgElement,
	update
};

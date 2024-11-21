import { Canvas } from './canvas.js';
import { Globals } from './globals.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Properties } from './properties.js';
import { Shortcuts } from './shortcuts.js';
import { Timeline } from './timeline.js';
import { Tools } from './tools.js';

const IS_DEBUG = true;

function initProject() {
	console.log(`version: ${Globals.version}`);

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
	const exportName = json.export_name;
	const projectName = json.project_name;
	const creationDate = json.creation_date;
	const description = json.description;
	const version = json.version;
	const width = json.width;
	const height = json.height;
	const framerate = json.framerate;
	const totalframes = json.totalframes;

	// Extract frame data
	const frames = json.frames.map(frame => ({
		frameNumber: frame.frame_number,
		svgContent: frame.svg,
		keyframe: frame.keyframe
	}));


	ProjectVars.exportName = exportName;
	ProjectVars.projectName = projectName;
	ProjectVars.creationDate = creationDate;
	ProjectVars.description = description;
	ProjectVars.version = version;
	ProjectVars.width = width;
	ProjectVars.height = height;
	ProjectVars.framerate = framerate;
	ProjectVars.totalframes = totalframes;
	ProjectVars.frames = frames;

	return {
		exportName,
		projectName,
		creationDate,
		description,
		version,
		width,
		height,
		framerate,
		totalframes,
		frames
	};


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
				"frame_number": 1,
				"svg": data,
				"keyframe": true
			}];
	}
	if (IS_DEBUG) console.log(ProjectVars);

}

// Shared global variables
export const ProjectVars = {
	exportName: 'spark-studio-project',
	projectName: 'SparkStudio Project',
	creationDate: 'xx',
	description: 'SparkStudio Project description',
	version: '1',
	width: 600,
	height: 400,
	framerate: 24,
	totalframes: 24 * 5, // 5 seconds
	frames: []
};


// Export an object to group the functions
export const Project = {
	init: initProject,
	file: initProjectFile,
	setSvg: setSvg,
};

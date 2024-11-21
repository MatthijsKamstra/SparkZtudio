import { Canvas } from './canvas.js';
import { Globals } from './globals.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Properties } from './properties.js';
import { Shortcuts } from './shortcuts.js';
import { Timeline } from './timeline.js';
import { Tools } from './tools.js';

const IS_DEBUG = false;

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
	console.log(json);

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
	totalframes: 100,
	frames: []
};


// Export an object to group the functions
export const Project = {
	init: initProject,
	file: initProjectFile,
};

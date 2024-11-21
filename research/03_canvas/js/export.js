import { Globals } from './globals.js';
import { Project, ProjectVars } from './project.js';

let IS_DEBUG = true;

function init() {
	if (IS_DEBUG) console.info('init export.js');
}

function image() {
	if (IS_DEBUG) console.info('image');
}

function file() {
	if (IS_DEBUG) console.info('file');

	console.log(ProjectVars);


}

// Export an object to group the functions
export const Export = {
	init,
	image,
	file,
};

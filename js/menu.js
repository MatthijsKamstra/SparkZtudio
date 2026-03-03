import { Canvas } from './canvas.js';
import { ExportVideo } from './export-video.js';
import { Export } from './export.js';
import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

export class Menu {

	IS_DEBUG = false;

	constructor() {
		if (this.IS_DEBUG) console.info('constructor menu.js');
	}

	init() {
		if (this.IS_DEBUG) console.info('Menu.init()');
		this.setup();
	}

	/**
	 * setup UI
	 */
	setup() {
		// File menu items
		document.getElementById('newFile').onclick = () => {
			if (this.IS_DEBUG) console.log('click btn newFile');
			this.newFile();
		};
		document.getElementById('saveFile').onclick = () => {
			if (this.IS_DEBUG) console.log('click btn saveFile');
			this.saveFile();
		};
		document.getElementById('saveAsFile').onclick = () => {
			if (this.IS_DEBUG) console.log('click btn saveAsFile');
			this.saveAsFile();
		};
		document.getElementById('exportFile').onclick = () => {
			if (this.IS_DEBUG) console.log('click btn exportFile');
			this.exportFile();
		};
		document.getElementById('exportMovie').onclick = () => {
			if (this.IS_DEBUG) console.log('click btn exportMovie');
			this.exportMovie();
		};
		document.getElementById('closeFile').onclick = () => {
			if (this.IS_DEBUG) console.log('click btn closeFile');
			this.closeFile();
		};
		document.getElementById('labelOpenFile').onclick = (e) => {
			if (this.IS_DEBUG) console.log('click btn labelOpenFile');
			e.preventDefault(); // Prevent any default label behavior
			document.getElementById('openFileInput3').click(); // Trigger the file input click
		};
		document.getElementById('importFileLabel').onclick = (e) => {
			if (this.IS_DEBUG) console.log('click btn importFileLabel');
			e.preventDefault(); // Prevent any default label behavior
			document.getElementById('importFile3').click(); // Trigger the file input click
		};

		/**
		 * should only be used for .json or .sparkz
		 */
		// Open file input
		document.getElementById('openFileInput3').addEventListener('change', function (event) {
			if (this.IS_DEBUG) console.log('openFileInput');
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = function (e) {
					const projectFile = e.target.result;
					new Model().setProjectViaFile(projectFile);
				};
				reader.readAsText(file);
			}
		});

		/**
		 * should only be used for .svg
		 */
		// Open file input
		document.getElementById('importFile3').addEventListener('change', function (event) {
			if (this.IS_DEBUG) console.log('importFile');
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = function (e) {
					const svgString = e.target.result;
					const parser = new DOMParser();
					const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
					const svgElement = svgDoc.querySelector('svg');
					new Model().setProjectViaSvgElement(svgElement)
				};
				reader.readAsText(file);
			}
		});

		// helper to safely wire menu items (guards against removed elements)
		const wire = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };

		// Edit menu items
		wire('undo', () => alert('Undo'));
		wire('redo', () => alert('Redo'));
		wire('cut', () => alert('Cut'));
		wire('copy', () => alert('Copy'));
		wire('paste', () => alert('Paste'));

		// View menu items
		wire('zoomIn', () => alert('Zoom In'));
		wire('zoomOut', () => alert('Zoom Out'));
		wire('fitToScreen', () => alert('Fit to Screen'));

		// Layer menu items
		wire('newLayer', () => alert('New Layer'));
		wire('deleteLayer', () => alert('Delete Layer'));
		wire('duplicateLayer', () => alert('Duplicate Layer'));

		// Window menu items (may not be present in all layouts)
		wire('minimize', () => alert('Minimize'));
		wire('maximize', () => alert('Maximize'));
		wire('closeWindow', () => alert('Close Window'));

		// Help menu items
		wire('helpTopics', () => alert('Help Topics'));
		wire('about', () => alert('About'));
	}

	// ____________________________________ button functions ____________________________________

	newFile() {
		new Model().newFile();
	}

	saveFile() {
		new Model().saveFile();
		// Update stored filename with current project export name
		const name = ProjectVars.exportName ? ProjectVars.exportName + '.json' : null;
		if (name) {
			localStorage.setItem('sparkLastFile', JSON.stringify({ name, opened: Date.now() }));
			const el = document.getElementById('currentFileName');
			if (el) el.textContent = name;
		}
	}

	saveAsFile() {
		new Model().saveAsFile();
	}

	exportFile() {
		new Model().exportFile();
	}

	exportMovie() {
		new Model().exportMovie();
	}

	closeFile() {
		new Model().closeFile();
	}

}

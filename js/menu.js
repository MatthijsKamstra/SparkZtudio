import { Canvas } from './canvas.js';
import { Export } from './export.js';
import { Globals } from './globals.js';
import { Model } from './model/model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';
import { Video } from './video.js';


export class Menu {

	IS_DEBUG = false;

	constructor() { }

	init() {
		if (this.IS_DEBUG) console.info('menu.js');
		this.setup();
	}

	/**
	 * setup UI
	 */
	setup() {

		// File menu items
		document.getElementById('newFile').onclick = function () {
			if (this.IS_DEBUG) console.log('click btn newFile');
			this.newFile();
		};
		document.getElementById('saveFile').onclick = function () {
			if (this.IS_DEBUG) console.log('click btn saveFile');
			this.saveFile();

		};

		document.getElementById('saveAsFile').onclick = function () {
			if (this.IS_DEBUG) console.log('click btn saveAsFile');
			this.saveAsFile();

		};

		document.getElementById('exportFile').onclick = function () {
			if (this.IS_DEBUG) console.log('click btn exportFile');
			this.exportFile();

		};

		document.getElementById('exportMovie').onclick = function () {
			if (this.IS_DEBUG) console.log('click btn exportMovie');
			this.exportMovie();

		};

		document.getElementById('closeFile').onclick = function () {
			if (this.IS_DEBUG) console.log('click btn closeFile');
			this.closeFile();

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
					if (this.IS_DEBUG) console.log(projectFile);
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

		// Edit menu items
		document.getElementById('undo').onclick = function () { alert('Undo'); };
		document.getElementById('redo').onclick = function () { alert('Redo'); };
		document.getElementById('cut').onclick = function () { alert('Cut'); };
		document.getElementById('copy').onclick = function () { alert('Copy'); };
		document.getElementById('paste').onclick = function () { alert('Paste'); };

		// View menu items
		document.getElementById('zoomIn').onclick = function () { alert('Zoom In'); };
		document.getElementById('zoomOut').onclick = function () { alert('Zoom Out'); };
		document.getElementById('fitToScreen').onclick = function () { alert('Fit to Screen'); };

		// Layer menu items
		document.getElementById('newLayer').onclick = function () { alert('New Layer'); };
		document.getElementById('deleteLayer').onclick = function () { alert('Delete Layer'); };
		document.getElementById('duplicateLayer').onclick = function () { alert('Duplicate Layer'); };

		// Window menu items
		document.getElementById('minimize').onclick = function () { alert('Minimize'); };
		document.getElementById('maximize').onclick = function () { alert('Maximize'); };
		document.getElementById('closeWindow').onclick = function () { alert('Close Window'); };

		// Help menu items
		document.getElementById('helpTopics').onclick = function () { alert('Help Topics'); };
		document.getElementById('about').onclick = function () { alert('About'); };
	}

	// ____________________________________ button functions ____________________________________

	newFile() {
		const modal = new bootstrap.Modal(document.getElementById('svgPropertiesModal'));
		modal.show();
	}

	saveFile() {
		new Model().saveFile();
		Export.file();
	}

	saveAsFile() {
		alert('Save As File');
	}

	exportFile() {
		Export.image();
	}

	exportMovie() {
		const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
		modal.show();
		Video.initializeCanvas();
	}

	closeFile() {
		alert('Close File');
	}

}

import { CanvasMenu } from './canvas-menu.js';
import { readImageFile } from './assets.js';
import { LocalStorageHandler } from './local-storage.js';
import { Model } from './model/model.js';

/** Navbar menus (File, Edit, View, Layer) and the New Document dialog. */
export class Menu {

	IS_DEBUG = false;

	constructor() {
		if (Menu.instance) return Menu.instance;
		Menu.instance = this;
	}

	init() {
		const model = new Model();
		const wire = (id, fn) => {
			const el = document.getElementById(id);
			if (el) el.addEventListener('click', (e) => { e.preventDefault(); fn(); });
		};

		// File
		wire('newFile', () => model.newFile());
		wire('saveFile', () => model.saveFile());
		wire('exportFile', () => model.exportFile());
		wire('exportMovie', () => model.exportMovie());
		wire('labelOpenFile', () => model.openFile());
		wire('importFileLabel', () => model.importFile());
		wire('addGoogleFont', async () => {
			const url = prompt('Google Fonts stylesheet URL', 'https://fonts.googleapis.com/css2?family=Kenia&display=swap');
			if (!url) return;
			try {
				const families = await model.addGoogleFont(url.trim());
				alert(`Added ${families.join(', ')}. Select a text layer to use it.`);
			} catch (e) {
				alert(`Could not add font: ${e.message}`);
			}
		});

		document.getElementById('openFileInput3').addEventListener('change', (e) => {
			this.readFile(e.target, (text) => model.openProjectText(text));
		});
		document.getElementById('importFile3').addEventListener('change', (e) => {
			this.readFile(e.target, (text, file) => model.importSvgText(text, file.name));
		});
		document.getElementById('placeImageInput').addEventListener('change', async (e) => {
			const input = e.target;
			const file = input.files[0];
			if (!file) return;
			try {
				model.placeImage(await readImageFile(file));
			} catch (error) {
				alert(`Could not place image: ${error.message}`);
			} finally {
				input.value = '';
			}
		});

		document.getElementById('createSvgButton').addEventListener('click', () => {
			const width = Number(document.getElementById('svgWidth').value);
			const height = Number(document.getElementById('svgHeight').value);
			if (!(width > 0 && height > 0)) return;
			bootstrap.Modal.getOrCreateInstance(document.getElementById('svgPropertiesModal')).hide();
			model.newProject({ width, height });
		});

		// Edit
		wire('undo', () => model.undo());
		wire('redo', () => model.redo());

		// View
		const canvasMenu = new CanvasMenu();
		wire('zoomIn', () => canvasMenu.zoomIn());
		wire('zoomOut', () => canvasMenu.zoomOut());
		wire('fitToScreen', () => canvasMenu.zoomToFit());

		// Layer
		wire('newLayer', () => model.addLayer());
		wire('deleteLayer', () => model.deleteLayer());
		wire('duplicateLayer', () => model.duplicateLayer());
		wire('distributeToLayers', () => model.distributeToLayers());

		this.refreshRecentFiles();
	}

	readFile(input, callback) {
		const file = input.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => callback(reader.result, file);
		reader.readAsText(file);
		input.value = ''; // allow opening the same file again
	}

	/** File > Open Recent, from the last 5 projects stored in localStorage. */
	refreshRecentFiles() {
		const container = document.getElementById('recentFilesList');
		if (!container) return;
		const list = new LocalStorageHandler().getItem('projectFiles') || [];
		container.innerHTML = '';
		if (list.length === 0) {
			container.innerHTML = '<li><span class="dropdown-item text-muted disabled small">No recent files</span></li>';
			return;
		}
		[...list].reverse().forEach((jsonStr) => {
			let name;
			try {
				const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
				name = `${data.exportName || data.projectName || 'Untitled'}.json`;
			} catch (e) {
				return;
			}
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.className = 'dropdown-item text-truncate small';
			a.href = '#';
			a.title = name;
			a.textContent = name;
			a.addEventListener('click', (e) => {
				e.preventDefault();
				new Model().openProjectText(jsonStr);
			});
			li.appendChild(a);
			container.appendChild(li);
		});
	}
}

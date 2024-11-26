import { Globals } from './globals.js';
import { ProjectVars } from './model/model.js';

export class Timeline {

	IS_DEBUG = false;

	constructor() {
		if (this.IS_DEBUG) console.info(`constructor timeline.js`);
	}

	init() {
		if (this.IS_DEBUG) console.info(`Timeline.init()`);
	}

	/**
	 * setup UI
	 */
	setup() {
		if (this.IS_DEBUG) console.info('Timeline.setup');
	}

	update() {
		if (this.IS_DEBUG) console.info('Timeline.update');
		this.setFrameRate();
		this.setTotalFrames();
		this.setTotalTime();
	}

	projectFile() {
		if (this.IS_DEBUG) console.info('Timeline.projectFile');
		this.update();
		this.setSvg(ProjectVars.frames[0].svg);

	}

	// Function to generate a random ID
	generateId() {
		return 'id-' + Math.random().toString(36).substr(2, 9);
	}


	createLayerRow(id, type) {
		const row = document.createElement('tr');
		row.dataset.layerId = id;

		const checkboxCell = document.createElement('td');
		checkboxCell.className = 'text-center';
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'form-check-input';
		checkboxCell.appendChild(checkbox);

		const visibleCell = document.createElement('td');
		visibleCell.className = 'text-center';
		const visibleIcon = document.createElement('i');
		visibleIcon.className = 'fa fa-eye';
		visibleCell.appendChild(visibleIcon);
		visibleIcon.addEventListener('click', () => {
			const layer = document.getElementById(id);
			layer.style.display = layer.style.display === 'none' ? 'block' : 'none';
			visibleIcon.className = layer.style.display === 'none' ? 'fa fa-eye-slash' : 'fa fa-eye';
		});

		const lockCell = document.createElement('td');
		lockCell.className = 'text-center';
		const lockIcon = document.createElement('i');
		lockIcon.className = 'fa fa-unlock';
		lockCell.appendChild(lockIcon);
		lockIcon.addEventListener('click', () => {
			const layer = document.getElementById(id);
			const isLocked = layer.getAttribute('pointer-events') === 'none';
			layer.setAttribute('pointer-events', isLocked ? 'all' : 'none');
			lockIcon.className = isLocked ? 'fa fa-lock' : 'fa fa-unlock';
		});

		const actionsCell = document.createElement('td');
		const actionsDropdown = document.createElement('div');
		actionsDropdown.className = 'dropup';
		const actionsButton = document.createElement('button');
		actionsButton.className = 'btn btn-sm btn-secondary dropdown-toggle';
		actionsButton.textContent = 'Actions';
		actionsButton.setAttribute('data-bs-toggle', 'dropdown');
		const actionsMenu = document.createElement('ul');
		actionsMenu.className = 'dropdown-menu';

		const moveUpItem = document.createElement('li');
		const moveUpLink = document.createElement('a');
		moveUpLink.className = 'dropdown-item';
		moveUpLink.textContent = 'Up';
		moveUpLink.addEventListener('click', () => {
			const layer = document.getElementById(id);
			const previousLayer = layer.previousElementSibling;
			if (previousLayer) {
				layer.parentNode.insertBefore(layer, previousLayer);
				row.parentNode.insertBefore(row, row.previousElementSibling);
			}
		});
		moveUpItem.appendChild(moveUpLink);

		const moveDownItem = document.createElement('li');
		const moveDownLink = document.createElement('a');
		moveDownLink.className = 'dropdown-item';
		moveDownLink.textContent = 'Down';
		moveDownLink.addEventListener('click', () => {
			const layer = document.getElementById(id);
			const nextLayer = layer.nextElementSibling;
			if (nextLayer) {
				layer.parentNode.insertBefore(nextLayer, layer);
				row.parentNode.insertBefore(row.nextElementSibling, row);
			}
		});
		moveDownItem.appendChild(moveDownLink);

		const deleteItem = document.createElement('li');
		const deleteLink = document.createElement('a');
		deleteLink.className = 'dropdown-item';
		deleteLink.textContent = 'Delete';
		deleteLink.addEventListener('click', () => {
			const layer = document.getElementById(id);
			layer.remove();
			row.remove();
		});
		deleteItem.appendChild(deleteLink);

		actionsMenu.appendChild(moveUpItem);
		actionsMenu.appendChild(moveDownItem);
		actionsMenu.appendChild(deleteItem);
		actionsDropdown.appendChild(actionsButton);
		actionsDropdown.appendChild(actionsMenu);
		actionsCell.appendChild(actionsDropdown);

		const idCell = document.createElement('td');
		idCell.className = 'text-nowrap';
		idCell.textContent = id;

		const typeCell = document.createElement('td');
		typeCell.className = 'text-center';
		const typeIcon = document.createElement('i');
		if (type === 'rect') typeIcon.className = 'fa fa-square-o';
		else if (type === 'circle') typeIcon.className = 'fa fa-circle';
		else if (type === 'text') typeIcon.className = 'fa fa-font';
		else if (type === 'image') typeIcon.className = 'fa fa-image';
		else typeIcon.className = 'fa fa-layer-group';
		typeCell.appendChild(typeIcon);

		// const framesCell = document.createElement('td');
		// // framesCell.textContent = ProjectVars.frameLength;
		// framesCell.innerHTML = '<table class="table-bordered table-striped-columns"><tr><td>1</td><td>2</td><td>3</td></tr></table>';
		// // framesCell.textContent = this.calculateTotalFrames();


		const framesCell = document.createElement('td');
		framesCell.classList = 'm-0 p-0';
		const framesDiv = document.createElement('div');
		framesDiv.className = 'frames-container d-flex h-100';
		const totalFrames = this.calculateTotalFrames();
		for (let i = 0; i < totalFrames; i++) {
			const frameDiv = document.createElement('div');
			frameDiv.id = `${id}-${type}-${i + 1}`;
			frameDiv.className = 'frame text-center';
			frameDiv.style.width = '30px';
			// Fixed width for each frame div
			frameDiv.style.border = '1px solid #ccc';
			// frameDiv.style.resize = 'horizontal';
			// frameDiv.style.overflow = 'auto';
			frameDiv.textContent = i + 1;
			framesDiv.appendChild(frameDiv);
		}
		framesCell.appendChild(framesDiv);

		// order table
		row.appendChild(checkboxCell);
		row.appendChild(visibleCell);
		row.appendChild(lockCell);
		row.appendChild(actionsCell);
		row.appendChild(typeCell);
		row.appendChild(idCell);
		row.appendChild(framesCell);

		return row;
	}

	calculateTotalFrames() {
		// const frameRate = document.getElementById('timelineFrameRate').value || 0;
		// const totalFrames = document.getElementById('timeLineTotalFrames').value || 0;
		// return frameRate * totalFrames;
		return ProjectVars.frameLength;
	}

	setSvg(data) {
		if (this.IS_DEBUG) {
			console.info('Timeline.setSvg()');
			console.info(data);
		}

		this.update();

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

		// Extract all elements from the parsed SVG
		const elements = svgDoc.querySelectorAll('*');
		const elementIds = [];

		elements.forEach(element => {
			if (!element.id && element.nodeName !== 'svg') {
				element.setAttribute('id', this.generateId());
			}
			if (element.nodeName !== 'svg') elementIds.push({ id: element.id, type: element.nodeName });
		});

		// Display the shuffled array of IDs as layers in the panel
		const timelineTableBody = document.getElementById('timelineTableBody');
		timelineTableBody.innerHTML = ''; // clear content
		elementIds.forEach(({ id, type }) => {
			const layerRow = this.createLayerRow(id, type);
			timelineTableBody.appendChild(layerRow);
		});

		// Serialize the modified SVG back to a string
		const serializer = new XMLSerializer();
		const updatedSvgString = serializer.serializeToString(svgDoc);

		// Assume svgContainer is defined elsewhere in your script
		const svgContainer = document.querySelector('#svg-container');
		if (!svgContainer) {
			console.error('SVG container not found');
			return;
		}

		// Clear existing content and set the updated SVG string
		svgContainer.innerHTML = updatedSvgString;

		if (this.IS_DEBUG) console.log('Updated SVG:', updatedSvgString);
	}

	setFrameRate() {
		if (this.IS_DEBUG) console.info('Timeline.setFrameRate');
		const el = document.getElementById('timelineFrameRate');
		el.value = ProjectVars.frameRate;
	}

	setTotalFrames() {
		if (this.IS_DEBUG) console.info('Timeline.setTotalFrames');
		const el = document.getElementById('timeLineTotalFrames');
		el.value = ProjectVars.frameLength;
	}

	setTotalTime() {
		if (this.IS_DEBUG) console.info('Timeline.setTotalTime');
		const el = document.getElementById('timeLineTotalTime');
		el.value = (ProjectVars.frameLength / ProjectVars.frameRate).toFixed(2);
	}

}

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
		this.updateTimeline();
	}

	// Flash-style timeline: frame numbers once at top, keyframe diamonds per layer
	updateTimeline() {
		const totalFrames = ProjectVars.frameLength;
		const keyframeNums = new Set((ProjectVars.frames || []).map(f => f.frameNumber));

		// --- Rebuild thead with frame number ruler ---
		const table = document.querySelector('#timelineWrapper table');
		if (!table) return;
		const thead = table.querySelector('thead');
		const headerRow = thead.querySelector('tr');
		// Remove old dynamic frame-number ths (keep only fixed layer control ths)
		const FIXED_COLS = 4; // eye, lock, type, id
		Array.from(headerRow.querySelectorAll('th.frame-num-th')).forEach(th => th.remove());
		// Add frame number header cells
		for (let i = 1; i <= totalFrames; i++) {
			const th = document.createElement('th');
			th.className = 'frame-num-th';
			if (i === 1 || i % 5 === 0) th.textContent = i;
			headerRow.appendChild(th);
		}

		// --- Rebuild tbody ---
		const tbody = document.getElementById('timelineTableBody');
		tbody.innerHTML = '';

		if (!ProjectVars.frames || ProjectVars.frames.length === 0) return;

		// Extract SVG element layers from the first keyframe
		const layers = this._extractLayers(ProjectVars.frames[0].svg);
		layers.forEach(({ id, type }) => {
			const row = this._createTimelineRow(id, type, totalFrames, keyframeNums);
			tbody.appendChild(row);
		});
	}

	_extractLayers(svgString) {
		if (!svgString) return [];
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgString, 'image/svg+xml');
		const elements = Array.from(doc.querySelectorAll('svg > *'));
		return elements.map(el => ({ id: el.id || this.generateId(), type: el.nodeName }));
	}

	_createTimelineRow(id, type, totalFrames, keyframeNums) {
		const row = document.createElement('tr');

		// Eye cell
		const eyeCell = document.createElement('td');
		eyeCell.className = 'tl-fixed text-center';
		const eyeIcon = document.createElement('i');
		eyeIcon.className = 'bi bi-eye tl-icon';
		eyeCell.appendChild(eyeIcon);
		eyeIcon.addEventListener('click', () => {
			const el = document.getElementById(id);
			if (!el) return;
			el.style.display = el.style.display === 'none' ? '' : 'none';
			eyeIcon.className = el.style.display === 'none' ? 'bi bi-eye-slash tl-icon' : 'bi bi-eye tl-icon';
		});

		// Lock cell
		const lockCell = document.createElement('td');
		lockCell.className = 'tl-fixed text-center';
		const lockIcon = document.createElement('i');
		lockIcon.className = 'bi bi-unlock tl-icon';
		lockCell.appendChild(lockIcon);
		lockIcon.addEventListener('click', () => {
			const el = document.getElementById(id);
			if (!el) return;
			const locked = el.getAttribute('pointer-events') === 'none';
			el.setAttribute('pointer-events', locked ? 'all' : 'none');
			lockIcon.className = locked ? 'bi bi-unlock tl-icon' : 'bi bi-lock tl-icon';
		});

		// Type icon cell
		const typeCell = document.createElement('td');
		typeCell.className = 'tl-fixed text-center';
		const typeIcon = document.createElement('i');
		typeIcon.className = this._typeIcon(type) + ' tl-icon';
		typeCell.appendChild(typeIcon);

		// ID label cell
		const idCell = document.createElement('td');
		idCell.className = 'tl-fixed tl-label text-nowrap';
		idCell.textContent = id;
		idCell.title = id;

		row.appendChild(eyeCell);
		row.appendChild(lockCell);
		row.appendChild(typeCell);
		row.appendChild(idCell);

		// Frame cells — one per frame
		for (let i = 1; i <= totalFrames; i++) {
			const td = document.createElement('td');
			td.className = 'kf-cell';
			if (keyframeNums.has(i)) {
				td.className += ' kf-cell--key';
				td.innerHTML = '<span class="kf-diamond">◆</span>';
			}
			row.appendChild(td);
		}

		return row;
	}

	_typeIcon(type) {
		const map = { rect: 'bi bi-square', circle: 'bi bi-circle', text: 'bi bi-fonts', image: 'bi bi-image' };
		return map[type] || 'bi bi-layers';
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
		visibleIcon.className = 'bi bi-eye';
		visibleCell.appendChild(visibleIcon);
		visibleIcon.addEventListener('click', () => {
			const layer = document.getElementById(id);
			layer.style.display = layer.style.display === 'none' ? 'block' : 'none';
			visibleIcon.className = layer.style.display === 'none' ? 'bi bi-eye-slash' : 'bi bi-eye';
		});

		const lockCell = document.createElement('td');
		lockCell.className = 'text-center';
		const lockIcon = document.createElement('i');
		lockIcon.className = 'bi bi-unlock';
		lockCell.appendChild(lockIcon);
		lockIcon.addEventListener('click', () => {
			const layer = document.getElementById(id);
			const isLocked = layer.getAttribute('pointer-events') === 'none';
			layer.setAttribute('pointer-events', isLocked ? 'all' : 'none');
			lockIcon.className = isLocked ? 'bi bi-lock' : 'bi bi-unlock';
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
		if (type === 'rect') typeIcon.className = 'bi bi-square';
		else if (type === 'circle') typeIcon.className = 'bi bi-circle';
		else if (type === 'text') typeIcon.className = 'bi bi-fonts';
		else if (type === 'image') typeIcon.className = 'bi bi-image';
		else typeIcon.className = 'bi bi-layers';
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
		}

		// Ensure data is a string
		if (typeof data !== 'string') {
			const serializer = new XMLSerializer();
			data = serializer.serializeToString(data);
		}

		// Set first frame SVG on canvas
		const svgContainer = document.querySelector('#svg-container');
		if (svgContainer) {
			svgContainer.innerHTML = data;
		}

		// Rebuild timeline with updated ProjectVars
		this.update();
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

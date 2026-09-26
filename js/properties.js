import { Model, ProjectVars } from './model/model.js';
import { escapeXml, getLayerState, governingKeyframe, keyframeAt } from './model/project.js';

// [input id, state key, display factor, step]
const STATE_FIELDS = [
	['propX', 'x', 1, 1],
	['propY', 'y', 1, 1],
	['propScaleX', 'sx', 100, 1],
	['propScaleY', 'sy', 100, 1],
	['propRotation', 'rot', 1, 1],
	['propAlpha', 'alpha', 100, 1],
];

/** Property inspector: selected layer at the current frame, plus document settings. */
export class Properties {

	IS_DEBUG = false;

	constructor() {
		if (Properties.instance) return Properties.instance;
		Properties.instance = this;
	}

	init() {
		this.selectionEl = document.getElementById('propertiesSelection');
		this.documentEl = document.getElementById('propertiesDocument');
	}

	build() {
		this.buildSelection();
		this.buildDocument();
	}

	buildSelection() {
		const model = new Model();
		const layer = model.getLayer();
		if (!layer) {
			this.selectionEl.innerHTML = '<p class="text-muted mb-0">Select an object on the stage or a layer in the timeline.</p>';
			return;
		}
		const field = ([id, , , step], label, unit = '') => `
			<div class="col-6">
				<label class="form-label mb-0" for="${id}">${label}</label>
				<div class="input-group input-group-sm">
					<input type="number" class="form-control form-control-sm" id="${id}" step="${step}">
					${unit ? `<span class="input-group-text">${unit}</span>` : ''}
				</div>
			</div>`;
		this.selectionEl.innerHTML = `
			<form id="selectionForm" class="small" autocomplete="off">
				<label class="form-label mb-0" for="propName">Layer</label>
				<input type="text" class="form-control form-control-sm mb-2" id="propName" value="${escapeXml(layer.name)}">
				<div id="propFrameInfo" class="text-muted mb-1"></div>
				<fieldset id="propStateFields" class="row g-1 mb-2">
					${field(STATE_FIELDS[0], 'X')}
					${field(STATE_FIELDS[1], 'Y')}
					${field(STATE_FIELDS[2], 'Scale W', '%')}
					${field(STATE_FIELDS[3], 'Scale H', '%')}
					${field(STATE_FIELDS[4], 'Rotate', '°')}
					${field(STATE_FIELDS[5], 'Alpha', '%')}
				</fieldset>
				<div class="border-top pt-2">
					<div class="form-check form-switch mb-1">
						<input class="form-check-input" type="checkbox" id="propTween">
						<label class="form-check-label" for="propTween">Motion tween</label>
					</div>
					<label class="form-label mb-0 d-flex justify-content-between" for="propEase">
						<span>Ease</span><span id="propEaseValue" class="text-muted"></span>
					</label>
					<input type="range" class="form-range" id="propEase" min="-100" max="100" step="5">
					<div class="d-flex justify-content-between text-muted" style="font-size:0.7rem"><span>in</span><span>out</span></div>
				</div>
				<button type="button" class="btn btn-outline-secondary btn-sm w-100 mt-2" id="propDistribute" title="Put every object of this layer on its own layer">Distribute to Layers</button>
			</form>`;

		const form = document.getElementById('selectionForm');
		form.addEventListener('submit', (e) => e.preventDefault());
		document.getElementById('propName').addEventListener('change', (e) => model.renameLayer(layer.id, e.target.value.trim()));
		for (const [id, key, factor] of STATE_FIELDS) {
			document.getElementById(id).addEventListener('change', (e) => {
				let value = Number(e.target.value) / factor;
				if (!Number.isFinite(value)) return;
				if (key === 'alpha') value = Math.max(0, Math.min(1, value));
				model.setLayerProps(layer.id, { [key]: value });
			});
		}
		document.getElementById('propTween').addEventListener('change', (e) => model.setTween({ tween: e.target.checked }));
		const ease = document.getElementById('propEase');
		ease.addEventListener('input', () => { document.getElementById('propEaseValue').textContent = ease.value; });
		ease.addEventListener('change', () => model.setTween({ ease: Number(ease.value) }));
		document.getElementById('propDistribute').addEventListener('click', () => model.distributeToLayers(layer.id));

		this.refresh();
	}

	/** Update values for the current frame without rebuilding (runs during playback). */
	refresh() {
		const model = new Model();
		const layer = model.getLayer();
		const form = document.getElementById('selectionForm');
		if (!layer || !form || form.contains(document.activeElement)) return;

		const frame = model.currentFrame;
		const state = getLayerState(layer, frame);
		const kf = keyframeAt(layer, frame);
		const span = governingKeyframe(layer, frame);

		document.getElementById('propStateFields').disabled = !state || layer.locked;
		for (const [id, key, factor] of STATE_FIELDS) {
			document.getElementById(id).value = state ? Math.round(state[key] * factor * 100) / 100 : '';
		}

		let info = `Frame ${frame}: `;
		if (!state) info += 'no content here (F6 inserts a keyframe)';
		else if (kf) info += 'keyframe';
		else info += span?.tween ? 'tweened frame, edits add a keyframe' : 'held frame, edits add a keyframe';
		if (layer.locked) info += ' (locked)';
		document.getElementById('propFrameInfo').textContent = info;

		const tween = document.getElementById('propTween');
		const ease = document.getElementById('propEase');
		tween.disabled = ease.disabled = !span || span.blank;
		tween.checked = !!span?.tween;
		ease.value = span?.ease || 0;
		document.getElementById('propEaseValue').textContent = ease.value;
	}

	buildDocument() {
		const p = ProjectVars;
		const model = new Model();
		this.documentEl.innerHTML = `
			<form id="projectDetailsForm" class="small" autocomplete="off">
				<label class="form-label mb-0" for="docProjectName">Project name</label>
				<input type="text" class="form-control form-control-sm mb-1" id="docProjectName" value="${escapeXml(p.projectName)}">
				<label class="form-label mb-0" for="docExportName">File name</label>
				<input type="text" class="form-control form-control-sm mb-1" id="docExportName" value="${escapeXml(p.exportName)}">
				<div class="row g-1 mb-1">
					<div class="col-6"><label class="form-label mb-0" for="docWidth">W</label>
						<input type="number" min="1" class="form-control form-control-sm" id="docWidth" value="${p.width}"></div>
					<div class="col-6"><label class="form-label mb-0" for="docHeight">H</label>
						<input type="number" min="1" class="form-control form-control-sm" id="docHeight" value="${p.height}"></div>
					<div class="col-6"><label class="form-label mb-0" for="docFrameRate">FPS</label>
						<input type="number" min="1" class="form-control form-control-sm" id="docFrameRate" value="${p.frameRate}"></div>
					<div class="col-6"><label class="form-label mb-0" for="docFrameLength">Frames</label>
						<input type="number" min="1" class="form-control form-control-sm" id="docFrameLength" value="${p.frameLength}"></div>
				</div>
				<div class="d-flex align-items-center gap-2 mb-2">
					<label class="form-label mb-0" for="docBackground">Background</label>
					<input type="color" class="form-control form-control-sm form-control-color" id="docBackground" value="${escapeXml(p.background)}">
				</div>
				<button type="submit" class="btn btn-primary btn-sm w-100">Apply</button>
			</form>`;

		document.getElementById('projectDetailsForm').addEventListener('submit', (e) => {
			e.preventDefault();
			const v = (id) => document.getElementById(id).value;
			model.setDocument({
				projectName: v('docProjectName'),
				exportName: v('docExportName').trim().replace(/[\\/:*?"<>|]/g, '-') || 'spark-project',
				width: v('docWidth'),
				height: v('docHeight'),
				frameRate: v('docFrameRate'),
				frameLength: v('docFrameLength'),
				background: v('docBackground'),
			});
		});
	}
}

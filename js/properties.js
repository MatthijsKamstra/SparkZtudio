import { Model, ProjectVars } from './model/model.js';
import { escapeXml, getLayerState, governingKeyframe, keyframeAt, readLayerStyle } from './model/project.js';

// [input id, state key, display factor, step]
const STATE_FIELDS = [
	['propX', 'x', 1, 1],
	['propY', 'y', 1, 1],
	['propScaleX', 'sx', 100, 1],
	['propScaleY', 'sy', 100, 1],
	['propRotation', 'rot', 1, 1],
	['propAlpha', 'alpha', 100, 1],
];

/** Compact label + number input, half a row wide. */
const field = (id, label, step = 1) => `
	<div class="col-6">
		<div class="input-group input-group-sm prop-group">
			<span class="input-group-text">${label}</span>
			<input type="number" class="form-control" id="${id}" step="${step}">
		</div>
	</div>`;

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
			this.selectionEl.innerHTML = '<p class="text-muted prop-info mb-0">Select an object on the stage or a layer in the timeline.</p>';
			return;
		}
		const style = readLayerStyle(layer.content);
		this.selectionEl.innerHTML = `
			<form id="selectionForm" class="prop-form" autocomplete="off">
				<div class="input-group input-group-sm prop-group mb-1">
					<span class="input-group-text"><i class="bi bi-layers"></i></span>
					<input type="text" class="form-control" id="propName" value="${escapeXml(layer.name)}" title="Layer name">
					<button type="button" class="btn btn-outline-secondary" id="propDistribute" title="Put every object of this layer on its own layer"><i class="bi bi-distribute-vertical"></i></button>
				</div>
				<div id="propFrameInfo" class="prop-info text-muted mb-1"></div>
				<fieldset id="propStateFields" class="row g-1">
					${field('propX', 'X')}
					${field('propY', 'Y')}
					${field('propScaleX', 'W%')}
					${field('propScaleY', 'H%')}
					${field('propRotation', '↻°')}
					${field('propAlpha', 'A%')}
				</fieldset>
				${this.appearanceMarkup(style)}
				<div class="prop-divider d-flex align-items-center gap-2">
					<div class="form-check form-switch m-0">
						<input class="form-check-input" type="checkbox" id="propTween">
						<label class="form-check-label prop-info" for="propTween">Tween</label>
					</div>
					<input type="range" class="form-range flex-grow-1" id="propEase" min="-100" max="100" step="5" title="Ease: left is ease in, right is ease out">
					<span id="propEaseValue" class="text-muted prop-info" style="min-width:26px;text-align:right"></span>
				</div>
			</form>`;

		const el = (id) => document.getElementById(id);
		el('selectionForm').addEventListener('submit', (e) => e.preventDefault());
		el('propName').addEventListener('change', (e) => model.renameLayer(layer.id, e.target.value.trim()));
		el('propDistribute').addEventListener('click', () => model.distributeToLayers(layer.id));
		for (const [id, key, factor] of STATE_FIELDS) {
			el(id).addEventListener('change', (e) => {
				let value = Number(e.target.value) / factor;
				if (!Number.isFinite(value)) return;
				if (key === 'alpha') value = Math.max(0, Math.min(1, value));
				model.setLayerProps(layer.id, { [key]: value });
			});
		}
		el('propTween').addEventListener('change', (e) => model.setTween({ tween: e.target.checked }));
		const ease = el('propEase');
		ease.addEventListener('input', () => { el('propEaseValue').textContent = ease.value; });
		ease.addEventListener('change', () => model.setTween({ ease: Number(ease.value) }));

		this.bindAppearance(layer, style);
		this.refresh();
	}

	/** Fill, stroke, line width, font size and text content of the layer artwork. */
	appearanceMarkup(style) {
		if (!style) return '';
		const paint = (id, label, color, none) => `
			<div class="d-flex align-items-center gap-1">
				<span class="prop-info text-muted" style="width:34px">${label}</span>
				<input type="color" class="form-control form-control-sm form-control-color" id="${id}" value="${color}">
				<div class="form-check m-0">
					<input class="form-check-input" type="checkbox" id="${id}None" ${none ? 'checked' : ''}>
					<label class="form-check-label prop-info" for="${id}None">none</label>
				</div>
			</div>`;
		return `
			<div class="prop-divider">
				<div class="row g-1">
					${style.hasFill ? `<div class="col-12">${paint('propFill', 'Fill', style.fill, style.fillNone)}</div>` : ''}
					<div class="col-12">${paint('propStroke', 'Line', style.stroke, style.strokeNone)}</div>
					${field('propStrokeWidth', 'W', 0.5)}
					${style.isText ? field('propFontSize', 'Size', 1) : ''}
				</div>
				${style.text === null ? '' : `
				<div class="input-group input-group-sm prop-group mt-1">
					<span class="input-group-text"><i class="bi bi-fonts"></i></span>
					<input type="text" class="form-control" id="propText" value="${escapeXml(style.text)}" title="Text content">
				</div>`}
			</div>`;
	}

	bindAppearance(layer, style) {
		if (!style) return;
		const model = new Model();
		const el = (id) => document.getElementById(id);
		const bindPaint = (id, key) => {
			const color = el(id);
			const none = el(`${id}None`);
			if (!color) return;
			const apply = () => {
				color.disabled = none.checked;
				model.setLayerStyle(layer.id, { [key]: none.checked ? 'none' : color.value });
			};
			color.addEventListener('change', apply);
			none.addEventListener('change', apply);
			color.disabled = none.checked;
		};
		bindPaint('propFill', 'fill');
		bindPaint('propStroke', 'stroke');

		const width = el('propStrokeWidth');
		width.value = style.strokeWidth;
		width.addEventListener('change', () => model.setLayerStyle(layer.id, { strokeWidth: Math.max(0, Number(width.value) || 0) }));

		const size = el('propFontSize');
		if (size) {
			size.value = style.fontSize;
			size.addEventListener('change', () => {
				const v = Number(size.value);
				if (v > 0) model.setLayerStyle(layer.id, { fontSize: v });
			});
		}
		el('propText')?.addEventListener('change', (e) => model.setLayerText(layer.id, e.target.value));
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
		if (!state) info += 'empty (F6 inserts a keyframe)';
		else if (kf) info += 'keyframe';
		else info += span?.tween ? 'tweened, edits add a keyframe' : 'held, edits add a keyframe';
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
			<form id="projectDetailsForm" class="prop-form" autocomplete="off">
				<div class="input-group input-group-sm prop-group mb-1">
					<span class="input-group-text">Name</span>
					<input type="text" class="form-control" id="docProjectName" value="${escapeXml(p.projectName)}">
				</div>
				<div class="input-group input-group-sm prop-group mb-1">
					<span class="input-group-text">File</span>
					<input type="text" class="form-control" id="docExportName" value="${escapeXml(p.exportName)}">
				</div>
				<div class="row g-1">
					${field('docWidth', 'W')}
					${field('docHeight', 'H')}
					${field('docFrameRate', 'FPS')}
					${field('docFrameLength', '#')}
					<div class="col-6">
						<div class="input-group input-group-sm prop-group">
							<span class="input-group-text">BG</span>
							<input type="color" class="form-control form-control-color" id="docBackground" value="${escapeXml(p.background)}">
						</div>
					</div>
					<div class="col-6"><button type="submit" class="btn btn-primary btn-sm w-100">Apply</button></div>
				</div>
			</form>`;

		const v = (id) => document.getElementById(id);
		v('docWidth').value = p.width;
		v('docHeight').value = p.height;
		v('docFrameRate').value = p.frameRate;
		v('docFrameLength').value = p.frameLength;

		document.getElementById('projectDetailsForm').addEventListener('submit', (e) => {
			e.preventDefault();
			model.setDocument({
				projectName: v('docProjectName').value,
				exportName: v('docExportName').value.trim().replace(/[\\/:*?"<>|]/g, '-') || 'spark-project',
				width: v('docWidth').value,
				height: v('docHeight').value,
				frameRate: v('docFrameRate').value,
				frameLength: v('docFrameLength').value,
				background: v('docBackground').value,
			});
		});
	}
}

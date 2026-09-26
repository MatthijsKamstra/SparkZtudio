import { Model, ProjectVars } from './model/model.js';
import { escapeXml } from './model/project.js';

const TYPE_ICONS = {
	rect: 'bi-square', circle: 'bi-circle', ellipse: 'bi-circle', text: 'bi-fonts', image: 'bi-image',
	path: 'bi-vector-pen', line: 'bi-slash-lg', polyline: 'bi-slash-lg', polygon: 'bi-pentagon', g: 'bi-collection', use: 'bi-link',
};

/** Flash-style timeline: one row per layer (top row = front), one column per frame. */
export class Timeline {

	IS_DEBUG = false;

	scrubbing = false;

	constructor() {
		if (Timeline.instance) return Timeline.instance;
		Timeline.instance = this;
	}

	init() {
		this.table = document.querySelector('#timelineWrapper table');
		this.headerRow = this.table.querySelector('thead tr');
		this.tbody = document.getElementById('timelineTableBody');
		this.scroll = document.querySelector('#timelineWrapper .timeline-scroll');
		const model = new Model();

		const on = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);
		on('tlAddLayer', () => model.addLayer());
		on('tlDeleteLayer', () => model.deleteLayer());
		on('tlLayerUp', () => model.moveLayer(-1));
		on('tlLayerDown', () => model.moveLayer(1));
		on('tlInsertKeyframe', () => model.insertKeyframe());
		on('tlBlankKeyframe', () => model.insertKeyframe({ blank: true }));
		on('tlClearKeyframe', () => model.clearKeyframe());
		on('tlToggleTween', () => model.toggleTween());

		document.getElementById('timelineFrameRate').addEventListener('change', (e) => model.setDocument({ frameRate: e.target.value }));
		document.getElementById('timeLineTotalFrames').addEventListener('change', (e) => model.setDocument({ frameLength: e.target.value }));

		this.table.addEventListener('pointerdown', (e) => this.onPointerDown(e));
		window.addEventListener('pointermove', (e) => this.onPointerMove(e));
		window.addEventListener('pointerup', () => { this.scrubbing = false; });
		this.tbody.addEventListener('dblclick', (e) => {
			const cell = e.target.closest('.tl-label');
			if (cell) this.startRename(cell);
		});
	}

	build() {
		const p = ProjectVars;
		const model = new Model();
		const total = p.frameLength;

		this.headerRow.querySelectorAll('.frame-num-th').forEach((th) => th.remove());
		let header = '';
		for (let f = 1; f <= total; f++) header += `<th class="frame-num-th" data-frame="${f}">${f === 1 || f % 5 === 0 ? f : ''}</th>`;
		this.headerRow.insertAdjacentHTML('beforeend', header);

		this.tbody.innerHTML = p.layers.map((layer) => this.rowMarkup(layer, total, layer.id === model.selectedLayerId)).join('');

		document.getElementById('timelineFrameRate').value = p.frameRate;
		document.getElementById('timeLineTotalFrames').value = total;
		document.getElementById('timeLineTotalTime').value = (total / p.frameRate).toFixed(2);

		this.updatePlayhead();
	}

	rowMarkup(layer, total, selected) {
		const id = escapeXml(layer.id);
		const tag = (/<\s*([a-zA-Z]+)/.exec(layer.content) || [])[1];
		const icon = TYPE_ICONS[tag] || 'bi-layers';
		let cells = '';
		const kfs = layer.keyframes;
		let ki = -1;
		for (let f = 1; f <= total; f++) {
			while (ki + 1 < kfs.length && kfs[ki + 1].frame <= f) ki++;
			const kf = kfs[ki];
			const next = kfs[ki + 1];
			let cls = 'kf-cell';
			let inner = '';
			if (!kf || kf.blank) {
				if (kf && kf.frame === f) { cls += ' kf-cell--key kf-cell--blank'; inner = '○'; }
				else if (f % 5 === 0) cls += ' kf-cell--band';
			} else {
				const tweening = kf.tween && next && !next.blank;
				cls += tweening ? ' kf-cell--tween' : ' kf-cell--hold';
				if (kf.frame === f) { cls += ' kf-cell--key'; inner = '●'; }
				else if (!tweening && f === (next ? next.frame - 1 : total)) cls += ' kf-cell--end';
			}
			cells += `<td class="${cls}" data-frame="${f}">${inner}</td>`;
		}
		return `<tr data-layer-id="${id}" class="${selected ? 'tl-row--selected' : ''}">` +
			`<td class="tl-fixed text-center"><i class="bi ${layer.visible ? 'bi-eye' : 'bi-eye-slash'} tl-icon" data-action="visible" title="Show/hide layer"></i></td>` +
			`<td class="tl-fixed text-center"><i class="bi ${layer.locked ? 'bi-lock-fill' : 'bi-unlock'} tl-icon" data-action="locked" title="Lock/unlock layer"></i></td>` +
			`<td class="tl-fixed text-center"><i class="bi ${icon} tl-icon"></i></td>` +
			`<td class="tl-fixed tl-label text-nowrap" title="${escapeXml(layer.name)} (double-click to rename)">${escapeXml(layer.name)}</td>` +
			`${cells}</tr>`;
	}

	updatePlayhead() {
		const frame = new Model().currentFrame;
		this.table.querySelectorAll('.tl-current').forEach((el) => el.classList.remove('tl-current'));
		this.table.querySelectorAll(`[data-frame="${frame}"]`).forEach((el) => el.classList.add('tl-current'));

		const th = this.headerRow.querySelector(`[data-frame="${frame}"]`);
		if (!th) return;
		const fixedWidth = Array.from(this.headerRow.querySelectorAll('.tl-fixed')).reduce((w, el) => w + el.offsetWidth, 0);
		const left = th.offsetLeft;
		if (left < this.scroll.scrollLeft + fixedWidth) this.scroll.scrollLeft = left - fixedWidth;
		else if (left + th.offsetWidth > this.scroll.scrollLeft + this.scroll.clientWidth) this.scroll.scrollLeft = left + th.offsetWidth - this.scroll.clientWidth;
	}

	updateSelection() {
		const id = new Model().selectedLayerId;
		this.tbody.querySelectorAll('tr').forEach((tr) => tr.classList.toggle('tl-row--selected', tr.dataset.layerId === id));
	}

	onPointerDown(e) {
		if (e.button !== 0) return;
		const model = new Model();
		const row = e.target.closest('tr[data-layer-id]');
		const action = e.target.dataset.action;
		if (row && action) {
			model.toggleLayerFlag(row.dataset.layerId, action);
			return;
		}
		if (row) model.select(row.dataset.layerId);
		const frameEl = e.target.closest('[data-frame]');
		if (frameEl) {
			e.preventDefault();
			model.stop();
			model.setFrame(Number(frameEl.dataset.frame));
			this.scrubbing = true;
		}
	}

	onPointerMove(e) {
		if (!this.scrubbing) return;
		const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('#timelineWrapper [data-frame]');
		if (el) new Model().setFrame(Number(el.dataset.frame));
	}

	startRename(cell) {
		const id = cell.closest('tr').dataset.layerId;
		const layer = new Model().getLayer(id);
		if (!layer) return;
		const input = document.createElement('input');
		input.type = 'text';
		input.value = layer.name;
		input.className = 'tl-label-input';
		cell.textContent = '';
		cell.appendChild(input);
		input.focus();
		input.select();
		let done = false;
		const finish = (save) => {
			if (done) return;
			done = true;
			const name = input.value.trim();
			if (save && name && name !== layer.name) new Model().renameLayer(id, name);
			else this.build();
		};
		input.addEventListener('blur', () => finish(true));
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') finish(true);
			if (e.key === 'Escape') finish(false);
			e.stopPropagation();
		});
	}
}

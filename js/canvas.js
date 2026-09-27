import { CanvasMenu } from './canvas-menu.js';
import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';
import { escapeXml, getLayerState, layerTransform, readLayerStyle, SVG_NS } from './model/project.js';
import { Tools } from './tools.js';

/** Scale handles: fx/fy are the position on the bounding box, the anchor is the opposite corner. */
const HANDLES = [
	{ id: 'nw', fx: 0, fy: 0, cursor: 'nwse-resize' },
	{ id: 'n', fx: 0.5, fy: 0, cursor: 'ns-resize' },
	{ id: 'ne', fx: 1, fy: 0, cursor: 'nesw-resize' },
	{ id: 'e', fx: 1, fy: 0.5, cursor: 'ew-resize' },
	{ id: 'se', fx: 1, fy: 1, cursor: 'nwse-resize' },
	{ id: 's', fx: 0.5, fy: 1, cursor: 'ns-resize' },
	{ id: 'sw', fx: 0, fy: 1, cursor: 'nesw-resize' },
	{ id: 'w', fx: 0, fy: 0.5, cursor: 'ew-resize' },
];

const rotatePoint = (p, deg) => {
	const a = (deg * Math.PI) / 180;
	const c = Math.cos(a);
	const s = Math.sin(a);
	return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
};

/** The stage: renders the current frame and handles select/move/scale/rotate and the drawing tools. */
export class Canvas {

	IS_DEBUG = false;

	stage = null;
	layerGroups = new Map();
	drag = null;
	textEditor = null;

	constructor() {
		if (Canvas.instance) return Canvas.instance;
		Canvas.instance = this;
	}

	init() {
		this.container = document.getElementById(Globals.svgContainerID);
		this.container.addEventListener('pointerdown', (e) => this.onPointerDown(e));
		this.container.addEventListener('dblclick', (e) => this.onDoubleClick(e));
		window.addEventListener('pointermove', (e) => this.onPointerMove(e));
		window.addEventListener('pointerup', (e) => this.onPointerUp(e));
	}

	/** Rebuild the stage DOM from ProjectVars (after structural changes). */
	build() {
		const p = ProjectVars;
		const [vx, vy, vw, vh] = p.viewBox;
		const layers = [...p.layers].reverse()
			.map((l) => `<g class="spark-layer" data-layer-id="${escapeXml(l.id)}">${l.content}</g>`)
			.join('');
		this.container.innerHTML =
			`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${p.width}" height="${p.height}" viewBox="${vx} ${vy} ${vw} ${vh}" style="display:block">` +
			`${p.defs}<rect class="spark-bg" x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${escapeXml(p.background)}"/>` +
			`<g class="spark-layers">${layers}</g><g class="spark-overlay" pointer-events="none"></g></svg>`;

		this.stage = this.container.querySelector('svg');
		this.layerGroups.clear();
		this.stage.querySelectorAll('.spark-layer').forEach((g) => this.layerGroups.set(g.dataset.layerId, g));

		// Pivot (registration point) defaults to the centre of the content.
		for (const layer of p.layers) {
			if (layer.cx != null && layer.cy != null) continue;
			const g = this.layerGroups.get(layer.id);
			const box = g ? g.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
			layer.cx = Math.round((box.x + box.width / 2) * 1000) / 1000;
			layer.cy = Math.round((box.y + box.height / 2) * 1000) / 1000;
		}

		this.render();
		new CanvasMenu().fitIfTooLarge();
	}

	/** Apply the interpolated state of every layer for the current frame. */
	render() {
		if (!this.stage) return;
		const frame = new Model().currentFrame;
		for (const layer of ProjectVars.layers) {
			const g = this.layerGroups.get(layer.id);
			if (!g) continue;
			const s = layer.visible ? getLayerState(layer, frame) : null;
			if (!s) {
				g.setAttribute('display', 'none');
				continue;
			}
			g.removeAttribute('display');
			g.setAttribute('transform', layerTransform(layer, s));
			g.setAttribute('opacity', Math.round(s.alpha * 1000) / 1000);
			g.classList.toggle('spark-layer--locked', layer.locked);
		}
		this.updateSelection();
	}

	updateSelection() {
		if (!this.stage) return;
		const overlay = this.stage.querySelector('.spark-overlay');
		overlay.querySelector('.spark-selection')?.remove();
		const model = new Model();
		const layer = model.getLayer();
		const g = layer && this.layerGroups.get(layer.id);
		if (!g || g.getAttribute('display') === 'none') return;
		const state = this.drag?.current || getLayerState(layer, model.currentFrame);
		if (!state) return;
		const box = g.getBBox();
		if (!box.width && !box.height) return;

		const group = document.createElementNS(SVG_NS, 'g');
		group.setAttribute('class', 'spark-selection');
		group.setAttribute('transform', layerTransform(layer, state));
		const r = (n) => Math.round(n * 1000) / 1000;
		let markup = `<rect class="spark-outline" x="${r(box.x)}" y="${r(box.y)}" width="${r(box.width)}" height="${r(box.height)}"/>`;

		// Handles keep a constant screen size, so undo the layer scale and the stage zoom.
		if (!layer.locked && new Tools().current === 'select') {
			const px = this.pixelSize();
			const hw = (8 * px) / Math.max(0.01, Math.abs(state.sx));
			const hh = (8 * px) / Math.max(0.01, Math.abs(state.sy));
			for (const h of HANDLES) {
				const cx = box.x + box.width * h.fx;
				const cy = box.y + box.height * h.fy;
				markup += `<rect class="spark-handle" data-handle="${h.id}" style="cursor:${h.cursor}" x="${r(cx - hw / 2)}" y="${r(cy - hh / 2)}" width="${r(hw)}" height="${r(hh)}"/>`;
			}
			const mx = box.x + box.width / 2;
			const my = box.y - hh * 2.5;
			markup += `<line class="spark-outline" x1="${r(mx)}" y1="${r(box.y)}" x2="${r(mx)}" y2="${r(my)}"/>`;
			markup += `<ellipse class="spark-handle spark-handle--rotate" data-handle="rotate" cx="${r(mx)}" cy="${r(my)}" rx="${r(hw * 0.6)}" ry="${r(hh * 0.6)}"/>`;
			markup += `<circle class="spark-pivot" cx="${r(layer.cx || 0)}" cy="${r(layer.cy || 0)}" r="${r(Math.min(hw, hh) * 0.4)}"/>`;
		}
		group.innerHTML = markup;
		overlay.appendChild(group);
	}

	// ____________________________________ coordinates ____________________________________

	/** Client (screen) coordinates to stage (viewBox) coordinates; works with CSS zoom. */
	toStage(clientX, clientY) {
		const r = this.stage.getBoundingClientRect();
		const [vx, vy, vw, vh] = ProjectVars.viewBox;
		const scale = Math.min(r.width / vw, r.height / vh);
		const offsetX = (r.width - vw * scale) / 2;
		const offsetY = (r.height - vh * scale) / 2;
		return { x: vx + (clientX - r.left - offsetX) / scale, y: vy + (clientY - r.top - offsetY) / scale };
	}

	/** Stage (viewBox) coordinates back to client (screen) coordinates. */
	toClient(x, y) {
		const r = this.stage.getBoundingClientRect();
		const [vx, vy, vw, vh] = ProjectVars.viewBox;
		const scale = Math.min(r.width / vw, r.height / vh);
		const offsetX = (r.width - vw * scale) / 2;
		const offsetY = (r.height - vh * scale) / 2;
		return { x: r.left + offsetX + (x - vx) * scale, y: r.top + offsetY + (y - vy) * scale };
	}

	boxInStage(el) {
		const r = el.getBoundingClientRect();
		const a = this.toStage(r.left, r.top);
		const b = this.toStage(r.right, r.bottom);
		return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y };
	}

	/** Stage units per screen pixel at the current zoom. */
	pixelSize() {
		const a = this.toStage(0, 0);
		const b = this.toStage(1, 0);
		return Math.abs(b.x - a.x) || this.unit();
	}

	/** Stage units per screen pixel at 100% zoom. */
	unit() {
		return ProjectVars.viewBox[2] / ProjectVars.width;
	}

	// ____________________________________ pointer ____________________________________

	onPointerDown(e) {
		if (e.button !== 0 || !this.stage) return;
		const model = new Model();
		const tool = new Tools().current;
		model.stop();
		this.closeTextEditor(true);

		if (tool === 'zoom') {
			if (e.altKey) new CanvasMenu().zoomOut();
			else new CanvasMenu().zoomIn();
			return;
		}

		const start = this.toStage(e.clientX, e.clientY);

		if (tool === 'select') {
			const handle = e.target.closest('[data-handle]')?.dataset.handle;
			if (handle && this.startTransform(handle, start)) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
			const g = e.target.closest('.spark-layer');
			const layer = g && model.getLayer(g.dataset.layerId);
			if (!layer || layer.locked) {
				model.select(null);
				return;
			}
			model.select(layer.id);
			const state = getLayerState(layer, model.currentFrame);
			if (state) this.drag = { mode: 'move', layer, g, start, state, clientX: e.clientX, clientY: e.clientY, moved: false };
			return;
		}

		e.preventDefault();
		if (tool === 'text') {
			this.openTextEditor({ point: start });
			return;
		}
		this.drag = { mode: 'draw', tool, start };
	}

	/** Prepare a scale or rotate drag around the layer pivot; false when nothing is selected. */
	startTransform(handle, start) {
		const model = new Model();
		const layer = model.getLayer();
		const g = layer && this.layerGroups.get(layer.id);
		const state = g && getLayerState(layer, model.currentFrame);
		if (!state || layer.locked) return false;

		const pivot = { x: state.x + (layer.cx || 0), y: state.y + (layer.cy || 0) };
		if (handle === 'rotate') {
			const angle = (Math.atan2(start.y - pivot.y, start.x - pivot.x) * 180) / Math.PI;
			this.drag = { mode: 'rotate', layer, g, state, pivot, offset: angle - state.rot };
			return true;
		}

		const spec = HANDLES.find((h) => h.id === handle);
		if (!spec) return false;
		const box = g.getBBox();
		const c = { x: layer.cx || 0, y: layer.cy || 0 };
		const point = { x: box.x + box.width * spec.fx, y: box.y + box.height * spec.fy };
		const anchor = { x: box.x + box.width * (1 - spec.fx), y: box.y + box.height * (1 - spec.fy) };
		const offset = rotatePoint({ x: (anchor.x - c.x) * state.sx, y: (anchor.y - c.y) * state.sy }, state.rot);
		this.drag = {
			mode: 'scale', layer, g, state, c, point, anchor,
			anchorStage: { x: state.x + c.x + offset.x, y: state.y + c.y + offset.y },
		};
		return true;
	}

	onPointerMove(e) {
		const d = this.drag;
		if (!d) return;
		const pt = this.toStage(e.clientX, e.clientY);

		if (d.mode === 'move') {
			if (!d.moved && Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) < 3) return;
			d.moved = true;
			let dx = pt.x - d.start.x;
			let dy = pt.y - d.start.y;
			if (e.shiftKey) {
				if (Math.abs(dx) > Math.abs(dy)) dy = 0;
				else dx = 0;
			}
			d.current = { ...d.state, x: d.state.x + dx, y: d.state.y + dy };
			d.g.setAttribute('transform', layerTransform(d.layer, d.current));
			this.updateSelection();
			return;
		}

		if (d.mode === 'rotate') {
			let rot = (Math.atan2(pt.y - d.pivot.y, pt.x - d.pivot.x) * 180) / Math.PI - d.offset;
			if (e.shiftKey) rot = Math.round(rot / 15) * 15;
			d.current = { ...d.state, rot };
			d.g.setAttribute('transform', layerTransform(d.layer, d.current));
			this.updateSelection();
			return;
		}

		if (d.mode === 'scale') {
			d.current = this.scaledState(d, pt, e.shiftKey);
			d.g.setAttribute('transform', layerTransform(d.layer, d.current));
			this.updateSelection();
			return;
		}

		const overlay = this.stage.querySelector('.spark-overlay');
		let preview = overlay.querySelector('.spark-draw');
		if (!preview) {
			preview = document.createElementNS(SVG_NS, 'g');
			preview.setAttribute('class', 'spark-draw');
			overlay.appendChild(preview);
		}
		preview.innerHTML = this.shapeMarkup(d.tool, d.start, pt) || '';
	}

	/**
	 * New scale plus the x/y correction that keeps the opposite corner (the anchor) in place.
	 * Everything is solved in the layer's unrotated space, so rotated objects scale correctly.
	 */
	scaledState(d, pt, proportional) {
		const s = d.state;
		const v = rotatePoint({ x: pt.x - d.anchorStage.x, y: pt.y - d.anchorStage.y }, -s.rot);
		const dx = d.point.x - d.anchor.x;
		const dy = d.point.y - d.anchor.y;
		const clamp = (n) => (Math.abs(n) < 0.01 ? (n < 0 ? -0.01 : 0.01) : n);
		let sx = Math.abs(dx) > 1e-6 ? clamp(v.x / dx) : s.sx;
		let sy = Math.abs(dy) > 1e-6 ? clamp(v.y / dy) : s.sy;
		if (proportional && Math.abs(dx) > 1e-6 && Math.abs(dy) > 1e-6) {
			const rx = sx / s.sx;
			const ry = sy / s.sy;
			const k = Math.abs(rx) > Math.abs(ry) ? rx : ry;
			sx = clamp(s.sx * k);
			sy = clamp(s.sy * k);
		}
		const before = rotatePoint({ x: (d.anchor.x - d.c.x) * s.sx, y: (d.anchor.y - d.c.y) * s.sy }, s.rot);
		const after = rotatePoint({ x: (d.anchor.x - d.c.x) * sx, y: (d.anchor.y - d.c.y) * sy }, s.rot);
		return { ...s, sx, sy, x: s.x + before.x - after.x, y: s.y + before.y - after.y };
	}

	onPointerUp(e) {
		const d = this.drag;
		this.drag = null;
		if (!d) return;
		const model = new Model();

		if (d.mode === 'move') {
			if (d.moved) model.setLayerProps(d.layer.id, { x: d.current.x, y: d.current.y });
			return;
		}
		if (d.mode === 'rotate' || d.mode === 'scale') {
			if (d.current) model.setLayerProps(d.layer.id, d.current);
			else this.updateSelection();
			return;
		}

		this.stage.querySelector('.spark-draw')?.remove();
		const markup = this.shapeMarkup(d.tool, d.start, this.toStage(e.clientX, e.clientY));
		if (markup) model.addShape({ rect: 'Rectangle', ellipse: 'Oval', line: 'Line' }[d.tool] || 'Shape', markup);
	}

	onDoubleClick(e) {
		if (new Tools().current !== 'select') return;
		const g = e.target.closest('.spark-layer');
		const layer = g && new Model().getLayer(g.dataset.layerId);
		if (!layer || layer.locked) return;
		const style = readLayerStyle(layer.content);
		if (!style || style.text === null) return;
		e.preventDefault();
		this.openTextEditor({ layer });
	}

	// ____________________________________ text editing ____________________________________

	/** In-place editor: a plain input over the stage, for a new text object or an existing text layer. */
	openTextEditor({ point = null, layer = null } = {}) {
		this.closeTextEditor(false);
		const wrapper = document.getElementById('svgWrapper');
		if (!wrapper) return;

		let anchor = point;
		if (layer) {
			const g = this.layerGroups.get(layer.id);
			const rect = g?.getBoundingClientRect();
			if (!rect) return;
			anchor = this.toStage(rect.left, rect.bottom);
		}
		const client = this.toClient(anchor.x, anchor.y);
		const wrapperRect = wrapper.getBoundingClientRect();

		const input = document.createElement('input');
		input.type = 'text';
		input.className = 'spark-text-input';
		input.value = layer ? readLayerStyle(layer.content)?.text || '' : '';
		input.placeholder = 'Type text, Enter to confirm';
		input.style.left = `${client.x - wrapperRect.left}px`;
		input.style.top = `${client.y - wrapperRect.top - 24}px`;
		wrapper.appendChild(input);
		this.textEditor = { input, layer, point: anchor };

		input.addEventListener('keydown', (ev) => {
			ev.stopPropagation();
			if (ev.key === 'Enter') this.closeTextEditor(true);
			if (ev.key === 'Escape') this.closeTextEditor(false);
		});
		input.addEventListener('blur', () => this.closeTextEditor(true));
		input.focus();
		input.select();
	}

	closeTextEditor(commit) {
		const editor = this.textEditor;
		if (!editor) return;
		this.textEditor = null;
		const value = editor.input.value.trim();
		editor.input.remove();
		if (!commit) return;
		const model = new Model();
		if (editor.layer) {
			model.setLayerText(editor.layer.id, value);
			return;
		}
		if (!value) return;
		const t = new Tools();
		const size = Math.round(32 * this.unit() * 100) / 100;
		model.addShape('Text', `<text x="${Math.round(editor.point.x * 100) / 100}" y="${Math.round(editor.point.y * 100) / 100}" font-family="Arial, sans-serif" font-size="${size}" fill="${t.fillColor}">${escapeXml(value)}</text>`);
	}

	shapeMarkup(tool, a, b) {
		const t = new Tools();
		const r = (n) => Math.round(n * 100) / 100;
		const minSize = 2 * this.unit();
		const strokeWidth = r(t.strokeWidth * this.unit());
		const x = r(Math.min(a.x, b.x));
		const y = r(Math.min(a.y, b.y));
		const w = r(Math.abs(b.x - a.x));
		const h = r(Math.abs(b.y - a.y));
		const paint = `fill="${t.fillColor}" stroke="${t.strokeColor}" stroke-width="${strokeWidth}"`;
		switch (tool) {
			case 'rect':
				return w < minSize && h < minSize ? null : `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${paint}/>`;
			case 'ellipse':
				return w < minSize && h < minSize ? null : `<ellipse cx="${r(x + w / 2)}" cy="${r(y + h / 2)}" rx="${r(w / 2)}" ry="${r(h / 2)}" ${paint}/>`;
			case 'line':
				return w < minSize && h < minSize ? null : `<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="${t.strokeColor}" stroke-width="${r((t.strokeWidth || 2) * this.unit())}" stroke-linecap="round"/>`;
			default:
				return null;
		}
	}

	/** Arrow keys: nudge the selected layer by one (or ten with Shift) screen pixels. */
	nudge(dx, dy) {
		const model = new Model();
		const layer = model.getLayer();
		if (!layer || layer.locked) return;
		const state = getLayerState(layer, model.currentFrame);
		if (!state) return;
		const u = this.unit();
		model.setLayerProps(layer.id, { x: state.x + dx * u, y: state.y + dy * u });
	}
}

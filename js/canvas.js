import { CanvasMenu } from './canvas-menu.js';
import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';
import { escapeXml, getLayerState, layerTransform } from './model/project.js';
import { Tools } from './tools.js';

/** The stage: renders the current frame and handles select/move and the drawing tools. */
export class Canvas {

	IS_DEBUG = false;

	stage = null;
	layerGroups = new Map();
	drag = null;

	constructor() {
		if (Canvas.instance) return Canvas.instance;
		Canvas.instance = this;
	}

	init() {
		this.container = document.getElementById(Globals.svgContainerID);
		this.container.addEventListener('pointerdown', (e) => this.onPointerDown(e));
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
		const g = this.layerGroups.get(new Model().selectedLayerId);
		if (!g || g.getAttribute('display') === 'none') return;
		const box = this.boxInStage(g);
		if (!box.width && !box.height) return;
		const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.setAttribute('class', 'spark-selection');
		for (const [k, v] of Object.entries(box)) rect.setAttribute(k, v);
		overlay.appendChild(rect);
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

	boxInStage(el) {
		const r = el.getBoundingClientRect();
		const a = this.toStage(r.left, r.top);
		const b = this.toStage(r.right, r.bottom);
		return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y };
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

		if (tool === 'zoom') {
			if (e.altKey) new CanvasMenu().zoomOut();
			else new CanvasMenu().zoomIn();
			return;
		}

		const start = this.toStage(e.clientX, e.clientY);
		e.preventDefault();

		if (tool === 'select') {
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

		this.drag = { mode: 'draw', tool, start };
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

		if (d.tool !== 'text') {
			const overlay = this.stage.querySelector('.spark-overlay');
			let preview = overlay.querySelector('.spark-draw');
			if (!preview) {
				preview = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				preview.setAttribute('class', 'spark-draw');
				overlay.appendChild(preview);
			}
			preview.innerHTML = this.shapeMarkup(d.tool, d.start, pt) || '';
		}
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

		this.stage.querySelector('.spark-draw')?.remove();
		if (d.tool === 'text') {
			const text = prompt('Text:');
			if (!text) return;
			const t = new Tools();
			const size = Math.round(32 * this.unit() * 100) / 100;
			model.addShape('Text', `<text x="${d.start.x}" y="${d.start.y}" font-family="Arial, sans-serif" font-size="${size}" fill="${t.fillColor}">${escapeXml(text)}</text>`);
			return;
		}
		const markup = this.shapeMarkup(d.tool, d.start, this.toStage(e.clientX, e.clientY));
		if (markup) model.addShape({ rect: 'Rectangle', ellipse: 'Oval', line: 'Line' }[d.tool] || 'Shape', markup);
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

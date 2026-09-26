// Spark project format v2: Flash-style layers, each with keyframes that carry a motion-tween state.
// Pure data functions (DOMParser only), shared by the editor and the video exporter.

export const FORMAT_VERSION = 2;
export const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const INKSCAPE_NS = 'http://www.inkscape.org/namespaces/inkscape';

export const DEFAULT_STATE = { x: 0, y: 0, sx: 1, sy: 1, rot: 0, alpha: 1 };
export const STATE_KEYS = Object.keys(DEFAULT_STATE);

let idCounter = 0;
export function newId(prefix = 'layer') {
	return `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;
}

const round = (n) => Math.round(n * 1000) / 1000;
const num = (v, fallback) => (v !== null && v !== '' && Number.isFinite(+v) ? +v : fallback);

export function escapeXml(value) {
	return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ____________________________________ creation ____________________________________

export function createProject(opts = {}) {
	const width = Math.round(num(opts.width, 600));
	const height = Math.round(num(opts.height, 400));
	const viewBox = Array.isArray(opts.viewBox) && opts.viewBox.length === 4 && opts.viewBox.every(Number.isFinite)
		? opts.viewBox.map(Number)
		: [0, 0, width, height];
	return {
		format: FORMAT_VERSION,
		exportName: String(opts.exportName || 'spark-project'),
		projectName: String(opts.projectName || 'Spark Project'),
		description: String(opts.description || ''),
		creationDate: opts.creationDate || new Date().toISOString(),
		width,
		height,
		viewBox,
		background: /^#[0-9a-f]{3,8}$/i.test(opts.background) ? opts.background : '#ffffff',
		frameRate: Math.max(1, Math.round(num(opts.frameRate, 24))),
		frameLength: Math.max(1, Math.round(num(opts.frameLength, 48))),
		defs: opts.defs || '',
		layers: opts.layers || [createLayer({ name: 'Layer 1' })],
	};
}

export function createLayer({ name = 'Layer', content = '', frame = 1, state = {}, cx = null, cy = null } = {}) {
	return { id: newId(), name, visible: true, locked: false, content, cx, cy, keyframes: [createKeyframe(frame, state)] };
}

export function createKeyframe(frame, state = {}, extra = {}) {
	return { frame, ...DEFAULT_STATE, ...pickState(state), tween: false, ease: 0, blank: false, ...extra };
}

/** Only the animatable keys that are present and numeric. */
export function pickState(source = {}) {
	const out = {};
	for (const key of STATE_KEYS) {
		const v = num(source[key], null);
		if (v !== null) out[key] = v;
	}
	return out;
}

/** Demo project: the MVP from FINDINGS.md, a box tweening from x=0 to x=400. */
export function createDemoProject() {
	const project = createProject({ exportName: 'spark-demo', projectName: 'Spark Demo', frameLength: 48, layers: [] });
	const title = createLayer({ name: 'Title', content: '<text x="300" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#333333">Spark Studio</text>' });
	const box = createLayer({ name: 'Box', content: '<rect x="40" y="170" width="80" height="80" rx="8" fill="#ff5a36"/>' });
	box.keyframes[0].tween = true;
	box.keyframes[0].ease = 50;
	box.keyframes.push(createKeyframe(48, { x: 400, rot: 180 }));
	project.layers = [title, box];
	return project;
}

// ____________________________________ animation ____________________________________

export function sortKeyframes(layer) {
	layer.keyframes.sort((a, b) => a.frame - b.frame);
}

export function keyframeAt(layer, frame) {
	return layer.keyframes.find((k) => k.frame === frame) || null;
}

/** The keyframe that controls `frame` (last keyframe at or before it). */
export function governingKeyframe(layer, frame) {
	let found = null;
	for (const k of layer.keyframes) {
		if (k.frame <= frame) found = k;
		else break;
	}
	return found;
}

export function nextKeyframe(layer, kf) {
	const i = layer.keyframes.indexOf(kf);
	return i >= 0 ? layer.keyframes[i + 1] || null : null;
}

/** Flash-style ease: -100 = ease in, 100 = ease out. */
export function applyEase(t, ease = 0) {
	const e = Math.max(-1, Math.min(1, ease / 100));
	if (e > 0) return t + e * (t * (2 - t) - t);
	if (e < 0) return t - e * (t * t - t);
	return t;
}

/** Interpolated state of a layer at `frame`, or null when the layer shows nothing there. */
export function getLayerState(layer, frame) {
	const a = governingKeyframe(layer, frame);
	if (!a || a.blank) return null;
	const b = nextKeyframe(layer, a);
	if (!a.tween || !b || b.blank || frame === a.frame) return { ...DEFAULT_STATE, ...pickState(a) };
	const t = applyEase((frame - a.frame) / (b.frame - a.frame), a.ease);
	const state = {};
	for (const key of STATE_KEYS) state[key] = a[key] + (b[key] - a[key]) * t;
	return state;
}

/** Rotation and scale happen around the layer pivot (cx, cy), like a Flash registration point. */
export function layerTransform(layer, s) {
	const cx = layer.cx || 0;
	const cy = layer.cy || 0;
	return `translate(${round(s.x + cx)} ${round(s.y + cy)}) rotate(${round(s.rot)}) scale(${round(s.sx)} ${round(s.sy)}) translate(${round(-cx)} ${round(-cy)})`;
}

export function lastFrameWithKeyframe(project) {
	return project.layers.reduce((max, l) => Math.max(max, ...l.keyframes.map((k) => k.frame)), 1);
}

/** Complete standalone SVG for one frame (used for video/PNG export). */
export function renderFrameSvg(project, frame) {
	const [vx, vy, vw, vh] = project.viewBox;
	let body = '';
	for (let i = project.layers.length - 1; i >= 0; i--) {
		const layer = project.layers[i];
		if (!layer.visible) continue;
		const s = getLayerState(layer, frame);
		if (!s) continue;
		body += `<g transform="${layerTransform(layer, s)}" opacity="${round(s.alpha)}">${layer.content}</g>`;
	}
	const bg = `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${escapeXml(project.background)}"/>`;
	return `<svg xmlns="${SVG_NS}" xmlns:xlink="${XLINK_NS}" width="${project.width}" height="${project.height}" viewBox="${vx} ${vy} ${vw} ${vh}">${project.defs}${bg}${body}</svg>`;
}

// ____________________________________ SVG parsing & sanitizing ____________________________________

const BLOCKED_TAGS = new Set(['script', 'foreignObject', 'iframe', 'embed', 'object', 'metadata', 'title', 'desc']);

/** Strip scripts, event handlers, javascript: links and editor-only (Inkscape/Sodipodi) data. */
export function sanitizeElement(root) {
	const walk = (el) => {
		for (const child of Array.from(el.children)) {
			if (child.namespaceURI !== SVG_NS || BLOCKED_TAGS.has(child.localName)) {
				child.remove();
				continue;
			}
			walk(child);
		}
		for (const attr of Array.from(el.attributes)) {
			const ns = attr.namespaceURI;
			const name = attr.localName.toLowerCase();
			const editorOnly = ns && ns !== XLINK_NS && ns !== XML_NS && ns !== 'http://www.w3.org/2000/xmlns/';
			const handler = name.startsWith('on');
			const jsLink = name === 'href' && /^\s*javascript:/i.test(attr.value);
			if (editorOnly || handler || jsLink) el.removeAttributeNode(attr);
		}
	};
	walk(root);
	return root;
}

function parseSvgDocument(markup) {
	const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
	if (doc.querySelector('parsererror') || doc.documentElement.localName !== 'svg') return null;
	return doc;
}

function serialize(node) {
	return new XMLSerializer().serializeToString(node);
}

export function sanitizeSvgMarkup(markup) {
	if (!markup) return '';
	const doc = parseSvgDocument(`<svg xmlns="${SVG_NS}" xmlns:xlink="${XLINK_NS}">${markup}</svg>`);
	if (!doc) return '';
	sanitizeElement(doc.documentElement);
	return Array.from(doc.documentElement.children).map(serialize).join('');
}

function toPx(value) {
	const m = /^\s*([\d.]+)\s*(px|mm|cm|in|pt|pc)?\s*$/.exec(value || '');
	if (!m) return null;
	const factor = { px: 1, mm: 96 / 25.4, cm: 96 / 2.54, in: 96, pt: 96 / 72, pc: 16 }[m[2] || 'px'];
	return parseFloat(m[1]) * factor;
}

/** New project from an SVG file: every top-level element (e.g. an Inkscape layer) becomes a layer. */
export function importSvgProject(svgText, fileName = 'imported.svg') {
	const doc = parseSvgDocument(svgText);
	if (!doc) throw new Error('This is not a valid SVG file.');
	const svg = doc.documentElement;

	const labels = new Map();
	for (const el of Array.from(svg.children)) labels.set(el, el.getAttributeNS(INKSCAPE_NS, 'label'));
	sanitizeElement(svg);

	let viewBox = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
	const width = toPx(svg.getAttribute('width')) || viewBox[2] || 600;
	const height = toPx(svg.getAttribute('height')) || viewBox[3] || 400;
	if (viewBox.length !== 4 || viewBox.some((v) => !Number.isFinite(v))) viewBox = [0, 0, width, height];

	let defs = '';
	const layers = [];
	Array.from(svg.children).forEach((el, index) => {
		if (el.localName === 'defs' || el.localName === 'style') {
			defs += serialize(el);
			return;
		}
		const name = labels.get(el) || el.getAttribute('id') || `${el.localName} ${index + 1}`;
		layers.unshift(createLayer({ name, content: serialize(el) }));
	});
	if (layers.length === 0) layers.push(createLayer({ name: 'Layer 1' }));

	const baseName = fileName.replace(/\.svg$/i, '') || 'imported';
	return createProject({ exportName: baseName, projectName: baseName, width, height, viewBox, defs, layers });
}

/** Split a layer's content into one layer per top-level element (Flash: Distribute to Layers). */
export function splitLayerContent(layer) {
	const doc = parseSvgDocument(`<svg xmlns="${SVG_NS}" xmlns:xlink="${XLINK_NS}">${layer.content}</svg>`);
	if (!doc) return [];
	let parts = Array.from(doc.documentElement.children);
	let wrapperAttrs = '';
	if (parts.length === 1 && parts[0].localName === 'g') {
		const group = parts[0];
		wrapperAttrs = Array.from(group.attributes)
			.filter((a) => a.name !== 'id' && !a.name.startsWith('xmlns'))
			.map((a) => ` ${a.name}="${escapeXml(a.value)}"`)
			.join('');
		parts = Array.from(group.children);
	}
	return parts.map((el, i) => ({
		name: el.getAttribute('id') || `${layer.name} ${i + 1}`,
		content: wrapperAttrs ? `<g${wrapperAttrs}>${serialize(el)}</g>` : serialize(el),
	}));
}

// ____________________________________ loading ____________________________________

/** Accepts a v2 project or a v1 (frames[] with full SVG snapshots) project, returns a clean v2 project. */
export function normalizeProject(input) {
	const json = typeof input === 'string' ? JSON.parse(input) : input;
	if (!json || typeof json !== 'object') throw new Error('Not a Spark project file.');
	if (!Array.isArray(json.layers)) {
		if (Array.isArray(json.frames) && json.frames.length) return convertLegacyProject(json);
		throw new Error('Not a Spark project file.');
	}
	const project = createProject({ ...json, defs: sanitizeSvgMarkup(json.defs || ''), layers: [] });
	project.layers = json.layers.map((l) => {
		const layer = {
			id: String(l.id || newId()),
			name: String(l.name || 'Layer'),
			visible: l.visible !== false,
			locked: !!l.locked,
			content: sanitizeSvgMarkup(l.content || ''),
			cx: num(l.cx, null),
			cy: num(l.cy, null),
			keyframes: (Array.isArray(l.keyframes) ? l.keyframes : [])
				.map((k) => createKeyframe(Math.max(1, Math.round(num(k.frame, 1))), k, { tween: !!k.tween, ease: num(k.ease, 0), blank: !!k.blank })),
		};
		if (layer.keyframes.length === 0) layer.keyframes.push(createKeyframe(1));
		sortKeyframes(layer);
		return layer;
	});
	if (project.layers.length === 0) project.layers.push(createLayer({ name: 'Layer 1' }));
	project.frameLength = Math.max(project.frameLength, lastFrameWithKeyframe(project));
	return project;
}

function legacyGeometry(el) {
	const n = (a) => parseFloat(el.getAttribute(a)) || 0;
	switch (el.localName) {
		case 'circle': return { cx: n('cx'), cy: n('cy'), w: n('r'), h: n('r') };
		case 'ellipse': return { cx: n('cx'), cy: n('cy'), w: n('rx'), h: n('ry') };
		case 'rect':
		case 'image': return { cx: n('x') + n('width') / 2, cy: n('y') + n('height') / 2, w: n('width'), h: n('height') };
		case 'text': return { cx: n('x'), cy: n('y'), w: n('font-size') || 1, h: n('font-size') || 1 };
		default: return { cx: 0, cy: 0, w: 0, h: 0 };
	}
}

/**
 * v1 files stored a full SVG per keyframe and matched elements by index.
 * Position and size changes become motion-tween keyframes; colour changes are not carried over.
 */
export function convertLegacyProject(json) {
	const project = createProject({ ...json, layers: [] });
	const frames = [...json.frames].sort((a, b) => a.frameNumber - b.frameNumber);
	const parsed = frames.map((f) => {
		const doc = parseSvgDocument(f.svg || '');
		if (!doc) return [];
		sanitizeElement(doc.documentElement);
		return Array.from(doc.documentElement.children).filter((el) => el.localName !== 'defs');
	});

	(parsed[0] || []).forEach((base, i) => {
		const g0 = legacyGeometry(base);
		const layer = {
			id: newId(), name: base.getAttribute('id') || `${base.localName} ${i + 1}`, visible: true, locked: false,
			content: serialize(base), cx: g0.cx, cy: g0.cy, keyframes: [],
		};
		frames.forEach((f, fi) => {
			const el = parsed[fi][i];
			const frame = Math.max(1, Math.round(num(f.frameNumber, 1)));
			if (!el || el.localName !== base.localName) {
				layer.keyframes.push(createKeyframe(frame, {}, { blank: true }));
				return;
			}
			const g = legacyGeometry(el);
			layer.keyframes.push(createKeyframe(frame, {
				x: g.cx - g0.cx,
				y: g.cy - g0.cy,
				sx: g0.w ? g.w / g0.w : 1,
				sy: g0.h ? g.h / g0.h : 1,
			}, { tween: !!f.tween && f.tween !== 'none' }));
		});
		project.layers.unshift(layer);
	});
	if (project.layers.length === 0) project.layers.push(createLayer({ name: 'Layer 1' }));
	project.frameLength = Math.max(project.frameLength, lastFrameWithKeyframe(project));
	return project;
}

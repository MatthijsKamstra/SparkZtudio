import { CanvasMenu } from '../canvas-menu.js';
import { Canvas } from '../canvas.js';
import { ExportVideo } from '../export-video.js';
import { Export } from '../export.js';
import { Focus } from '../focus.js';
import { Globals } from '../globals.js';
import { Layout } from '../layout.js';
import { LocalStorageHandler } from '../local-storage.js';
import { Menu } from '../menu.js';
import { Properties } from '../properties.js';
import { Shortcuts } from '../shortcuts.js';
import { Timeline } from '../timeline.js';
import { Tools } from '../tools.js';
import { fetchGoogleFont, injectProjectFonts } from '../assets.js';
import {
	applyLayerStyle, createDemoProject, createKeyframe, createLayer, createProject, DEFAULT_STATE, escapeXml, getLayerState,
	governingKeyframe, importSvgProject, keyframeAt, normalizeProject, pickState, setLayerTextContent,
	sortKeyframes, splitLayerContent,
} from './project.js';

// The open project (format v2, see project.js). Reassigned on load/undo, so always read it fresh.
export let ProjectVars = createProject();

const UNDO_LIMIT = 100;

export class Model {

	IS_DEBUG = false;

	currentFrame = 1;
	selectedLayerId = null;
	isPlaying = false;
	isLooping = false;
	undoStack = [];
	redoStack = [];

	constructor() {
		if (Model.instance) return Model.instance;
		Model.instance = this;
	}

	init() {
		if (this.IS_DEBUG) console.info(`Model.init() version ${Globals.version}`);

		new Layout().init();
		new Canvas().init();
		new CanvasMenu().init();
		new Menu().init();
		new Timeline().init();
		new Properties().init();
		new Tools().init();
		new Shortcuts().init();
		new ExportVideo().init();
		new Focus();

		this.isLooping = localStorage.getItem('sparkLoop') === 'true';

		let project = null;
		const saved = new LocalStorageHandler().getItem('currentProject');
		if (saved) {
			try {
				project = normalizeProject(saved);
			} catch (e) {
				console.warn('Model.init(): could not restore autosaved project', e);
			}
		}
		this.load(project || createDemoProject(), { remember: false });
	}

	// ____________________________________ project lifecycle ____________________________________

	load(project, { remember = true } = {}) {
		this.stop();
		ProjectVars = project;
		injectProjectFonts(ProjectVars.fonts);
		this.currentFrame = 1;
		this.selectedLayerId = null;
		this.undoStack = [];
		this.redoStack = [];
		if (remember) this.storeProjectFile();
		this.autosave();
		this.updateTitle();
		this.notify('structure');
		new Menu().refreshRecentFiles();
	}

	openProjectText(text) {
		try {
			this.load(normalizeProject(text));
		} catch (e) {
			alert(`Could not open project: ${e.message}`);
		}
	}

	importSvgText(text, fileName) {
		try {
			this.load(importSvgProject(text, fileName));
		} catch (e) {
			alert(`Could not import SVG: ${e.message}`);
		}
	}

	newProject({ width, height }) {
		this.load(createProject({ width, height }), { remember: false });
	}

	/** Keep the last 5 opened projects for File > Open Recent. */
	storeProjectFile() {
		const local = new LocalStorageHandler();
		const list = local.getItem('projectFiles') || [];
		list.push(JSON.stringify(ProjectVars));
		while (list.length > 5) list.shift();
		local.setItem('projectFiles', list);
	}

	autosave() {
		clearTimeout(this._autosaveTimer);
		this._autosaveTimer = setTimeout(() => new LocalStorageHandler().setItem('currentProject', ProjectVars), 300);
	}

	updateTitle() {
		const fileLabel = `${ProjectVars.exportName || 'project'}.json`;
		const nameEl = document.getElementById('currentFileName');
		if (nameEl) nameEl.textContent = fileLabel;
		document.title = `⚡ ${fileLabel} — Spark Studio`;
		localStorage.setItem('sparkLastFile', JSON.stringify({ name: fileLabel, opened: Date.now() }));
	}

	/**
	 * structure: layers/content/document changed -> rebuild everything
	 * animation: keyframes changed -> re-render stage, rebuild timeline
	 * frame: playhead moved
	 * selection: selected layer changed
	 */
	notify(type) {
		const canvas = new Canvas();
		const timeline = new Timeline();
		const properties = new Properties();
		switch (type) {
			case 'structure': canvas.build(); timeline.build(); properties.build(); break;
			case 'animation': canvas.render(); timeline.build(); properties.build(); break;
			case 'frame': canvas.render(); timeline.updatePlayhead(); properties.refresh(); break;
			case 'selection': canvas.updateSelection(); timeline.updateSelection(); properties.build(); break;
		}
		new CanvasMenu().update();
	}

	// ____________________________________ undo ____________________________________

	/** Call before every mutation of ProjectVars. */
	snapshot() {
		this.undoStack.push(JSON.stringify(ProjectVars));
		if (this.undoStack.length > UNDO_LIMIT) this.undoStack.shift();
		this.redoStack = [];
	}

	/** Call after every mutation of ProjectVars. */
	changed(type) {
		this.autosave();
		this.notify(type);
	}

	undo() { this.restoreFrom(this.undoStack, this.redoStack); }

	redo() { this.restoreFrom(this.redoStack, this.undoStack); }

	restoreFrom(from, to) {
		if (from.length === 0) return;
		this.stop();
		to.push(JSON.stringify(ProjectVars));
		ProjectVars = JSON.parse(from.pop());
		if (!this.getLayer()) this.selectedLayerId = null;
		this.currentFrame = Math.min(this.currentFrame, ProjectVars.frameLength);
		this.changed('structure');
	}

	// ____________________________________ frame & selection ____________________________________

	getLayer(id = this.selectedLayerId) {
		return ProjectVars.layers.find((l) => l.id === id) || null;
	}

	setFrame(frame) {
		const f = Math.max(1, Math.min(ProjectVars.frameLength, Math.round(frame)));
		if (f === this.currentFrame) return;
		this.currentFrame = f;
		this.notify('frame');
	}

	select(layerId) {
		if (layerId === this.selectedLayerId) return;
		this.selectedLayerId = layerId;
		this.notify('selection');
	}

	nextFrame() { this.stop(); this.setFrame(this.currentFrame + 1); }

	prevFrame() { this.stop(); this.setFrame(this.currentFrame - 1); }

	/** Keyframe frames of the selected layer, or of all layers when nothing is selected. */
	keyframeFrames() {
		const layers = this.getLayer() ? [this.getLayer()] : ProjectVars.layers;
		return [...new Set(layers.flatMap((l) => l.keyframes.map((k) => k.frame)))].sort((a, b) => a - b);
	}

	nextKeyframe() {
		this.stop();
		const next = this.keyframeFrames().find((f) => f > this.currentFrame);
		this.setFrame(next ?? ProjectVars.frameLength);
	}

	previousKeyframe() {
		this.stop();
		const prev = this.keyframeFrames().reverse().find((f) => f < this.currentFrame);
		this.setFrame(prev ?? 1);
	}

	// ____________________________________ playback ____________________________________

	play() {
		if (this.isPlaying) return;
		this.isPlaying = true;
		if (this.currentFrame >= ProjectVars.frameLength) this.setFrame(1);
		const interval = 1000 / ProjectVars.frameRate;
		let last = performance.now();
		const tick = (now) => {
			if (!this.isPlaying) return;
			if (now - last >= interval) {
				last += interval * Math.floor((now - last) / interval);
				let next = this.currentFrame + 1;
				if (next > ProjectVars.frameLength) {
					if (!this.isLooping) { this.stop(); return; }
					next = 1;
				}
				this.setFrame(next);
			}
			this._raf = requestAnimationFrame(tick);
		};
		this._raf = requestAnimationFrame(tick);
		new CanvasMenu().update();
	}

	stop() {
		if (!this.isPlaying) return;
		this.isPlaying = false;
		cancelAnimationFrame(this._raf);
		new CanvasMenu().update();
	}

	togglePlay() {
		if (this.isPlaying) this.stop();
		else this.play();
	}

	loop(isLoop) {
		this.isLooping = isLoop;
		localStorage.setItem('sparkLoop', isLoop);
		new CanvasMenu().update();
	}

	// ____________________________________ layers ____________________________________

	nextLayerName(base = 'Layer') {
		let n = 1;
		while (ProjectVars.layers.some((l) => l.name === `${base} ${n}`)) n++;
		return `${base} ${n}`;
	}

	/** New layer above the selected one (Flash behaviour), with a keyframe on frame 1. */
	addLayer({ name, content = '' } = {}) {
		this.snapshot();
		const layer = createLayer({ name: name || this.nextLayerName(), content });
		const index = Math.max(0, ProjectVars.layers.findIndex((l) => l.id === this.selectedLayerId));
		ProjectVars.layers.splice(index, 0, layer);
		this.selectedLayerId = layer.id;
		this.changed('structure');
		return layer;
	}

	/** Drawing tools: draw into the selected layer when it is still empty, otherwise make a new layer. */
	addShape(name, markup) {
		const layer = this.getLayer();
		if (layer && !layer.content.trim() && !layer.locked) {
			this.snapshot();
			layer.content = markup;
			layer.cx = layer.cy = null;
			this.changed('structure');
			return;
		}
		this.addLayer({ name: this.nextLayerName(name), content: markup });
	}

	placeImage({ name, dataUrl, width, height }) {
		const [vx, vy, stageWidth, stageHeight] = ProjectVars.viewBox;
		const scale = Math.min(1, stageWidth * 0.8 / width, stageHeight * 0.8 / height);
		const displayWidth = Math.round(width * scale * 100) / 100;
		const displayHeight = Math.round(height * scale * 100) / 100;
		const x = Math.round((vx + (stageWidth - displayWidth) / 2) * 100) / 100;
		const y = Math.round((vy + (stageHeight - displayHeight) / 2) * 100) / 100;
		const layerName = String(name || 'Image').replace(/\.[^.]+$/, '');
		this.addLayer({
			name: this.nextLayerName(layerName),
			content: `<image href="${escapeXml(dataUrl)}" x="${x}" y="${y}" width="${displayWidth}" height="${displayHeight}"/>`,
		});
	}

	deleteLayer(id = this.selectedLayerId) {
		const index = ProjectVars.layers.findIndex((l) => l.id === id);
		if (index < 0 || ProjectVars.layers.length <= 1) return;
		this.snapshot();
		ProjectVars.layers.splice(index, 1);
		const neighbour = ProjectVars.layers[Math.min(index, ProjectVars.layers.length - 1)];
		this.selectedLayerId = neighbour ? neighbour.id : null;
		this.changed('structure');
	}

	/** direction -1 = up (towards the front), +1 = down. */
	moveLayer(direction, id = this.selectedLayerId) {
		const layers = ProjectVars.layers;
		const index = layers.findIndex((l) => l.id === id);
		const target = index + direction;
		if (index < 0 || target < 0 || target >= layers.length) return;
		this.snapshot();
		[layers[index], layers[target]] = [layers[target], layers[index]];
		this.changed('structure');
	}

	duplicateLayer(id = this.selectedLayerId) {
		const layer = this.getLayer(id);
		if (!layer) return;
		this.snapshot();
		const copy = JSON.parse(JSON.stringify(layer));
		copy.id = createLayer().id;
		copy.name = `${layer.name} copy`;
		ProjectVars.layers.splice(ProjectVars.layers.indexOf(layer), 0, copy);
		this.selectedLayerId = copy.id;
		this.changed('structure');
	}

	renameLayer(id, name) {
		const layer = this.getLayer(id);
		if (!layer || !name || layer.name === name) return;
		this.snapshot();
		layer.name = name;
		this.changed('animation');
	}

	toggleLayerFlag(id, flag) {
		const layer = this.getLayer(id);
		if (!layer) return;
		layer[flag] = !layer[flag];
		this.changed('animation');
	}

	distributeToLayers(id = this.selectedLayerId) {
		const layer = this.getLayer(id);
		if (!layer) return;
		const parts = splitLayerContent(layer);
		if (parts.length < 2) {
			alert('This layer has only one object; nothing to distribute.');
			return;
		}
		this.snapshot();
		const newLayers = parts.map((p) => {
			const l = createLayer({ name: p.name, content: p.content });
			l.keyframes = JSON.parse(JSON.stringify(layer.keyframes));
			return l;
		}).reverse();
		ProjectVars.layers.splice(ProjectVars.layers.indexOf(layer), 1, ...newLayers);
		this.selectedLayerId = newLayers[0].id;
		this.changed('structure');
	}

	/** Fill/stroke/stroke-width/font-size of the layer artwork (not animated). */
	setLayerStyle(id, props) {
		const layer = this.getLayer(id);
		if (!layer || layer.locked) return;
		const content = applyLayerStyle(layer.content, props);
		if (content === layer.content) return;
		this.snapshot();
		layer.content = content;
		this.changed('structure');
	}

	setLayerText(id, text) {
		const layer = this.getLayer(id);
		if (!layer || layer.locked) return;
		const content = setLayerTextContent(layer.content, text);
		if (content === layer.content) return;
		this.snapshot();
		layer.content = content;
		this.changed('structure');
	}

	// ____________________________________ keyframes ____________________________________

	/** F6 (keyframe) / F7 (blank keyframe) on the selected layer at the current frame. */
	insertKeyframe({ blank = false } = {}) {
		const layer = this.getLayer();
		if (!layer) return;
		const frame = this.currentFrame;
		const existing = keyframeAt(layer, frame);
		if (existing && existing.blank === blank) return;
		this.snapshot();
		if (existing) {
			existing.blank = blank;
		} else {
			const prev = governingKeyframe(layer, frame);
			const state = getLayerState(layer, frame) || (prev ? pickState(prev) : DEFAULT_STATE);
			layer.keyframes.push(createKeyframe(frame, state, { blank, tween: !blank && !!prev?.tween, ease: prev?.ease || 0 }));
			sortKeyframes(layer);
		}
		this.changed('animation');
	}

	/** Shift+F6: remove the keyframe at the current frame (a layer always keeps one). */
	clearKeyframe() {
		const layer = this.getLayer();
		const kf = layer && keyframeAt(layer, this.currentFrame);
		if (!kf || layer.keyframes.length <= 1) return;
		this.snapshot();
		layer.keyframes.splice(layer.keyframes.indexOf(kf), 1);
		this.changed('animation');
	}

	/** Change the tween settings of the keyframe span the playhead is in. */
	setTween({ tween, ease }) {
		const layer = this.getLayer();
		const kf = layer && governingKeyframe(layer, this.currentFrame);
		if (!kf) return;
		this.snapshot();
		if (tween !== undefined) kf.tween = tween;
		if (ease !== undefined) kf.ease = Math.max(-100, Math.min(100, ease));
		this.changed('animation');
	}

	toggleTween() {
		const layer = this.getLayer();
		const kf = layer && governingKeyframe(layer, this.currentFrame);
		if (kf) this.setTween({ tween: !kf.tween });
	}

	/**
	 * Set x/y/sx/sy/rot/alpha of a layer at the current frame.
	 * Without a keyframe here one is created and the span before it becomes a motion tween.
	 */
	setLayerProps(id, props) {
		const layer = this.getLayer(id);
		if (!layer) return;
		const frame = this.currentFrame;
		const state = getLayerState(layer, frame);
		if (!state) return;
		this.snapshot();
		let kf = keyframeAt(layer, frame);
		if (!kf) {
			const prev = governingKeyframe(layer, frame);
			kf = createKeyframe(frame, state, { tween: prev.tween, ease: prev.ease });
			prev.tween = true;
			layer.keyframes.push(kf);
			sortKeyframes(layer);
		}
		Object.assign(kf, pickState(props));
		this.changed('animation');
	}

	// ____________________________________ document ____________________________________

	setDocument(props) {
		this.snapshot();
		const p = ProjectVars;
		const [vx, vy, vw, vh] = p.viewBox;
		const followsSize = vx === 0 && vy === 0 && vw === p.width && vh === p.height;
		for (const key of ['projectName', 'exportName', 'background']) {
			if (props[key] !== undefined) p[key] = String(props[key]);
		}
		for (const key of ['width', 'height', 'frameRate', 'frameLength']) {
			const v = Math.round(Number(props[key]));
			if (props[key] !== undefined && Number.isFinite(v) && v >= 1) p[key] = v;
		}
		if (followsSize) p.viewBox = [0, 0, p.width, p.height];
		this.currentFrame = Math.min(this.currentFrame, p.frameLength);
		this.updateTitle();
		this.changed('structure');
	}

	async addGoogleFont(url) {
		const font = await fetchGoogleFont(url);
		this.snapshot();
		ProjectVars.fonts = (ProjectVars.fonts || []).filter((item) => item.source !== font.source);
		ProjectVars.fonts.push(font);
		await injectProjectFonts(ProjectVars.fonts);
		this.changed('structure');
		return font.families;
	}

	// ____________________________________ file menu ____________________________________

	newFile() {
		const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('svgPropertiesModal'));
		modal.show();
	}

	openFile() {
		document.getElementById('openFileInput3').click();
	}

	importFile() {
		document.getElementById('importFile3').click();
	}

	saveFile() {
		new Export().file();
	}

	saveAsFile() { }

	closeFile() { }

	exportFile() {
		new Export().image();
	}

	exportMovie() {
		this.stop();
		new ExportVideo().open();
	}
}

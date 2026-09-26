import { Globals } from './globals.js';
import { Model, ProjectVars } from './model/model.js';

/** Zoom and playback controls under the stage. */
export class CanvasMenu {

	IS_DEBUG = false;

	constructor() {
		if (CanvasMenu.instance) return CanvasMenu.instance;
		CanvasMenu.instance = this;
	}

	init() {
		this.svgContainer = document.getElementById(Globals.svgContainerID);
		this.svgWrapper = document.getElementById('svgWrapper');
		const model = new Model();
		const on = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);

		on('canvas-menu-zoomIn', () => this.zoomIn());
		on('canvas-menu-zoomOut', () => this.zoomOut());
		on('canvas-menu-zoomTo100', () => this.zoomTo100());
		on('zoomLevelDisplay', () => this.zoomTo100());
		on('canvas-menu-zoomToFit', () => this.zoomToFit());
		on('prevKeyframe', () => model.previousKeyframe());
		on('nextKeyframe', () => model.nextKeyframe());
		on('togglePlayStop', () => model.togglePlay());
		on('toggleLoop', () => model.loop(!model.isLooping));
	}

	/** Sync buttons and read-outs with the model. */
	update() {
		const model = new Model();
		const playBtn = document.getElementById('togglePlayStop');
		if (playBtn) playBtn.innerHTML = model.isPlaying ? '<i class="bi bi-stop-fill"></i>' : '<i class="bi bi-play-fill"></i>';
		document.getElementById('toggleLoop')?.classList.toggle('active', model.isLooping);
		const playhead = document.getElementById('playheadDisplay');
		if (playhead) playhead.textContent = `${model.currentFrame} / ${ProjectVars.frameLength}`;
		const fps = document.getElementById('fpsValue');
		if (fps) fps.textContent = ProjectVars.frameRate;
	}

	// ____________________________________ zoom ____________________________________

	setZoom(scale) {
		Globals.zoomScale = Math.max(0.05, Math.min(8, scale));
		this.svgContainer.style.transform = `scale(${Globals.zoomScale})`;
		const el = document.getElementById('zoomLevelDisplay');
		if (el) el.textContent = `${Math.round(Globals.zoomScale * 100)}%`;
	}

	zoomIn() { this.setZoom(Globals.zoomScale * 1.25); }

	zoomOut() { this.setZoom(Globals.zoomScale / 1.25); }

	zoomTo100() { this.setZoom(1); }

	zoomToFit() {
		const area = this.svgWrapper.getBoundingClientRect();
		const menuHeight = document.getElementById('canvasMenu')?.offsetHeight || 0;
		const scale = Math.min((area.width - 40) / ProjectVars.width, (area.height - menuHeight - 40) / ProjectVars.height);
		if (scale > 0) this.setZoom(scale);
	}

	/** After loading: shrink the stage when it does not fit, never enlarge. */
	fitIfTooLarge() {
		const area = this.svgWrapper.getBoundingClientRect();
		const menuHeight = document.getElementById('canvasMenu')?.offsetHeight || 0;
		if (ProjectVars.width * Globals.zoomScale > area.width - 40 || ProjectVars.height * Globals.zoomScale > area.height - menuHeight - 40) {
			this.zoomToFit();
		}
	}
}

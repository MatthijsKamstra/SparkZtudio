import { Canvas } from './canvas.js';
import { Model } from './model/model.js';
import { Tools } from './tools.js';

/** Keyboard shortcuts, Flash key bindings where they exist. */
export class Shortcuts {

	IS_DEBUG = false;

	constructor() {
		if (Shortcuts.instance) return Shortcuts.instance;
		Shortcuts.instance = this;
	}

	init() {
		document.addEventListener('keydown', (e) => this.onKeyDown(e));
	}

	onKeyDown(e) {
		const target = e.target;
		if (target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
		if (document.querySelector('.modal.show')) return;

		const model = new Model();
		const key = e.key.toLowerCase();
		const cmd = e.metaKey || e.ctrlKey;
		const run = (fn) => { e.preventDefault(); fn(); };

		if (cmd) {
			if (key === 'z' && e.shiftKey) return run(() => model.redo());
			if (key === 'z') return run(() => model.undo());
			if (key === 'y') return run(() => model.redo());
			if (key === 'n') return run(() => model.newFile());
			if (key === 'o') return run(() => model.openFile());
			if (key === 's') return run(() => model.saveFile());
			if (key === 'i') return run(() => model.importFile());
			if (key === 'e' && e.shiftKey) return run(() => model.exportFile());
			if (key === 'e') return run(() => model.exportMovie());
			if (key === 'd') return run(() => model.duplicateLayer());
			return;
		}

		switch (e.key) {
			case 'F6': return run(() => (e.shiftKey ? model.clearKeyframe() : model.insertKeyframe()));
			case 'F7': return run(() => model.insertKeyframe({ blank: true }));
			case 'Enter': return run(() => model.togglePlay());
			case ',': return run(() => model.prevFrame());
			case '.': return run(() => model.nextFrame());
			case 'Home': return run(() => { model.stop(); model.setFrame(1); });
			case 'End': return run(() => { model.stop(); model.setFrame(Infinity); });
			case 'Delete':
			case 'Backspace': return run(() => model.deleteLayer());
			case 'ArrowLeft': return run(() => new Canvas().nudge(e.shiftKey ? -10 : -1, 0));
			case 'ArrowRight': return run(() => new Canvas().nudge(e.shiftKey ? 10 : 1, 0));
			case 'ArrowUp': return run(() => new Canvas().nudge(0, e.shiftKey ? -10 : -1));
			case 'ArrowDown': return run(() => new Canvas().nudge(0, e.shiftKey ? 10 : 1));
			case 'Escape': return run(() => model.select(null));
		}

		const tools = { v: 'select', r: 'rect', o: 'ellipse', n: 'line', t: 'text', z: 'zoom' };
		if (tools[key] && !e.altKey) run(() => new Tools().setTool(tools[key]));
	}
}

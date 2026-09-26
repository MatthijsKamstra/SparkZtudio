import { Model, ProjectVars } from './model/model.js';
import { renderFrameSvg } from './model/project.js';

// Loaded on demand; vendor this file when packaging the desktop app for offline use.
const MEDIABUNNY_URL = 'https://cdn.jsdelivr.net/npm/mediabunny@1.60.0/+esm';

const FORMATS = [
	{ id: 'mp4', label: 'MP4 (H.264)', codec: 'avc', ext: 'mp4', mime: 'video/mp4' },
	{ id: 'webm-vp9', label: 'WebM (VP9)', codec: 'vp9', ext: 'webm', mime: 'video/webm' },
	{ id: 'webm-vp8', label: 'WebM (VP8)', codec: 'vp8', ext: 'webm', mime: 'video/webm' },
];

/**
 * Frame-exact video export: every frame is rendered to a canvas and encoded with WebCodecs,
 * so the result does not depend on playback speed (unlike MediaRecorder).
 */
export class ExportVideo {

	IS_DEBUG = false;

	rendering = false;
	cancelled = false;
	lastBlobUrl = null;
	lastFileName = null;

	constructor() {
		if (ExportVideo.instance) return ExportVideo.instance;
		ExportVideo.instance = this;
	}

	init() {
		this.modalEl = document.getElementById('exampleModal');
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.formatSelect = document.getElementById('exportFormat');
		this.statusEl = document.getElementById('exportStatus');
		this.renderBtn = document.getElementById('renderVideo');
		this.cancelBtn = document.getElementById('cancelRender');
		this.saveBtn = document.getElementById('confirmExport');

		this.renderBtn.addEventListener('click', () => this.render());
		this.cancelBtn.addEventListener('click', () => { this.cancelled = true; });
		this.saveBtn.addEventListener('click', () => this.download());
		this.modalEl.addEventListener('hide.bs.modal', () => { this.cancelled = true; });
	}

	async open() {
		bootstrap.Modal.getOrCreateInstance(this.modalEl).show();
		this.setProgress(0);
		this.saveBtn.disabled = !this.lastBlobUrl;
		const p = ProjectVars;
		document.getElementById('exportInfo').textContent =
			`${even(p.width)}×${even(p.height)} px, ${p.frameRate} fps, ${p.frameLength} frames (${(p.frameLength / p.frameRate).toFixed(2)} s)`;
		this.canvas.width = even(p.width);
		this.canvas.height = even(p.height);
		await this.drawFrame(new Model().currentFrame);
		await this.populateFormats();
	}

	async populateFormats() {
		this.formatSelect.innerHTML = '';
		if (!('VideoEncoder' in window)) {
			this.setStatus('This browser cannot encode video (WebCodecs missing). Use a recent Chrome, Edge, Firefox or Safari.', 'danger');
			this.renderBtn.disabled = true;
			return;
		}
		this.setStatus('Checking available codecs…');
		let mediabunny;
		try {
			mediabunny = await import(MEDIABUNNY_URL);
		} catch (e) {
			this.setStatus('Could not load the video encoder library (offline?).', 'danger');
			this.renderBtn.disabled = true;
			return;
		}
		const size = { width: even(ProjectVars.width), height: even(ProjectVars.height) };
		for (const format of FORMATS) {
			if (await mediabunny.canEncodeVideo(format.codec, size).catch(() => false)) {
				this.formatSelect.add(new Option(format.label, format.id));
			}
		}
		const saved = localStorage.getItem('sparkExportFormat');
		if (saved && [...this.formatSelect.options].some((o) => o.value === saved)) this.formatSelect.value = saved;
		this.renderBtn.disabled = this.formatSelect.options.length === 0;
		this.setStatus(this.renderBtn.disabled ? 'No supported video codec found.' : 'Ready.', this.renderBtn.disabled ? 'danger' : 'muted');
	}

	async drawFrame(frame) {
		const url = URL.createObjectURL(new Blob([renderFrameSvg(ProjectVars, frame)], { type: 'image/svg+xml' }));
		try {
			const img = new Image();
			img.src = url;
			await img.decode();
			this.ctx.fillStyle = ProjectVars.background || '#ffffff';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	async render() {
		if (this.rendering) return;
		const format = FORMATS.find((f) => f.id === this.formatSelect.value);
		if (!format) return;
		localStorage.setItem('sparkExportFormat', format.id);

		this.rendering = true;
		this.cancelled = false;
		this.renderBtn.disabled = this.saveBtn.disabled = this.formatSelect.disabled = true;
		this.cancelBtn.disabled = false;

		const p = ProjectVars;
		const { Output, Mp4OutputFormat, WebMOutputFormat, BufferTarget, CanvasSource, Quality } = await import(MEDIABUNNY_URL);
		this.canvas.width = even(p.width);
		this.canvas.height = even(p.height);

		const output = new Output({
			format: format.ext === 'mp4' ? new Mp4OutputFormat({ fastStart: 'in-memory' }) : new WebMOutputFormat(),
			target: new BufferTarget(),
		});
		const source = new CanvasSource(this.canvas, { codec: format.codec, quality: new Quality('high') });
		output.addVideoTrack(source, { frameRate: p.frameRate });

		try {
			await output.start();
			const duration = 1 / p.frameRate;
			for (let frame = 1; frame <= p.frameLength; frame++) {
				if (this.cancelled) throw new Error('cancelled');
				await this.drawFrame(frame);
				await source.add((frame - 1) * duration, duration);
				this.setProgress(frame / p.frameLength);
				this.setStatus(`Rendering frame ${frame} of ${p.frameLength}…`);
			}
			source.close();
			await output.finalize();

			const blob = new Blob([output.target.buffer], { type: format.mime });
			if (this.lastBlobUrl) URL.revokeObjectURL(this.lastBlobUrl);
			this.lastBlobUrl = URL.createObjectURL(blob);
			this.lastFileName = `${p.exportName || 'spark-export'}.${format.ext}`;
			this.setStatus(`Done: ${this.lastFileName}, ${(blob.size / 1024 / 1024).toFixed(2)} MB.`, 'success');
			this.download();
		} catch (e) {
			if (output.state !== 'finalized' && output.state !== 'canceled') await output.cancel().catch(() => { });
			if (this.cancelled) this.setStatus('Export cancelled.', 'warning');
			else {
				console.error('Video export failed', e);
				this.setStatus(`Export failed: ${e.message}`, 'danger');
			}
		} finally {
			this.rendering = false;
			this.renderBtn.disabled = this.formatSelect.disabled = false;
			this.cancelBtn.disabled = true;
			this.saveBtn.disabled = !this.lastBlobUrl;
		}
	}

	download() {
		if (!this.lastBlobUrl) return;
		const a = document.createElement('a');
		a.href = this.lastBlobUrl;
		a.download = this.lastFileName;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	setProgress(fraction) {
		const pct = Math.round(fraction * 100);
		const bar = document.getElementById('progressBar');
		bar.style.width = `${pct}%`;
		bar.textContent = `${pct}%`;
	}

	setStatus(text, tone = 'muted') {
		this.statusEl.className = `small text-${tone}`;
		this.statusEl.textContent = text;
	}
}

// H.264 needs even dimensions.
function even(n) {
	return Math.max(2, Math.ceil(n / 2) * 2);
}

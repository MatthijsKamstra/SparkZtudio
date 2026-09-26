import { Model, ProjectVars } from './model/model.js';
import { renderFrameSvg } from './model/project.js';

/** File > Save (project JSON) and File > Export (PNG of the current frame). */
export class Export {

	IS_DEBUG = false;

	file() {
		const blob = new Blob([JSON.stringify(ProjectVars, null, 2)], { type: 'application/json' });
		this.download(blob, `${ProjectVars.exportName || 'spark-project'}.json`);
	}

	async image() {
		const p = ProjectVars;
		const frame = new Model().currentFrame;
		const url = URL.createObjectURL(new Blob([renderFrameSvg(p, frame)], { type: 'image/svg+xml' }));
		try {
			const img = new Image();
			img.src = url;
			await img.decode();
			const canvas = document.createElement('canvas');
			canvas.width = p.width;
			canvas.height = p.height;
			canvas.getContext('2d').drawImage(img, 0, 0, p.width, p.height);
			const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
			this.download(blob, `${p.exportName || 'spark-project'}-frame${frame}.png`);
		} catch (e) {
			console.error('PNG export failed', e);
			alert('PNG export failed; see console.');
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	download(blob, fileName) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
}

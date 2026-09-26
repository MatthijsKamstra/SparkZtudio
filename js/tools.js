/** Tool palette: current tool plus fill/stroke settings for the drawing tools. */
export class Tools {

	IS_DEBUG = false;

	current = 'select';
	fillColor = '#3399ff';
	strokeColor = '#000000';
	strokeWidth = 0;

	static BUTTONS = {
		select: 'selectTool',
		rect: 'drawRectTool',
		ellipse: 'drawCircleTool',
		line: 'drawLineTool',
		text: 'drawTextTool',
		zoom: 'zoomTool',
	};

	constructor() {
		if (Tools.instance) return Tools.instance;
		Tools.instance = this;
	}

	init() {
		for (const [tool, id] of Object.entries(Tools.BUTTONS)) {
			document.getElementById(id).addEventListener('click', () => this.setTool(tool));
		}
		const fill = document.getElementById('fillColor');
		const stroke = document.getElementById('strokeColor');
		const width = document.getElementById('strokeWidth');
		fill.value = this.fillColor;
		stroke.value = this.strokeColor;
		width.value = this.strokeWidth;
		fill.addEventListener('input', () => { this.fillColor = fill.value; });
		stroke.addEventListener('input', () => { this.strokeColor = stroke.value; });
		width.addEventListener('input', () => { this.strokeWidth = Math.max(0, Number(width.value) || 0); });
		this.setTool('select');
	}

	setTool(tool) {
		if (!Tools.BUTTONS[tool]) return;
		this.current = tool;
		for (const [name, id] of Object.entries(Tools.BUTTONS)) {
			document.getElementById(id).classList.toggle('active', name === tool);
		}
		const container = document.getElementById('svg-container');
		if (container) container.dataset.tool = tool;
	}
}

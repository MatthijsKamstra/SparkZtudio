import { ExportVideo } from './export-video.js';
import { Globals } from './globals.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Shortcuts } from './shortcuts.js';
import { Timeline } from './timeline.js';
import { Tools } from './tools.js';

export class Inter {

	IS_DEBUG = true;

	projectFileTest = {
		"exportName": "v02_inter_example_project",
		"projectName": "V02 Inter Example project",
		"creationDate": "1800-11-21",
		"description": "Inter sample project file with additional metadata.",
		"version": "1.0",
		"width": 800,
		"height": 300,
		"frameRate": 24,
		"frameLength": 100,
		"frames": [
			{
				"frameNumber": 1,
				"svg": `<svg width='800' height='300' xmlns='http://www.w3.org/2000/svg'>
					  <circle cx='50' cy='50' r='40' stroke='#000000' stroke-width='3' fill='#ff3333' />
				   </svg>`,
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 100,
				"svg": `<svg width='800' height='300' xmlns='http://www.w3.org/2000/svg'>
					  <circle cx='550' cy='150' r='170' stroke='#dddd00' stroke-width='20' fill='#3333ff' />
				   </svg>`,
				"tween": "linear",
				"keyframe": true
			}
		],
		"calculated": []
	}

	_projectFileTest = {
		"exportName": "v01_inter_example_project",
		"projectName": "V01 Inter Example project",
		"creationDate": "1900-11-21",
		"description": "Inter sample project file with additional metadata.",
		"version": "1.0",
		"width": 600,
		"height": 300,
		"frameRate": 24,
		"frameLength": 40,
		"frames": [
			{
				"frameNumber": 1,
				"svg": `<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'>
					  <circle cx='50' cy='50' r='40' stroke='#000000' stroke-width='3' fill='#ff3333' />
					  <circle cx='100' cy='100' r='30' stroke='#000000' stroke-width='3' fill='#00ff00' />
					  <rect x='10' y='10' width='30' height='20' stroke='#000000' stroke-width='2' fill='#00cc00' />
					  <rect x='50' y='50' width='40' height='30' stroke='#0000dd' stroke-width='3' fill='#ff0000' />
					  <rect x='100' y='100' width='50' height='40' stroke='#00dd00' stroke-width='4' fill='#0000ff' />
					  <text x='50' y='150' font-family='Verdana' font-size='24' fill='blue'>Text 1</text>
					  <text x='100' y='150' font-family='Verdana' font-size='24' fill='green'>Text 2</text>
					  <text x='150' y='150' font-family='Verdana' font-size='24' fill='red'>Text 3</text>
					  <text x='200' y='150' font-family='Verdana' font-size='24' fill='yellow'>Text 4</text>
					  <text x='250' y='150' font-family='Verdana' font-size='24' fill='purple'>Text 5</text>
				   </svg>`,
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 10,
				"svg": `<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'>
					  <circle cx='150' cy='150' r='50' stroke='#00dd00' stroke-width='4' fill='#ffcc00' />
					  <circle cx='200' cy='200' r='40' stroke='#00dd00' stroke-width='4' fill='#333333' />
					  <rect x='60' y='60' width='50' height='30' stroke='#000000' stroke-width='3' fill='#00ff00' />
					  <rect x='100' y='100' width='60' height='40' stroke='#000000' stroke-width='3' fill='#ff0000' />
					  <rect x='150' y='150' width='70' height='50' stroke='#000000' stroke-width='3' fill='#0000ff' />
					  <text x='50' y='200' font-family='Verdana' font-size='24' fill='blue'>Text 1</text>
					  <text x='100' y='200' font-family='Verdana' font-size='24' fill='green'>Text 2</text>
					  <text x='150' y='200' font-family='Verdana' font-size='24' fill='red'>Text 3</text>
					  <text x='200' y='200' font-family='Verdana' font-size='24' fill='yellow'>Text 4</text>
					  <text x='250' y='200' font-family='Verdana' font-size='24' fill='purple'>Text 5</text>
				   </svg>`,
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 20,
				"svg": `<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'>
					  <circle cx='250' cy='250' r='60' stroke='#0000dd' stroke-width='6' fill='#333333' />
					  <circle cx='300' cy='300' r='50' stroke='#0000dd' stroke-width='6' fill='#333333' />
					  <rect x='80' y='80' width='70' height='40' stroke='#0000dd' stroke-width='4' fill='#ff0000' />
					  <rect x='120' y='120' width='80' height='50' stroke='#0000dd' stroke-width='4' fill='#0000ff' />
					  <rect x='160' y='160' width='90' height='60' stroke='#0000dd' stroke-width='4' fill='#00ff00' />
					  <text x='50' y='250' font-family='Verdana' font-size='24' fill='blue'>Text 1</text>
					  <text x='100' y='250' font-family='Verdana' font-size='24' fill='green'>Text 2</text>
					  <text x='150' y='250' font-family='Verdana' font-size='24' fill='red'>Text 3</text>
					  <text x='200' y='250' font-family='Verdana' font-size='24' fill='yellow'>Text 4</text>
					  <text x='250' y='250' font-family='Verdana' font-size='24' fill='purple'>Text 5</text>
				   </svg>`,
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 30,
				"svg": `<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'>
					  <circle cx='350' cy='350' r='70' stroke='#dddd00' stroke-width='2' fill='#3333ff' />
					  <circle cx='400' cy='400' r='60' stroke='#dddd00' stroke-width='2' fill='#3333ff' />
					  <rect x='100' y='100' width='100' height='60' stroke='#dddd00' stroke-width='5' fill='#0000ff' />
					  <rect x='150' y='150' width='110' height='70' stroke='#dddd00' stroke-width='5' fill='#00ff00' />
					  <rect x='200' y='200' width='120' height='80' stroke='#dddd00' stroke-width='5' fill='#ff0000' />
					  <text x='50' y='300' font-family='Verdana' font-size='24' fill='blue'>Text 1</text>
					  <text x='100' y='300' font-family='Verdana' font-size='24' fill='green'>Text 2</text>
					  <text x='150' y='300' font-family='Verdana' font-size='24' fill='red'>Text 3</text>
					  <text x='200' y='300' font-family='Verdana' font-size='24' fill='yellow'>Text 4</text>
					  <text x='250' y='300' font-family='Verdana' font-size='24' fill='purple'>Text 5</text>
				   </svg>`,
				"tween": "linear",
				"keyframe": true
			}
		],
		"calculated": []
	};


	constructor() {
		if (this.IS_DEBUG) console.info(`constructor inter.js -- isSingleton: ${Inter.instance != null}`);
		if (Inter.instance) {
			return Inter.instance;
		}
		Inter.instance = this;

		// Initialize any properties
		this.data = "I am a singleton";
	}

	getData() {
		return this.data;
	}

	setData(newData) {
		this.data = newData;
	}

	/**
	 * use this to setup the intercalculate the inbetween frams are calculated
	 *
	 * @param {*} projectFile  json file that holds the keyframes and project files
	 */
	setup(projectFile) {
		if (this.IS_DEBUG) console.info('Inter.setup(..)');

		// Calculate data for all frames and add to project
		const frames = projectFileTest.frames;
		projectFileTest.calculated = this.getFrameData(frames);
		projectFileTest.calculated.forEach(frame => {
			// console.log(`Frame ${frame.frameNumber}: svg=${frame.svg}`);
		});

		console.log(projectFileTest);

		new Model().setProjectViaFile(projectFileTest);

	}

	/**
	 * use this to setup the intercalculate the inbetween frams are calculated
	 *
	 * @param {*} projectFile  json file that holds the keyframes and project files
	 */
	init() {
		if (this.IS_DEBUG) console.info('Inter.init()');

		// Calculate data for all frames and add to project
		const frames = this.projectFileTest.frames;
		this.projectFileTest.calculated = this.getFrameData(frames);
		this.projectFileTest.calculated.forEach(frame => {
			// console.log(`Frame ${frame.frameNumber}: svg=${frame.svg}`);
		});

		console.log(this.projectFileTest);

		new Model().setProjectViaFile(this.projectFileTest);

	}

	parseSVG(svg) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svg, 'image/svg+xml');

		const parseElements = (selector) => {
			return Array.from(doc.querySelectorAll(selector)).map(elem => ({
				tag: elem.tagName,
				attrs: Array.from(elem.attributes).reduce((acc, attr) => {
					acc[attr.name] = attr.value;
					return acc;
				}, {}),
				textContent: elem.textContent
			}));
		};

		return {
			circles: parseElements('circle'),
			rects: parseElements('rect'),
			texts: parseElements('text')
		};
	}

	interpolateValue(start, end, fraction) {
		if (start == null || end == null || isNaN(start) || isNaN(end)) {
			console.error("interpolateValue: Start or end value is undefined or NaN", start, end);
			return 0;
		}
		return start + (end - start) * fraction;
	}

	interpolateColor(start, end, fraction) {
		if (!start || !end) {
			console.error("interpolateColor: Start or end color is undefined", start, end);
			return "#000000";
		}

		const startColor = parseInt(start.slice(1), 16);
		const endColor = parseInt(end.slice(1), 16);

		const r = this.interpolateValue((startColor >> 16) & 0xff, (endColor >> 16) & 0xff, fraction);
		const g = this.interpolateValue((startColor >> 8) & 0xff, (endColor >> 8) & 0xff, fraction);
		const b = this.interpolateValue(startColor & 0xff, endColor & 0xff, fraction);

		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	}

	generateSVG(circles, rects, texts) {
		const circleSVG = circles.map(circle =>
			`<circle cx='${circle.cx}' cy='${circle.cy}' r='${circle.r}' stroke='${circle.stroke}' stroke-width='${circle.strokeWidth}' fill='${circle.fill}' />`
		).join('');

		const rectSVG = rects.map(rect =>
			`<rect x='${rect.x}' y='${rect.y}' width='${rect.width}' height='${rect.height}' stroke='${rect.stroke}' stroke-width='${rect.strokeWidth}' fill='${rect.fill}' />`
		).join('');

		const textSVG = texts.map(text =>
			`<text x='${text.x}' y='${text.y}' font-family='Verdana' font-size='${text.fontSize}' fill='${text.fill}'>${text.textContent}</text>`
		).join('');

		return `<svg width='800' height='300' xmlns='http://www.w3.org/2000/svg'>
		${circleSVG}
		${rectSVG}
		${textSVG}
		</svg>`.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '').replaceAll('  ', ' ');
	}

	interpolateElements(startElems, endElems, fraction, elemType) {
		return startElems.map((startElem, index) => {
			const endElem = endElems[index];
			switch (elemType) {
				case 'circle':
					return {
						cx: this.interpolateValue(parseFloat(startElem.attrs.cx), parseFloat(endElem.attrs.cx), fraction),
						cy: this.interpolateValue(parseFloat(startElem.attrs.cy), parseFloat(endElem.attrs.cy), fraction),
						r: this.interpolateValue(parseFloat(startElem.attrs.r), parseFloat(endElem.attrs.r), fraction),
						strokeWidth: this.interpolateValue(parseFloat(startElem.attrs['stroke-width']), parseFloat(endElem.attrs['stroke-width']), fraction),
						stroke: this.interpolateColor(startElem.attrs.stroke, endElem.attrs.stroke, fraction),
						fill: this.interpolateColor(startElem.attrs.fill, endElem.attrs.fill, fraction)
					};
				case 'rect':
					return {
						x: this.interpolateValue(parseFloat(startElem.attrs.x), parseFloat(endElem.attrs.x), fraction),
						y: this.interpolateValue(parseFloat(startElem.attrs.y), parseFloat(endElem.attrs.y), fraction),
						width: this.interpolateValue(parseFloat(startElem.attrs.width), parseFloat(endElem.attrs.width), fraction),
						height: this.interpolateValue(parseFloat(startElem.attrs.height), parseFloat(endElem.attrs.height), fraction),
						strokeWidth: this.interpolateValue(parseFloat(startElem.attrs['stroke-width']), parseFloat(endElem.attrs['stroke-width']), fraction),
						stroke: this.interpolateColor(startElem.attrs.stroke, endElem.attrs.stroke, fraction),
						fill: this.interpolateColor(startElem.attrs.fill, endElem.attrs.fill, fraction)
					};
				case 'text':
					return {
						x: this.interpolateValue(parseFloat(startElem.attrs.x), parseFloat(endElem.attrs.x), fraction),
						y: this.interpolateValue(parseFloat(startElem.attrs.y), parseFloat(endElem.attrs.y), fraction),
						textContent: startElem.textContent,
						fill: startElem.attrs.fill,
						fontSize: this.interpolateValue(parseFloat(startElem.attrs['font-size']), parseFloat(endElem.attrs['font-size']), fraction)
					};
			}
		});
	}

	getFrameData(frames) {
		// console.log(frames);

		const frameData = [];
		const frameSet = new Set();

		for (let i = 0; i < frames.length - 1; i++) {
			const frame1 = frames[i];
			const frame2 = frames[i + 1];

			frame1.svg = frame1.svg.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '').replaceAll('  ', '').replaceAll('> <', '><');
			frame2.svg = frame2.svg.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '').replaceAll('  ', '').replaceAll('> <', '><');
			const attrs1 = this.parseSVG(frame1.svg);
			const attrs2 = this.parseSVG(frame2.svg);

			for (let j = frame1.frameNumber; j <= frame2.frameNumber; j++) {
				if (frameSet.has(j)) continue;  // Skip if frame already exists
				frameSet.add(j);

				const fraction = (j - frame1.frameNumber) / (frame2.frameNumber - frame1.frameNumber);

				const circles = this.interpolateElements(attrs1.circles, attrs2.circles, fraction, 'circle');
				const rects = this.interpolateElements(attrs1.rects, attrs2.rects, fraction, 'rect');
				const texts = this.interpolateElements(attrs1.texts, attrs2.texts, fraction, 'text');

				frameData.push({
					frameNumber: j,
					svg: this.generateSVG(circles, rects, texts)
				});
			}
		}

		// Ensure the last frame is included
		const lastFrame = frames[frames.length - 1];
		const lastAttrs = this.parseSVG(lastFrame.svg);
		frameData.push({
			frameNumber: lastFrame.frameNumber,
			svg: lastFrame.svg
		});

		return frameData;
	}

}

import { Globals } from './globals.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Shortcuts } from './shortcuts.js';
import { Timeline } from './timeline.js';
import { Tools } from './tools.js';
import { Video } from './video.js';

const IS_DEBUG = true;

function init() {
	const project = {
		"exportName": "example_project",
		"projectName": "Example project",
		"creationDate": "2024-11-21",
		"description": "Sample project file with additional metadata.",
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

	function parseSVG(svg) {
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

	function interpolateValue(start, end, fraction) {
		if (start == null || end == null || isNaN(start) || isNaN(end)) {
			console.error("interpolateValue: Start or end value is undefined or NaN", start, end);
			return 0;
		}
		return start + (end - start) * fraction;
	}

	function interpolateColor(start, end, fraction) {
		if (!start || !end) {
			console.error("interpolateColor: Start or end color is undefined", start, end);
			return "#000000";
		}

		const startColor = parseInt(start.slice(1), 16);
		const endColor = parseInt(end.slice(1), 16);

		const r = interpolateValue((startColor >> 16) & 0xff, (endColor >> 16) & 0xff, fraction);
		const g = interpolateValue((startColor >> 8) & 0xff, (endColor >> 8) & 0xff, fraction);
		const b = interpolateValue(startColor & 0xff, endColor & 0xff, fraction);

		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	}

	function generateSVG(circles, rects, texts) {
		const circleSVG = circles.map(circle =>
			`<circle cx='${circle.cx}' cy='${circle.cy}' r='${circle.r}' stroke='${circle.stroke}' stroke-width='${circle.strokeWidth}' fill='${circle.fill}' />`
		).join('');

		const rectSVG = rects.map(rect =>
			`<rect x='${rect.x}' y='${rect.y}' width='${rect.width}' height='${rect.height}' stroke='${rect.stroke}' stroke-width='${rect.strokeWidth}' fill='${rect.fill}' />`
		).join('');

		const textSVG = texts.map(text =>
			`<text x='${text.x}' y='${text.y}' font-family='Verdana' font-size='${text.fontSize}' fill='${text.fill}'>${text.textContent}</text>`
		).join('');

		return `<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'>
                ${circleSVG}
                ${rectSVG}
                ${textSVG}
            </svg>`.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '').replaceAll('  ', ' ');
	}

	function interpolateElements(startElems, endElems, fraction, elemType) {
		return startElems.map((startElem, index) => {
			const endElem = endElems[index];
			switch (elemType) {
				case 'circle':
					return {
						cx: interpolateValue(parseFloat(startElem.attrs.cx), parseFloat(endElem.attrs.cx), fraction),
						cy: interpolateValue(parseFloat(startElem.attrs.cy), parseFloat(endElem.attrs.cy), fraction),
						r: interpolateValue(parseFloat(startElem.attrs.r), parseFloat(endElem.attrs.r), fraction),
						strokeWidth: interpolateValue(parseFloat(startElem.attrs['stroke-width']), parseFloat(endElem.attrs['stroke-width']), fraction),
						stroke: interpolateColor(startElem.attrs.stroke, endElem.attrs.stroke, fraction),
						fill: interpolateColor(startElem.attrs.fill, endElem.attrs.fill, fraction)
					};
				case 'rect':
					return {
						x: interpolateValue(parseFloat(startElem.attrs.x), parseFloat(endElem.attrs.x), fraction),
						y: interpolateValue(parseFloat(startElem.attrs.y), parseFloat(endElem.attrs.y), fraction),
						width: interpolateValue(parseFloat(startElem.attrs.width), parseFloat(endElem.attrs.width), fraction),
						height: interpolateValue(parseFloat(startElem.attrs.height), parseFloat(endElem.attrs.height), fraction),
						strokeWidth: interpolateValue(parseFloat(startElem.attrs['stroke-width']), parseFloat(endElem.attrs['stroke-width']), fraction),
						stroke: interpolateColor(startElem.attrs.stroke, endElem.attrs.stroke, fraction),
						fill: interpolateColor(startElem.attrs.fill, endElem.attrs.fill, fraction)
					};
				case 'text':
					return {
						x: interpolateValue(parseFloat(startElem.attrs.x), parseFloat(endElem.attrs.x), fraction),
						y: interpolateValue(parseFloat(startElem.attrs.y), parseFloat(endElem.attrs.y), fraction),
						textContent: startElem.textContent,
						fill: startElem.attrs.fill,
						fontSize: interpolateValue(parseFloat(startElem.attrs['font-size']), parseFloat(endElem.attrs['font-size']), fraction)
					};
			}
		});
	}

	function getFrameData(frames) {
		const frameData = [];
		const frameSet = new Set();

		for (let i = 0; i < frames.length - 1; i++) {
			const frame1 = frames[i];
			const frame2 = frames[i + 1];
			frame1.svg = frame1.svg.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '').replaceAll('  ', '').replaceAll('> <', '><');
			frame2.svg = frame1.svg.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '').replaceAll('  ', '').replaceAll('> <', '><');
			const attrs1 = parseSVG(frame1.svg);
			const attrs2 = parseSVG(frame2.svg);

			for (let j = frame1.frameNumber; j <= frame2.frameNumber; j++) {
				if (frameSet.has(j)) continue;  // Skip if frame already exists
				frameSet.add(j);

				const fraction = (j - frame1.frameNumber) / (frame2.frameNumber - frame1.frameNumber);

				const circles = interpolateElements(attrs1.circles, attrs2.circles, fraction, 'circle');
				const rects = interpolateElements(attrs1.rects, attrs2.rects, fraction, 'rect');
				const texts = interpolateElements(attrs1.texts, attrs2.texts, fraction, 'text');

				frameData.push({
					frameNumber: j,
					svg: generateSVG(circles, rects, texts)
				});
			}
		}

		// Ensure the last frame is included
		const lastFrame = frames[frames.length - 1];
		const lastAttrs = parseSVG(lastFrame.svg);
		frameData.push({
			frameNumber: lastFrame.frameNumber,
			svg: lastFrame.svg
		});

		return frameData;
	}

	// Calculate data for all frames and add to project
	const frames = project.frames;
	project.calculated = getFrameData(frames);
	project.calculated.forEach(frame => {
		// console.log(`Frame ${frame.frameNumber}: svg=${frame.svg}`);
	});

	console.log(project);

	new Model().file(project);


}

// Export an object to group the functions
export const Inter = {
	init,
}


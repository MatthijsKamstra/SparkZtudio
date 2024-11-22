import { Globals } from './globals.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Model, ProjectVars } from './model.js';
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
				"svg": "<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='40' stroke='#000000' stroke-width='3' fill='#ff3333' /></svg>",
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 10,
				"svg": "<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='100' r='30' stroke='#00dd00' stroke-width='4' fill='#ffcc00' /></svg>",
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 20,
				"svg": "<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'><circle cx='150' cy='150' r='50' stroke='#0000dd' stroke-width='6' fill='#333333' /></svg>",
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 30,
				"svg": "<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'><circle cx='200' cy='200' r='20' stroke='#dddd00' stroke-width='2' fill='#3333ff' /></svg>",
				"tween": "linear",
				"keyframe": true
			}
		],
		"calculated": []
	}

	function parseSVG(svg) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svg, 'image/svg+xml');
		const circle = doc.querySelector('circle');
		return {
			cx: parseFloat(circle.getAttribute('cx')),
			cy: parseFloat(circle.getAttribute('cy')),
			r: parseFloat(circle.getAttribute('r')),
			strokeWidth: parseFloat(circle.getAttribute('stroke-width')),
			stroke: circle.getAttribute('stroke'),
			fill: circle.getAttribute('fill')
		};
	}

	function interpolateValue(start, end, fraction) {
		return start + (end - start) * fraction;
	}

	function interpolateColor(start, end, fraction) {
		const startColor = parseInt(start.slice(1), 16);
		const endColor = parseInt(end.slice(1), 16);

		const r = interpolateValue((startColor >> 16) & 0xff, (endColor >> 16) & 0xff, fraction);
		const g = interpolateValue((startColor >> 8) & 0xff, (endColor >> 8) & 0xff, fraction);
		const b = interpolateValue(startColor & 0xff, endColor & 0xff, fraction);

		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	}

	function generateSVG(cx, cy, r, strokeWidth, stroke, fill) {
		return `<svg width='${project.width}' height='${project.height}' xmlns='http://www.w3.org/2000/svg'><circle cx='${cx}' cy='${cy}' r='${r}' stroke='${stroke}' stroke-width='${strokeWidth}' fill='${fill}' /></svg>`;
	}

	function getFrameData(frames) {
		const frameData = [];
		const frameSet = new Set();

		for (let i = 0; i < frames.length - 1; i++) {
			const frame1 = frames[i];
			const frame2 = frames[i + 1];
			const attrs1 = parseSVG(frame1.svg);
			const attrs2 = parseSVG(frame2.svg);

			for (let j = frame1.frameNumber; j <= frame2.frameNumber; j++) {
				if (frameSet.has(j)) continue;  // Skip if frame already exists
				frameSet.add(j);

				const fraction = (j - frame1.frameNumber) / (frame2.frameNumber - frame1.frameNumber);
				const cx = interpolateValue(attrs1.cx, attrs2.cx, fraction);
				const cy = interpolateValue(attrs1.cy, attrs2.cy, fraction);
				const r = interpolateValue(attrs1.r, attrs2.r, fraction);
				const strokeWidth = interpolateValue(attrs1.strokeWidth, attrs2.strokeWidth, fraction);
				const stroke = interpolateColor(attrs1.stroke, attrs2.stroke, fraction);
				const fill = interpolateColor(attrs1.fill, attrs2.fill, fraction);

				frameData.push({
					frameNumber: j,
					svg: generateSVG(cx, cy, r, strokeWidth, stroke, fill)
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
		console.log(`Frame ${frame.frameNumber}: svg=${frame.svg}`);
	});

	console.log(project);

}

// Export an object to group the functions
export const Inter = {
	init,
}

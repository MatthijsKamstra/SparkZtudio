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
		"frameLength": 30,
		"frames": [
			{
				"frameNumber": 1,
				"svg": "<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='40' stroke='#000000' stroke-width='3' fill='#ff3333' /></svg>",
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 10,
				"svg": "<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'><circle cx='150' cy='150' r='50' stroke='#0000dd' stroke-width='6' fill='#333333' /></svg>",
				"tween": "linear",
				"keyframe": true
			},
			{
				"frameNumber": 20,
				"svg": "<svg width='600' height='300' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='40' stroke='#000000' stroke-width='3' fill='#ff3333' /></svg>",
				"tween": "linear",
				"keyframe": true
			}
		]
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
		// Simple linear interpolation for RGB colors
		const startColor = parseInt(start.slice(1), 16);
		const endColor = parseInt(end.slice(1), 16);

		const r = interpolateValue((startColor >> 16) & 0xff, (endColor >> 16) & 0xff, fraction);
		const g = interpolateValue((startColor >> 8) & 0xff, (endColor >> 8) & 0xff, fraction);
		const b = interpolateValue(startColor & 0xff, endColor & 0xff, fraction);

		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	}

	function getFrameData(frames) {
		const frameData = [];

		for (let i = 0; i < frames.length - 1; i++) {
			const frame1 = frames[i];
			const frame2 = frames[i + 1];
			const attrs1 = parseSVG(frame1.svg);
			const attrs2 = parseSVG(frame2.svg);

			for (let j = frame1.frameNumber; j <= frame2.frameNumber; j++) {
				const fraction = (j - frame1.frameNumber) / (frame2.frameNumber - frame1.frameNumber);
				const cx = interpolateValue(attrs1.cx, attrs2.cx, fraction);
				const cy = interpolateValue(attrs1.cy, attrs2.cy, fraction);
				const r = interpolateValue(attrs1.r, attrs2.r, fraction);
				const strokeWidth = interpolateValue(attrs1.strokeWidth, attrs2.strokeWidth, fraction);
				const stroke = interpolateColor(attrs1.stroke, attrs2.stroke, fraction);
				const fill = interpolateColor(attrs1.fill, attrs2.fill, fraction);
				const key = (j == frame1.frameNumber);

				frameData.push({
					frameNumber: j,
					cx,
					cy,
					r,
					strokeWidth,
					stroke,
					fill,
					key
				});
			}
		}

		return frameData;
	}

	// Calculate data for all frames
	const frames = project.frames;
	const allFrameData = getFrameData(frames);
	allFrameData.forEach(frame => {
		console.log(`Frame ${frame.frameNumber}: cx=${frame.cx}, cy=${frame.cy}, r=${frame.r}, stroke-width=${frame.strokeWidth}, stroke=${frame.stroke}, fill=${frame.fill}, key=${frame.key}`);
	});
}

// Export an object to group the functions
export const Inter = {
	init,
}

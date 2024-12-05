import { ExportVideo } from './export-video.js';
import { Globals } from './globals.js';
import { InterDummyData } from './inter-dummy-data.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Model, ProjectVars } from './model/model.js';
import { Properties } from './properties.js';
import { Shortcuts } from './shortcuts.js';
import { Timeline } from './timeline.js';
import { Tools } from './tools.js';
import { ColorConverter } from './utils/color-converter.js';

export class Inter {

	IS_DEBUG = true;

	constructor() {
		if (this.IS_DEBUG) console.info(`Inter constructor inter.js -- isSingleton: ${Inter.instance != null}`);
		if (Inter.instance) {
			return Inter.instance;
		}
		Inter.instance = this;

		// Initialize any properties
		this.data = "I am a singleton";

		this.testData();
	}

	getData() {
		return this.data;
	}

	setData(newData) {
		this.data = newData;
	}

	testData() {

		if (this.IS_DEBUG) console.groupCollapsed('Inter.testData()');

		// test colors
		const interpolatedColor = this.interpolateColor("#ff3333", "#3333ff", 0.5);
		if (this.IS_DEBUG) console.log(`Interpolated color: ${interpolatedColor}`);
		if (this.IS_DEBUG) console.log(this.interpolateColor("#ff3333", "#3333ff", 0.010101010101010102));

		// Example usage
		const svgString = `<svg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='768' height='576' viewBox='0 0 203.2 152.4'><ellipse cx='41.176' cy='254.962' rx='30.01' ry='31.405' style='opacity:1;fill:tomato;stroke:#98fb98;stroke-width:20;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;paint-order:stroke fill markers' transform='translate(0 -213.557)'/></svg>`;
		const converter = new ColorConverter();
		const updatedSVG = converter.convertSVGColors(converter.convertStyleToAttributes(svgString));
		console.log(updatedSVG);

		if (this.IS_DEBUG) console.groupEnd();

		setTimeout(() => {
			console.clear();
			// fix calculated values, cleaning up svg, etc
			// this.setup(InterDummyData.sparkzInkscapeMinifiedFileWithStyle);
			this.setup(InterDummyData.sparkzRectangle);
			// this.setup(InterDummyData.sparkzInkscapeMinifiedFile);
			// this.setup(InterDummyData.sparkzDefaultFile);
		}, 2000);
	}

	/**
	 * use this to setup the intercalculate the inbetween frams are calculated
	 *
	 * @param {*} useThisProjectFile  json file that holds the keyframes and project files
	 */
	setup(useThisProjectFile) {
		if (this.IS_DEBUG) {
			console.groupCollapsed('Inter.setup(..)');
			console.log(useThisProjectFile);
			console.groupEnd();
		}
		// Validate project file
		this.validateAndCorrectProjectFile(useThisProjectFile);

		// Calculate data for all frames and add to project
		// const frames = useThisProjectFile.frames;
		useThisProjectFile.calculated = this.getFrameData(useThisProjectFile);
		useThisProjectFile.calculated.forEach(frame => {
			// console.log(`Frame ${frame.frameNumber}: svg=${frame.svg}`);
		});

		console.log(useThisProjectFile);

		// new Model().setProjectViaFile(projectFile);
	}

	/**
	 * use this to setup the intercalculate the inbetween frams are calculated
	 */
	calculatedFramesFromProjectVars() {
		if (this.IS_DEBUG) console.info('Inter.calculatedFramesFromProjectVars');

		// Validate project file
		this.validateAndCorrectProjectFile(ProjectVars);

		// Calculate data for all frames and add to project
		// const frames = ProjectVars.frames;
		ProjectVars.calculated = this.getFrameData(ProjectVars);
		ProjectVars.calculated.forEach(frame => {
			// console.log(`Frame ${frame.frameNumber}: svg=${frame.svg}`);
		});

		console.log('Inter.calculatedFramesFromProjectVars: ProjectVars');
		console.log(ProjectVars);

		// new Model().setProjectViaFile(ProjectVars);

	}

	/**
	 * Validates and corrects the project file to ensure consistency and proper formatting.
	 *
	 * This method performs the following checks and corrections:
	 * 1. Ensures the frame length is greater than or equal to the last frame's number and adjusts it if necessary.
	 * 2. Ensures the frame length divided by the frame rate equals the time and corrects the time if needed.
	 * 3. Adjusts the width, height, and viewBox attributes in the frames' SVG content to match the project's width and height.
	 * 4. Cleans up the SVG content in the frames by removing line breaks, tabs, comments, and extra spaces.
	 * 5. Converts default web color names to their corresponding hex values in the frames' SVG content.
	 *
	 * @param {Object} useThisProjectFile  - The project file object containing frame details and metadata.
	 *
	 * @throws {Error} Throws an error if the frame length is less than the last frame's number.
	 */
	validateAndCorrectProjectFile(useThisProjectFile) {
		if (this.IS_DEBUG) {
			console.groupCollapsed(`Inter.validateAndCorrectProjectFile(...)`);
			console.log(useThisProjectFile);
			console.groupEnd();
		}

		const lastFrameNumber = useThisProjectFile.frames[useThisProjectFile.frames.length - 1].frameNumber;
		const frameLength = useThisProjectFile.frameLength;
		const frameRate = useThisProjectFile.frameRate;
		let time = useThisProjectFile.time;

		if (this.IS_DEBUG) {
			console.groupCollapsed(`1) Check values, and update if needed`);
			console.log('lastFrameNumber: ' + lastFrameNumber);
			console.log('frameLength: ' + frameLength);
			console.log('frameRate: ' + frameRate);
			console.log('time: ' + time);
			console.log('projectFile.frames.length: ' + useThisProjectFile.frames.length);
			console.groupEnd();
		}

		// Correct frame length if needed
		if (frameLength < lastFrameNumber) {
			console.warn(`Frame length is less than the last frame's number. Setting frame length to ${lastFrameNumber}.`);
			useThisProjectFile.frameLength = lastFrameNumber;
		}

		// Correct time if needed
		if (useThisProjectFile.frameLength / frameRate !== time) {
			time = useThisProjectFile.frameLength / frameRate;
			console.warn(`Time is inconsistent with frame length and frame rate. Setting time to ${time}.`);
			useThisProjectFile.time = time;
		}

		// Create a ColorConverter instance
		const converter = new ColorConverter();

		// Check and correct the frames' SVG width and height to match the project dimensions and clean up SVG
		useThisProjectFile.frames.forEach(frame => {
			// Clean up SVG content and convert color names to hex values
			let cleanedSVG = frame.svg
				.replace(/[\n\r\t]/g, '') // Remove line breaks and tabs
				.replace(/<!--.*?-->/g, '') // Remove comments
				.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
				.trim(); // Trim leading and trailing spaces

			cleanedSVG = converter.convertSVGColors(converter.convertSVGColors(converter.convertStyleToAttributes(cleanedSVG))); // Convert color names to hex values

			const svgWidthMatch = cleanedSVG.match(/width=['"](\d+)['"]/);
			const svgHeightMatch = cleanedSVG.match(/height=['"](\d+)['"]/);
			const svgViewBoxMatch = cleanedSVG.match(/viewBox=['"]([0-9\s]+)['"]/);

			const svgWidth = svgWidthMatch ? parseInt(svgWidthMatch[1], 10) : useThisProjectFile.width;
			const svgHeight = svgHeightMatch ? parseInt(svgHeightMatch[1], 10) : useThisProjectFile.height;

			// Adjust width and height to match project dimensions
			if (svgWidth !== useThisProjectFile.width || svgHeight !== useThisProjectFile.height) {
				cleanedSVG = cleanedSVG
					.replace(/width=['"]\d+['"]/, `width="${useThisProjectFile.width}"`)
					.replace(/height=['"]\d+['"]/, `height="${useThisProjectFile.height}"`);

				if (svgViewBoxMatch) {
					cleanedSVG = cleanedSVG.replace(/viewBox=['"][0-9\s]+['"]/, `viewBox="0 0 ${useThisProjectFile.width} ${useThisProjectFile.height}"`);
				} else {
					cleanedSVG = cleanedSVG.replace(/<svg/, `<svg viewBox="0 0 ${useThisProjectFile.width} ${useThisProjectFile.height}"`);
				}

				console.warn(`Adjusted frame ${frame.frameNumber} SVG dimensions to match project dimensions.`);
			}

			frame.svg = cleanedSVG;
		});

		// if (this.IS_DEBUG) {
		// 	console.groupCollapsed(`2) Check values, and update if needed`);
		// 	console.log('lastFrameNumber: ' + lastFrameNumber);
		// 	console.log('frameLength: ' + frameLength);
		// 	console.log('frameRate: ' + frameRate);
		// 	console.log('time: ' + time);
		// 	console.log('projectFile.frames.length: ' + projectFile.frames.length);
		// 	console.groupEnd();
		// }
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
			ellipses: parseElements('ellipse'),
			circles: parseElements('circle'),
			rects: parseElements('rect'),
			texts: parseElements('text')
		};
	}

	interpolateValue(start, end, fraction) {
		return Math.round(start + (end - start) * fraction);
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

		// console.log(`Interpolated color components: R: ${r}, G: ${g}, B: ${b}`);
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	}

	generateSVG(ellipses, circles, rects, texts) {
		const ellipseSVG = ellipses.map(ellipse =>
			`<ellipse cx='${ellipse.cx}' cy='${ellipse.cy}' rx='${ellipse.rx}' ry='${ellipse.ry}' stroke='${ellipse.stroke}' stroke-width='${ellipse.strokeWidth}' fill='${ellipse.fill}' />`
		).join('');

		const circleSVG = circles.map(circle =>
			`<circle cx='${circle.cx}' cy='${circle.cy}' r='${circle.r}' stroke='${circle.stroke}' stroke-width='${circle.strokeWidth}' fill='${circle.fill}' />`
		).join('');

		const rectSVG = rects.map(rect =>
			`<rect x='${rect.x}' y='${rect.y}' width='${rect.width}' height='${rect.height}' stroke='${rect.stroke}' stroke-width='${rect.strokeWidth}' fill='${rect.fill}' />`
		).join('');

		const textSVG = texts.map(text =>
			`<text x='${text.x}' y='${text.y}' font-family='Verdana' font-size='${text.fontSize}' fill='${text.fill}'>${text.textContent}</text>`
		).join('');

		return `<svg width='${ProjectVars.width}' height='${ProjectVars.height}' xmlns='http://www.w3.org/2000/svg'>
		${ellipseSVG}
		${circleSVG}
		${rectSVG}
		${textSVG}
		</svg>`.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '').replaceAll('  ', ' ');
	}

	/**
	 *
	 * @param {*} startElems
	 * @param {*} endElems
	 * @param {*} fraction
	 * @param {*} elemType
	 * @returns
	 */
	interpolateElements(startElems, endElems, fraction, elemType) {
		// console.log(startElems, endElems, fraction, elemType);

		return startElems.map((startElem, index) => {
			const endElem = endElems[index];
			switch (elemType) {
				case 'ellipse':
					// console.log(startElem.attrs.cx);
					// console.log(startElem.attrs.cy);
					// console.log(startElem.attrs.rx);
					// console.log(startElem.attrs.ry);

					return {
						cx: this.interpolateValue(parseFloat(startElem.attrs.cx), parseFloat(endElem.attrs.cx), fraction),
						cy: this.interpolateValue(parseFloat(startElem.attrs.cy), parseFloat(endElem.attrs.cy), fraction),
						rx: this.interpolateValue(parseFloat(startElem.attrs.rx), parseFloat(endElem.attrs.rx), fraction),
						ry: this.interpolateValue(parseFloat(startElem.attrs.ry), parseFloat(endElem.attrs.ry), fraction),
						strokeWidth: this.interpolateValue(parseFloat(startElem.attrs['stroke-width']), parseFloat(endElem.attrs['stroke-width']), fraction),
						stroke: this.interpolateColor(startElem.attrs.stroke, endElem.attrs.stroke, fraction),
						fill: this.interpolateColor(startElem.attrs.fill, endElem.attrs.fill, fraction)
					};
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
				default:
					console.warn('oeps');

			}
		});
	}

	/**
	 *
	 * @param {*} useThisProjectFile
	 * @returns
	 */
	getFrameData(useThisProjectFile) {
		if (this.IS_DEBUG) {
			console.group('Inter.getFrameData( ... )');
			console.log('useThisProjectFile:');
			console.log(useThisProjectFile);
			console.groupEnd();
		}
		const e = [];
		const frameLength = useThisProjectFile.frameLength || 120; // Default frame length if not provided
		const singleFrame = useThisProjectFile.frames[0]; // Assuming projectFile has only one frame

		// Adding the new functionality to repeat the single frame
		for (let i = 1; i <= frameLength; i++) {
			e.push({
				frameNumber: i,
				svg: singleFrame.svg
			});
		}

		// Now let's include the existing interpolation logic as well
		const existingData = [];
		const r = new Set;
		for (let s = 0; s < useThisProjectFile.frames.length - 1; s++) {
			const a = useThisProjectFile.frames[s], l = useThisProjectFile.frames[s + 1];
			a.svg = a.svg.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("  ", "").replaceAll("> <", "><");
			l.svg = l.svg.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("  ", "").replaceAll("> <", "><");
			const o = this.parseSVG(a.svg), i = this.parseSVG(l.svg);
			for (let t = a.frameNumber; t <= l.frameNumber; t++) {
				if (r.has(t)) continue;
				r.add(t);
				const s = (t - a.frameNumber) / (l.frameNumber - a.frameNumber), n = this.interpolateElements(o.ellipses, i.ellipses, s, "ellipse"), c = this.interpolateElements(o.circles, i.circles, s, "circle"), p = this.interpolateElements(o.rects, i.rects, s, "rect"), h = this.interpolateElements(o.texts, i.texts, s, "text");
				existingData.push({
					frameNumber: t,
					svg: this.generateSVG(n, c, p, h)
				});
			}
		}
		const s = useThisProjectFile.frames[useThisProjectFile.frames.length - 1];
		this.parseSVG(s.svg);
		existingData.push({ frameNumber: s.frameNumber, svg: s.svg });

		// Merge the existing and new data
		const combinedData = e.concat(existingData);

		return combinedData;
	}



}

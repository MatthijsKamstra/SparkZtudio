const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const folderPath = '../examples/svg/export';
const projectFilePrefix = 'gen_project_';

const getSvgFiles = (folderPath) => {
	return fs.readdirSync(folderPath).filter(file => file.endsWith('.svg'));
};

const cleanSvgContent = (svg) => {
	return svg.replace(/[\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim();
};

const minifySvg = (svg) => {
	const result = optimize(svg, {
		multipass: true,
		plugins: [
			'preset-default',
			// 'removeDimensions', // Ensures width and height attributes are removed
			{

				name: 'cleanupIds',
				params: {
					remove: false,
					minify: false,
					preserve: [],
					preservePrefixes: [],
					force: false
				}
			}
		],
	});
	return result.data;
};

const getCurrentDate = () => {
	const date = new Date();
	return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

const extractDimensions = (svg) => {
	const widthMatch = svg.match(/width="(\d+)"/);
	const heightMatch = svg.match(/height="(\d+)"/);
	const width = widthMatch ? parseInt(widthMatch[1]) : 600; // default if not found
	const height = heightMatch ? parseInt(heightMatch[1]) : 300; // default if not found
	return { width, height }
};

const createProjectFile = (projectNumber, svgFiles) => {
	const creationDate = getCurrentDate();
	const projectName = `Project ${projectNumber}`;
	const exportName = `project_${projectNumber}`;
	const frameRate = 24;
	const totalTime = 10;

	const frames = svgFiles.map((file, index) => {
		const svgContent = fs.readFileSync(path.join(folderPath, file), 'utf-8');
		const cleanedSvg = cleanSvgContent(svgContent);
		const minifiedSvg = minifySvg(cleanedSvg);
		const { width, height } = extractDimensions(minifiedSvg);
		return {
			frameNumber: (index * frameRate) + 1,
			svg: minifiedSvg,
			keyframe: true,
			// width,
			// height
		};
	});

	const { width, height } = extractDimensions(frames[0].svg);

	const projectData = {
		exportName,
		projectName,
		creationDate,
		description: `Sample ${exportName} file create on ${creationDate}.`,
		version: '1.0',
		width,
		height,
		frameRate: frameRate,
		frameLength: (frameRate * totalTime),
		totalTime: totalTime,
		frames
	};

	fs.writeFileSync(`${folderPath}/${projectFilePrefix}${projectNumber}.json`, JSON.stringify(projectData, null, 2));
};

const svgFiles = getSvgFiles(folderPath);

console.log(svgFiles);


const batchSize = 2; // Change this to create more project files if needed
for (let i = 0; i < svgFiles.length; i += batchSize) {
	const batch = svgFiles.slice(i, i + batchSize);
	console.log(batch);

	createProjectFile(i / batchSize + 1, batch);
}

console.log('Project files created successfully!');

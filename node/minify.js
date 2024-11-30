const fs = require('fs');
const path = require('path');
const terser = require('terser');

class Minifier {
	constructor(inputPath) {
		this.inputPath = inputPath;
		this.outputPath = this.generateOutputPath();
	}

	generateOutputPath() {
		const dir = path.dirname(this.inputPath);
		const ext = path.extname(this.inputPath);
		const name = path.basename(this.inputPath, ext) + '.min' + ext;
		return path.join(dir, name);
	}

	async minify() {
		try {
			const code = fs.readFileSync(this.inputPath, 'utf-8');
			const result = await terser.minify(code);
			if (result.error) {
				throw result.error;
			}
			fs.writeFileSync(this.outputPath, result.code);
			console.log(`Minified file created: ${this.outputPath}`);
		} catch (error) {
			console.error(`Error during minification: ${error.message}`);
		}
	}
}

// Usage example:
const minifier = new Minifier('../js/inter.js');
minifier.minify();

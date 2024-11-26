import { Model, ProjectVars } from './model/model.js';

export class ExportVideo {

	ctx;
	mediaRecorder;
	recordedChunks = [];
	frameIndex = 0;
	animationInterval;
	lastValidFrame = null; // To store the last valid frame
	imageArray = [];

	IS_DEBUG = true;

	constructor() {
		if (this.IS_DEBUG) console.info(`constructor export-video.js`);
		const canvas = document.getElementById("canvas");
		this.ctx = canvas.getContext("2d");
	}

	init() {
		if (this.IS_DEBUG) {
			console.group('ExportVideo.init');
			console.groupEnd();
		}

		this.reset();
		this.setup();

		this.isCodecSupportedList(); // test of de codec werken

		// Initialize the canvas with the first SVG
		this.initializeCanvas();

	}

	isCodecSupportedList() {
		const mimeTypes = [
			'video/webm',
			'video/webm;codecs=vp8',
			'video/webm;codecs=vp9',
			'video/webm;codecs=vp9.0',
			'video/webm;codecs=h264',
			'video/webm;codecs=av1',
			'video/mp4',
			'audio/webm',
			'audio/webm;codecs=opus',
			'audio/webm;codecs=vorbis',
			'audio/mp4',

			"video/webm",
			"audio/webm",
			"video/webm;codecs=vp8",
			"video/webm;codecs=daala",
			"video/webm;codecs=h264",
			"audio/webm;codecs=opus",
			"video/mp4",
		];

		if (this.IS_DEBUG) console.groupCollapsed('Is Codec supported?');
		mimeTypes.forEach((mimeType) => {
			const isSupported = this.isCodecSupported(mimeType);
			if (this.IS_DEBUG) console.log(`${mimeType}: ${isSupported ? 'Supported' : 'Not Supported'}`);
		});
		if (this.IS_DEBUG) console.groupEnd();

	}

	/**
	 * setup UX
	 */
	setup() {
		const startRecordingButton = document.getElementById("startRecording");
		const stopRecordingButton = document.getElementById("stopRecording");
		const confirmExportButton = document.getElementById("confirmExport");
		startRecordingButton.addEventListener("click", () => this.startRecording());
		stopRecordingButton.addEventListener("click", () => this.stopRecording());
		confirmExportButton.addEventListener("click", () => this.confirmExport());
	}

	initializeCanvas() {
		if (this.IS_DEBUG) {
			console.group('ExportVideo.initializeCanvas()');
			console.log(ProjectVars);
			console.groupEnd();
		}

		this.reset();
		this.updateProgressBar();

		// Set canvas dimensions
		const canvas = document.getElementById("canvas");
		canvas.width = ProjectVars.width;
		canvas.height = ProjectVars.height;

		if (this.IS_DEBUG) {
			console.log(ProjectVars.projectName);
			console.log('ProjectVars.frames.length: ' + ProjectVars.frames.length);
			console.log('ProjectVars.calculated.length: ' + ProjectVars.calculated.length);
		}

		if (this.IS_DEBUG) console.groupCollapsed('-- preRenderSVGs');
		this.preRenderSVGs(ProjectVars.frames, () => {
			if (this.IS_DEBUG) console.log('ExportVideo.initializeCanvas(): Renders ready!');
		});
		if (this.IS_DEBUG) console.groupEnd('-- preRenderSVGs');

		if (ProjectVars.frames && ProjectVars.frames.length > 0) {
			const firstFrame = ProjectVars.frames[0];
			this.drawSVG(firstFrame.svg, () => { }); // Draw the first frame's SVG
		} else {
			if (this.IS_DEBUG) console.error("No frames found in ProjectVars!");
		}
	}

	/**
	 * improve the load for svg new Export().image() ?????
	 * to draw SVG onto canvas
	 *
	 * @param {*} svg
	 * @param {*} callback
	 */
	drawSVG(svg, callback) {
		const svgBlob = new Blob([svg], { type: "image/svg+xml" });
		const url = URL.createObjectURL(svgBlob);
		const img = new Image();
		img.onload = () => {
			this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
			this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the SVG
			URL.revokeObjectURL(url); // Clean up the object URL
			callback(img);
		};
		img.src = url;
	}

	/**
	 * Pre-render all SVGs and store in an array
	 *
	 * @param {*} frames
	 * @param {*} callback
	 */
	preRenderSVGs(frames, callback) {
		// reset values
		let loadedCount = 0;
		this.imageArray = [];
		frames.forEach((frame, index) => {
			this.drawSVG(frame.svg, (img) => {
				this.imageArray[index] = img;
				loadedCount++;
				if (this.IS_DEBUG) console.log(`${loadedCount}/${frames.length}`);
				if (loadedCount === frames.length) {
					if (this.IS_DEBUG) console.log('All SVGs have been prerendered and stored.');
					callback();
				}
			});
		});
	}

	// Update the progress bar
	updateProgressBar() {
		const progress = ((this.frameIndex / ProjectVars.frameLength) * 100).toFixed(2);
		const progressBar = document.querySelector(".progress-bar");
		progressBar.style.width = `${progress}%`;
		progressBar.textContent = `${progress}%`;
	}

	startCanvasAnimation() {
		this.frameIndex = 0;
		const intervalMs = 1000 / ProjectVars.frameRate; // Time per frame in milliseconds
		const totalTime = (ProjectVars.frameLength / ProjectVars.frameRate).toFixed(2); // Total duration in seconds

		this.animationInterval = setInterval(() => {
			// Stop animation when the frameIndex exceeds the frameLength
			if (this.frameIndex >= ProjectVars.frameLength) {
				this.stopCanvasAnimation(); // Stop the animation interval
				if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
					this.mediaRecorder.stop(); // Stop recording
					if (this.IS_DEBUG) console.log("Recording stopped...");
				}
				return;
			}

			// Get the current frame image
			let img = this.imageArray[this.frameIndex];

			// If the current frame is null, use the last valid image
			if (!img && this.lastValidFrame) {
				img = this.lastValidFrame;
			}

			// If there is no valid frame, log an error and stop the animation
			if (!img) {
				if (this.IS_DEBUG) console.error(`No valid frame found at index: ${frameIndex}`);
				this.stopCanvasAnimation();
				return;
			}

			// Store the current frame if it's valid (not null)
			if (img) {
				this.lastValidFrame = img;
			}

			// Clear the canvas before drawing new content
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
			// check if transparancy is possible, if not generate a white background
			if (!this.isCodecSupported('video/webm;codecs=vp9')) {
				this.ctx.fillStyle = 'white'; // white background
				this.ctx.fillRect(0, 0, canvas.width, canvas.height);
			}

			// Draw the current frame (image)
			this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			// only visible in debug mode
			if (this.IS_DEBUG) {
				// Overlay frame information after the SVG is drawn
				this.ctx.font = "20px Arial";
				this.ctx.fillStyle = "red";
				const currentTime = (this.frameIndex / ProjectVars.frameRate).toFixed(2); // Current time in seconds

				// Text for Frame Info (draw after the SVG)
				this.ctx.fillText(`Frame: ${this.frameIndex + 1}/${ProjectVars.frameLength}`, 20, 60);
				this.ctx.fillText(`Frame Rate: ${ProjectVars.frameRate} FPS`, 20, 90);
				this.ctx.fillText(`Time: ${currentTime}s / ${totalTime}s`, 20, 120);
			}

			// Update progress
			this.frameIndex++;
			this.updateProgressBar();
		}, intervalMs);
	}

	stopCanvasAnimation() {
		if (this.animationInterval) {
			clearInterval(this.animationInterval);
			this.reset();
		}
	}

	reset() {
		this.animationInterval = null;
		this.recordedChunks = [];
		this.frameIndex = 0;
	}

	// Start recording
	startRecording() {
		const canvas = document.getElementById("canvas");
		const canvasStream = canvas.captureStream(ProjectVars.frameRate); // Capture at project frame rate
		let options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 1000000, }; // with transparancy (Firefox doesn't support)

		console.log(this.isCodecSupported(options.mimeType));


		if (!this.isCodecSupported(options.mimeType)) {
			options = { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 1000000, }; // supported by Firefox
		}
		this.mediaRecorder = new MediaRecorder(canvasStream, options);

		this.mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				this.recordedChunks.push(event.data);
			}
		};

		this.mediaRecorder.onstop = () => {
			const blob = new Blob(this.recordedChunks, { type: "video/webm" });
			const url = URL.createObjectURL(blob);

			// Create a downloadable link
			const a = document.createElement("a");
			a.style.display = "none";
			a.href = url;
			a.download = `${ProjectVars.exportName}.webm`;
			document.body.appendChild(a);
			a.click();

			// Clean up
			URL.revokeObjectURL(url);
			this.recordedChunks = [];
		};

		this.mediaRecorder.start();
		this.startCanvasAnimation();
		console.log("Recording started...");
	}

	// Stop recording
	stopRecording() {
		this.stopCanvasAnimation();
		if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
			this.mediaRecorder.stop();
			if (this.IS_DEBUG) console.log("Recording stopped...");
		}
	}

	// Confirm export (optional)
	confirmExport() {
		if (this.recordedChunks.length === 0) {
			alert("No video recorded to export!");
		} else {
			alert("Your video has been exported!");
		}
	}

	isCodecSupported(mimeType) {
		return MediaRecorder.isTypeSupported(mimeType);
	}

}

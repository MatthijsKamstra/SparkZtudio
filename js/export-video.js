import { Model, ProjectVars } from './model/model.js';


export class ExportVideo {


	ctx;
	mediaRecorder;
	recordedChunks = [];
	frameIndex = 0;
	animationInterval;
	lastValidFrame = null; // To store the last valid frame
	imageArray = [];

	IS_DEBUG = false;

	constructor() {

	}

	init() {
		if (this.IS_DEBUG) {
			console.group('Video.init');
			console.groupEnd();
		}
		const canvas = document.getElementById("canvas");
		this.ctx = canvas.getContext("2d");

		this.reset();
		this.setup();

		// Initialize the canvas with the first SVG
		this.initializeCanvas();

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

		if (this.IS_DEBUG) console.groupCollapsed('mimetypes supported');
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
		startRecordingButton.addEventListener("click", startRecording);
		stopRecordingButton.addEventListener("click", stopRecording);
		confirmExportButton.addEventListener("click", confirmExport);
	}

	initializeCanvas() {
		if (this.IS_DEBUG) {
			console.group('Video.initializeCanvas');
			console.log(ProjectVars);
			console.groupEnd();
		}

		this.reset();
		this.updateProgressBar();

		// Set canvas dimensions
		const canvas = document.getElementById("canvas");
		canvas.width = ProjectVars.width;
		canvas.height = ProjectVars.height;

		this.preRenderSVGs(ProjectVars.frames, () => {
			if (this.IS_DEBUG) console.log('render ready')
		});


		if (ProjectVars.frames && ProjectVars.frames.length > 0) {
			const firstFrame = ProjectVars.frames[0];
			this.drawSVG(firstFrame.svg, () => { }); // Draw the first frame's SVG
		} else {
			if (this.IS_DEBUG) console.error("No frames found in ProjectVars!");
		}
	}

	//  to draw SVG onto canvas
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

	// Pre-render all SVGs and store in an array
	preRenderSVGs(frames, callback) {
		let loadedCount = 0;
		frames.forEach((frame, index) => {
			this.drawSVG(frame.svg, (img) => {
				this.imageArray[index] = img;
				loadedCount++;
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
		frameIndex = 0;
		const intervalMs = 1000 / ProjectVars.frameRate; // Time per frame in milliseconds
		const totalTime = (ProjectVars.frameLength / ProjectVars.frameRate).toFixed(2); // Total duration in seconds

		this.animationInterval = setInterval(() => {
			// Stop animation when the frameIndex exceeds the frameLength
			if (frameIndex >= ProjectVars.frameLength) {
				this.stopCanvasAnimation(); // Stop the animation interval
				if (mediaRecorder && mediaRecorder.state === "recording") {
					mediaRecorder.stop(); // Stop recording
					if (this.IS_DEBUG) console.log("Recording stopped...");
				}
				return;
			}

			// Get the current frame image
			let img = imageArray[frameIndex];

			// If the current frame is null, use the last valid image
			if (!img && lastValidFrame) {
				img = lastValidFrame;
			}

			// If there is no valid frame, log an error and stop the animation
			if (!img) {
				if (this.IS_DEBUG) console.error(`No valid frame found at index: ${frameIndex}`);
				this.stopCanvasAnimation();
				return;
			}

			// Store the current frame if it's valid (not null)
			if (img) {
				lastValidFrame = img;
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
				const currentTime = (frameIndex / ProjectVars.frameRate).toFixed(2); // Current time in seconds

				// Text for Frame Info (draw after the SVG)
				this.ctx.fillText(`Frame: ${frameIndex + 1}/${ProjectVars.frameLength}`, 20, 60);
				this.ctx.fillText(`Frame Rate: ${ProjectVars.frameRate} FPS`, 20, 90);
				this.ctx.fillText(`Time: ${currentTime}s / ${totalTime}s`, 20, 120);
			}

			// Update progress
			this.frameIndex++;
			this.updateProgressBar();
		}, intervalMs);
	}

	stopCanvasAnimation() {
		if (animationInterval) {
			clearInterval(animationInterval);
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
		if (!this.isCodecSupported(options.mimeType)) {
			options = { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 1000000, }; // supported by Firefox
		}
		this.mediaRecorder = new MediaRecorder(canvasStream, options);

		this.mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				recordedChunks.push(event.data);
			}
		};

		this.mediaRecorder.onstop = () => {
			const blob = new Blob(recordedChunks, { type: "video/webm" });
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
			recordedChunks = [];
		};

		mediaRecorder.start();
		startCanvasAnimation();
		console.log("Recording started...");
	}

	// Stop recording
	stopRecording() {
		stopCanvasAnimation();
		if (mediaRecorder && mediaRecorder.state === "recording") {
			mediaRecorder.stop();
			if (this.IS_DEBUG) console.log("Recording stopped...");
		}
	}

	// Confirm export (optional)
	confirmExport() {
		if (recordedChunks.length === 0) {
			alert("No video recorded to export!");
		} else {
			alert("Your video has been exported!");
		}
	}

	isCodecSupported(mimeType) {
		return MediaRecorder.isTypeSupported(mimeType);
	}

}

import { Model, ProjectVars } from './model.js';

let ctx;
let mediaRecorder;
let recordedChunks = [];
let frameIndex = 0;
let animationInterval;
let lastValidFrame = null; // To store the last valid frame


function init() {
	const canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	const startRecordingButton = document.getElementById("startRecording");
	const stopRecordingButton = document.getElementById("stopRecording");
	const confirmExportButton = document.getElementById("confirmExport");

	// Initialize the canvas with the first SVG
	initializeCanvas();

	startRecordingButton.addEventListener("click", startRecording);
	stopRecordingButton.addEventListener("click", stopRecording);
	confirmExportButton.addEventListener("click", confirmExport);
}

function initializeCanvas() {
	// Set canvas dimensions
	canvas.width = ProjectVars.width;
	canvas.height = ProjectVars.height;

	if (ProjectVars.frames && ProjectVars.frames.length > 0) {
		const firstFrame = ProjectVars.frames[0];
		drawSVG(firstFrame.svg); // Draw the first frame's SVG
	} else {
		console.error("No frames found in ProjectVars!");
	}
}

// Function to draw SVG onto canvas
function drawSVG(svg) {
	const svgBlob = new Blob([svg], { type: "image/svg+xml" });
	const url = URL.createObjectURL(svgBlob);
	const img = new Image();
	img.onload = () => {
		// ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the SVG
		URL.revokeObjectURL(url); // Clean up the object URL
	};
	img.src = url;
}

// Update the progress bar
function updateProgressBar() {
	const progress = ((frameIndex / ProjectVars.frameLength) * 100).toFixed(2);
	const progressBar = document.querySelector(".progress-bar");
	progressBar.style.width = `${progress}%`;
	progressBar.textContent = `${progress}%`;
}


function startCanvasAnimation() {
	frameIndex = 0;
	const intervalMs = 1000 / ProjectVars.frameRate; // Time per frame in milliseconds
	const totalTime = (ProjectVars.frameLength / ProjectVars.frameRate).toFixed(2); // Total duration in seconds

	console.log(totalTime);

	animationInterval = setInterval(() => {
		// Stop animation when the frameIndex exceeds the frameLength
		if (frameIndex >= ProjectVars.frameLength) {
			stopCanvasAnimation(); // Stop the animation interval
			if (mediaRecorder && mediaRecorder.state === "recording") {
				mediaRecorder.stop(); // Stop recording
				console.log("Recording stopped...");
			}
			return;
		}

		// Get the current frame
		let frame = ProjectVars.frames[frameIndex];

		// If the current frame is null, use the last valid frame
		if (!frame && lastValidFrame) {
			frame = lastValidFrame;
		}

		// If there is no valid frame, log an error and stop the animation
		if (!frame) {
			console.error(`No valid frame found at index: ${frameIndex}`);
			stopCanvasAnimation();
			return;
		}

		// Store the current frame if it's valid (not null)
		if (frame) {
			lastValidFrame = frame;
		}

		// Clear the canvas before drawing new content
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the current frame (SVG)
		drawSVG(frame.svg);

		// Overlay frame information after the SVG is drawn
		ctx.font = "20px Arial";
		ctx.fillStyle = "red";
		const currentTime = (frameIndex / ProjectVars.frameRate).toFixed(2); // Current time in seconds

		// Text for Frame Info (draw after the SVG)
		ctx.fillText(`Frame: ${frameIndex + 1}/${ProjectVars.frameLength}`, 20, 60);
		ctx.fillText(`Frame Rate: ${ProjectVars.frameRate} FPS`, 20, 90);
		ctx.fillText(`Time: ${currentTime}s / ${totalTime}s`, 20, 120);

		// Update progress
		frameIndex++;
		updateProgressBar();
	}, intervalMs);
}


function stopCanvasAnimation() {
	if (animationInterval) {
		clearInterval(animationInterval);
		animationInterval = null;
	}
}


// Start recording
function startRecording() {
	const canvasStream = canvas.captureStream(ProjectVars.frameRate); // Capture at project frame rate
	mediaRecorder = new MediaRecorder(canvasStream);

	mediaRecorder.ondataavailable = (event) => {
		if (event.data.size > 0) {
			recordedChunks.push(event.data);
		}
	};

	mediaRecorder.onstop = () => {
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
};

// Stop recording
function stopRecording() {
	stopCanvasAnimation();
	if (mediaRecorder && mediaRecorder.state === "recording") {
		mediaRecorder.stop();
		console.log("Recording stopped...");
	}
};

// Confirm export (optional)
function confirmExport() {
	if (recordedChunks.length === 0) {
		alert("No video recorded to export!");
	} else {
		alert("Your video has been exported!");
	}
};


// Export an object to group the functions
export const Video = {
	init,
	initializeCanvas,
};

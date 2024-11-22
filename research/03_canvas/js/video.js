import { Globals } from './globals.js';
import { Model, ProjectVars } from './model.js';
import { Properties } from './properties.js';
import { Timeline } from './timeline.js';

let IS_DEBUG = false;

function init() {

	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const startRecordingButton = document.getElementById("startRecording");
	const stopRecordingButton = document.getElementById("stopRecording");
	const confirmExportButton = document.getElementById("confirmExport");

	let mediaRecorder;
	let recordedChunks = [];

	// Load an image into the canvas
	const image = new Image();
	image.crossOrigin = "anonymous"; // Allow cross-origin loading
	image.src = "https://picsum.photos/id/56/200/300"; // Replace with your image path
	image.onload = () => {
		// Draw the image on the canvas when it's loaded
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	};

	function startCanvasAnimation() {
		let frameCount = 0;

		// Example animation: Move text across the canvas
		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redraw the image

			// Add some animated text
			ctx.font = "30px Arial";
			ctx.fillStyle = "red";
			ctx.fillText(`Frame: ${frameCount++}`, 50, 50);

			// Continue animation while recording
			if (mediaRecorder && mediaRecorder.state === "recording") {
				requestAnimationFrame(animate);
			}
		}

		animate();
	}

	// Start recording the canvas
	startRecordingButton.addEventListener("click", () => {
		// Capture the canvas stream
		const canvasStream = canvas.captureStream(30); // 30 FPS

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
			a.download = "canvas_video.webm";
			document.body.appendChild(a);
			a.click();

			// Clean up
			URL.revokeObjectURL(url);
			recordedChunks = [];
		};

		mediaRecorder.start();
		startCanvasAnimation();
		console.log("Recording started...");
	});

	// Stop recording
	stopRecordingButton.addEventListener("click", () => {
		if (mediaRecorder && mediaRecorder.state === "recording") {
			mediaRecorder.stop();
			console.log("Recording stopped...");
		}
	});

	// Confirm export (optional)
	confirmExportButton.addEventListener("click", () => {
		if (recordedChunks.length === 0) {
			alert("No video recorded to export!");
		} else {
			alert("Your video has been exported!");
		}
	});

}

// Export an object to group the functions
export const Video = {
	init,
};

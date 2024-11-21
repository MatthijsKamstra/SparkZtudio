import { Globals } from './globals.js';

let IS_DEBUG = true;

function initLayout() {
	if (IS_DEBUG) console.info('init layout.js');

	const resizer1 = document.getElementById('resizer1');
	const resizer2 = document.getElementById('resizer2');
	const resizer3 = document.getElementById('resizer3');
	const mainWrapper = document.getElementById('mainWrapper');
	const toolsWrapper = document.getElementById('toolsWrapper');
	const propertiesWrapper = document.getElementById('propertiesWrapper');
	const timelineWrapper = document.getElementById('timelineWrapper');
	let isResizing1 = false;
	let isResizing2 = false;
	let isResizing3 = false;
	let initialToolWidth = toolsWrapper.offsetWidth;
	let initialPropertiesWidth = propertiesWrapper.offsetWidth;
	let initialTimelineHeight = timelineWrapper.offsetHeight;

	resizer1.addEventListener('mousedown', function (e) {
		isResizing1 = true;
		document.addEventListener('mousemove', resize1);
		document.addEventListener('mouseup', stopResize1);
	});

	resizer2.addEventListener('mousedown', function (e) {
		isResizing2 = true;
		document.addEventListener('mousemove', resize2);
		document.addEventListener('mouseup', stopResize2);
	});

	resizer3.addEventListener('mousedown', function (e) {
		isResizing3 = true;
		document.addEventListener('mousemove', resize3);
		document.addEventListener('mouseup', stopResize3);
	});

	function resize1(e) {
		if (isResizing1) {
			const newWidth = e.clientX;
			mainWrapper.style.gridTemplateColumns = `${newWidth}px 5px 1fr 5px ${propertiesWrapper.offsetWidth}px`;
			initialToolWidth = newWidth;
		}
	}

	function stopResize1() {
		isResizing1 = false;
		document.removeEventListener('mousemove', resize1);
		document.removeEventListener('mouseup', stopResize1);
	}

	function resize2(e) {
		if (isResizing2) {
			const mainWrapperWidth = mainWrapper.clientWidth;
			const newWidth = mainWrapperWidth - e.clientX;
			mainWrapper.style.gridTemplateColumns = `${toolsWrapper.offsetWidth}px 5px 1fr 5px ${newWidth}px`;
			initialPropertiesWidth = newWidth;
		}
	}

	function stopResize2() {
		isResizing2 = false;
		document.removeEventListener('mousemove', resize2);
		document.removeEventListener('mouseup', stopResize2);
	}

	function resize3(e) {
		if (isResizing3) {
			const newHeight = document.documentElement.clientHeight - e.clientY - timelineWrapper.offsetHeight;
			timelineWrapper.style.height = `${initialTimelineHeight + newHeight}px`;
			initialTimelineHeight = timelineWrapper.offsetHeight;
		}
	}

	function stopResize3() {
		isResizing3 = false;
		document.removeEventListener('mousemove', resize3);
		document.removeEventListener('mouseup', stopResize3);
	}

	// Initialize grid columns based on initial widths
	mainWrapper.style.gridTemplateColumns = `${initialToolWidth}px 5px 1fr 5px ${initialPropertiesWidth}px`;
}



// Export an object to group the functions
export const Layout = {
	init: initLayout,
};

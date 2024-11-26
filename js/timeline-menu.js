export class TimelineMenu {

	IS_DEBUG = false;

	constructor() {
		if (this.IS_DEBUG) console.info(`constructor timeline-menu.js`);
	}

	init() {
		if (this.IS_DEBUG) console.info(`TimelineMenu.init()`);
	}

	/**
	 * setup UI
	 */
	setup() {
		if (this.IS_DEBUG) console.info(`TimelineMenu.setup()`);
	}
}

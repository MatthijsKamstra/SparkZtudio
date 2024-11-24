export class LocalStorageHandler {
	constructor(prefix = 'SparkZtudio-') {
		this.prefix = prefix;
	}

	// Method to set an item in local storage
	setItem(key, value) {
		try {
			const item = JSON.stringify(value);
			localStorage.setItem(this.prefix + key, item);
		} catch (error) {
			console.error('Error setting item to local storage:', error);
		}
	}

	// Method to get an item from local storage
	getItem(key) {
		try {
			const item = localStorage.getItem(this.prefix + key);
			return item ? JSON.parse(item) : null;
		} catch (error) {
			console.error('Error getting item from local storage:', error);
			return null;
		}
	}

	// Method to remove an item from local storage
	removeItem(key) {
		try {
			localStorage.removeItem(this.prefix + key);
		} catch (error) {
			console.error('Error removing item from local storage:', error);
		}
	}

	// Method to clear all items from local storage
	clearAll() {
		try {
			localStorage.clear();
		} catch (error) {
			console.error('Error clearing local storage:', error);
		}
	}
}

//

/* exported ResourceItem, Resources */
/**
 * A RecourceItem is a media object like image, audio. It is used by the Resources class
 * during the preload phase of the engine loading.
 */

class ResourceItem {
	constructor(params) {
		Debug.validateParams('Resources.add', params, ["url", "type", "name"]);
		Object.assign(this, params);
		this.buffer = {};
		this.item = {};
	}

	load(successCallback, errorCallback) {
		const request = new XMLHttpRequest();
		request.responseType = "blob";
		request.onload = () => {
			if (request.status >= 200 && request.status < 400) {
				this.buffer  = request.response;
				this.item = new Image();
				this.item.src = window.URL.createObjectURL(request.response);
				Debug.info(`Success loading ${this.name}`);
				successCallback();
			} else {
				Debug.error(`Error loading ${this.name}`);
				errorCallback();
			}
		};
		request.onerror = () => {
			Debug.error(`Error loading ${this.name}`);
			errorCallback();
		};
		request.open('GET', this.url, true);
		request.send();
	}

}
/**
 * Resources component is set of the images and audio resources of the game.
 * It handles adding and getting the resources by a name and also the preload phase of the engine loading.
 */
class Resources extends Component {
	constructor(params, engine) {
		super(params, engine);
		this.items = {};
		this.length = 0;
		this.loaded = 0;
		this.errors = 0;
	}

	init() {
		super.init();
	}

	add(params) {
		// resources will be always overrided if existed before, problem in the future?
		this.items[params.name] = new ResourceItem(params);
		this.length++;
	}

	get(name) {
		return this.items[name].item;
	}

	remove(name) {
		delete this.items[name];
	}

	success() {
		this.loaded++;
		this.checkAllResourcesLoaded();
	}

	error() {
		// game continues even if resource failed to load.
		// better implementation pending.
		this.errors++;
		this.loaded++;
		this.checkAllResourcesLoaded();
	}

	checkAllResourcesLoaded() {

		if (this.loaded === this.length) {
			if (this.errors) {
				Debug.warn(`${this.errors} resources failed to load`);
			}
			Debug.groupEnd();
			/**
			 *  callback to create game!
			 */
			setTimeout(() => {
				this.callback(this.engine);
			}, 1000);

		}
	}

	preload(callback) {
		this.callback = callback;
		let names = Object.keys(this.items);
		Debug.group('Preloading Resources');
		for (let name of names) {
			this.items[name].load(this.success.bind(this), this.error.bind(this));
		}

	}
}

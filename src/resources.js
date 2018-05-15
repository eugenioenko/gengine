/* exported ResourceItem, Resources */
/**
 * A RecourceItem is a media object like image, audio. It is used by the Resources class
 * during the preload phase of the engine loading.
 */
class ResourceItem {
	constructor(params, event={success: 'load', error: 'error'}) {
		Debug.validateParams('Resources.add', params, ["url", "type", "name"]);
		Object.assign(this, params);
		this.event = event;
		this.item = {};
	}

	load(success, error) {
		this.item = document.createElement(this.type);
		this.item.src = this.url;
		(function(that) {
			function listenSuccess() {
				Debug.success(`Loaded resource ${that.name}`);
				that.item.removeEventListener(that.event.success, listenSuccess);
				success();
			}
			function listenError() {
				Debug.success(`Loaded resource ${that.name}`);
				that.item.removeEventListener(that.event.error, listenError);
				error();
			}
			that.item.addEventListener(that.event.success, listenSuccess);
			that.item.addEventListener(that.event.error, listenError);
		})(this);
	}

}
/**
 * Resources component is set of the images and audio resources of the game.
 * It handles adding and getting the resources by a name and also the preload phase of the engine loading.
 */
class Resources extends Component{
	constructor(params, engine) {
		super(params, engine);
		this.items = {};
		this.length = 0;
		this.loaded = 0;
		this.errors = 0;
		this.events = {
			"img" : {
				success: "load",
				error: "error"
			},
			"audio": {
				success: "canplaythrough",
				error: "error"
			}
		};
	}

	init() {
		super.init();
	}

	add(params) {
		// resources will be always overrided if existed before, problem in the future?
		this.items[params.name] = new ResourceItem(params, this.events[params.type]);
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
			this.callback(this.engine);
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

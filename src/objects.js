/* exported GameObject, Rect */
/**
 * Base Object of mostly all the classes of the engine.
 * It creates a structure so that when instances of objects are created,
 * the parameters are passed as object literals.
 *
 * The params is used as validation of the arguments pased in the constructor.
 * params should return an array with the names of all the keys which should be
 * present during the construction of an gameObject. This will only happen if the debug
 * mode is activated.
 *
 * @example
 * let o = new GameObject({x: 0, y: 0});
 *
 */
class GameObject {

	constructor(params) {
		Debug.validateParams(this.constructor.name, params, this.params());
		Object.assign(this, params);
		const config = this.config();
		for (let key in config) {
			if (typeof this[key] === "undefined") {
				this[key] = config[key];
			}
		}
	}

	params() {
		return [];
	}

	config() {
		return {};
	}

	init() { }
}

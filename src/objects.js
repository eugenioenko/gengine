/* exported GameObject, Rect */
/**
 * Base Object of mostly all the classes of the engine.
 * It creates a structure so that when instances of objects are created,
 * the parameters are passed as object literals.
 *
 * The __params__ is used as validation of the arguments pased in the constructor.
 * __params__ should return an array with the names of all the keys which should be
 * present during the construction of an gameObject. This will only happen if the debug
 * mode is activated.
 *
 * @example
 * let o = new GameObject({x: 0, y: 0});
 *
 */
class GameObject {

	constructor(params) {
		Debug.validateParams(this.constructor.name, params, this.__params__());
		Object.assign(this, params);
		const config = this.__config__();
		for (let key in config) {
			if (typeof this[key] === "undefined") {
				this[key] = config[key];
			}
		}
	}

	__params__() {
		return [];
	}

	__config__() {
		return {};
	}

	init() { }
}

class Rect extends GameObject {

	constructor(params) {
		super(params);
	}

	__params__() {
		return ["x", "y", "width", "height"];
	}

	contains(point) {
		return (point.x >= this.x &&
			point.x <= this.x + this.width &&
			point.y >= this.y &&
			point.y <= this.y + this.height);
	}

	intersects(rect) {
		return (this.x <= rect.x + rect.width &&
			this.x + this.width > rect.x &&
			this.y <= rect.y + rect.height &&
			this.height + this.y >= rect.y);
	}
}

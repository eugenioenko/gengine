/* exported Debug */
/**
 * Class with static methods to facilitate the messages on the javascript console.
 * All the methods of Debug class will only run if the debug mode is on.
 * To activate the debug mode, declare a global variable before initializing the engine
 * with the name: GENGINE_DEBUG_MODE = true.
 * If the debug mode is off, no messages would be sent to the console.
 * While developing your project, its recomended to have the debug mode on to get
 * some messages of the state of the engine.
 */
class Debug {

	static active() {
		return window.GENGINE_DEBUG_MODE;
	}

	static log(message) {
		if (!Debug.active()) return;
		console.trace();
		console.log(message);
	}

	static info(message) {
		if (!Debug.active()) return;
		console.info(`%c${message}`, 'color: blue');
	}
	static success(message) {
		if (!Debug.active()) return;
		console.info(`%c${message}`, 'color: green');
	}

	static warn(message) {
		if (!Debug.active()) return;
		console.warn(message);
	}

	static error(message) {
		if (!Debug.active()) return;
		console.groupEnd();
		throw new Error(message);
	}

	static group(name) {
		if (!Debug.active()) return;
		console.groupCollapsed(name);
	}

	static groupEnd() {
		if (!Debug.active()) return;
		console.groupEnd();
	}

	/**
	 * Validates that the object literal of the constructor
	 * has the elements of the required array
	 * @param  {object} params   The constructor argument
	 * @param  {array} required The list of required keys
	 */
	static validateParams(name, params, required) {
		if (!Debug.active()) return;
		if (!required || !required.length) return;
		if (required.length && !params){
			Debug.warn(`${name} requires this members in the constructor: {${required.join(',')}}`);
		}
		for (let key of required) {
			if (typeof params[key] === "undefined") {
				Debug.error(`${name} requires of "${key}" in the constructor`);
			}
		}
	}

}

class Debug{

	static active(){
		return window.GENGINE_DEBUG_MODE;
	}

	static log(message){
		if(!Debug.active()) return;
		console.trace();
		console.log(message);
	}

	static info(message){
		if(!Debug.active()) return;
		console.info(`%c${message}`, 'color: blue');
	}
	static success(message){
		if(!Debug.active()) return;
		console.info(`%c${message}`, 'color: green');
	}

	static warn(message){
		if(!Debug.active()) return;
		console.warn(message);
	}

	static error(message){
		if(!Debug.active()) return;
		console.groupEnd();
		throw new Error(message);
	}

	static group(name){
		if(!Debug.active()) return;
		console.groupCollapsed(name);
	}

	static groupEnd(){
		if(!Debug.active()) return;
		console.groupEnd();
	}
	/**
	 * Validates that the object literal of the constructor
	 * has the elements of the required array
	 * @param  {object} params   The constructor argument
	 * @param  {array} required The list of required keys
	 */
	static validateParams(name, params, required){
		if(!Debug.active()) return;
		for(let key of required){
			if(typeof params[key] === "undefined"){
				Debug.error(`${name} requires of "${key}" in the constructor`);
			}
		}
	}

}

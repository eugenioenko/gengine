class Debug{

	static active(){
		return window.GENGINE_DEBUG_MODE;
	}

	static log(message){
		if(!this.active()) return;
		console.trace();
		console.log(message);
	}

	static info(message){
		if(!this.active()) return;
		console.info(`%c${message}`, 'color: blue');
	}
	static success(message){
		if(!this.active) return;
		console.info(`%c${message}`, 'color: green');
	}

	static warn(message){
		if(!this.active()) return;
		console.trace();
		console.warn(message);
	}

	static error(message){
		if(!this.active()) return;
		console.groupEnd();
		throw new Error(message);
	}

	static group(name){
		if(!this.active()) return;
		console.groupCollapsed(name);
	}

	static groupEnd(){
		if(!this.active()) return;
		console.groupEnd();
	}
	/**
	 * Validates that the object literal of the constructor
	 * has the elements of the required array
	 * @param  {object} params   The constructor argument
	 * @param  {array} required The list of required keys
	 */
	static validateParams(name, params, required){
		if(!this.active()) return;
		for(let key of required){
			if(typeof params[key] === "undefined"){
				Debug.error(`${name} requires of "${key}" in the constructor`);
			}
		}
	}

}

/* exported Component */

/**
 * This is a base class of the component of the engine,
 * Components are single instance pieces of the engine.
 * The engine consist of multiple components which perform various tasks.
 * Some Components form part of the core of the Engine, others could
 * be added as need at runtime.
 * When the Engine is ready, it will create the instance of the component and pass itself as the engine parameter.
 * Each Component instance has access to the engine
 * The engine is the responsable for calling new Component, this constructor shouldn't be called in the game code
 * @param {object} params Object literal with parameters passed to the component constructed
 * @param {object} engine The instance of the engine, this will be passed by the engine
 */
class Component extends GameObject {

	constructor(params, engine) {
		super(params);
		this.engine = engine;
		this.name = params.name;
	}
	/**
	 * Returns an instance of an engine component
	 * @param  {string} name The name of the component
	 * @return {object}      Instance of the component
	 */
	getComponent(name) {
		return this.engine.getComponent(name);
	}

	/**
	 * Method called when the component has been added to the engine and is ready
	 */
	init() {
		Debug.success(`${this.name} initialized`);
	}

	/**
	 * Method called each cycle of the engine game loop
	 */
	move() { }

	/**
	 * Method called each cycle of the engine game loop
	 */
	draw() { }

}

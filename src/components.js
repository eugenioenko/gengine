/**
 * A Base class of a Gengine component.
 * A component is a piece of the Engine and the Engine consists of multiple
 * components. Some Components form part of the core of the Engine, others could
 * be added as need at runtime.
 *
 * When the Engine is ready, it will add a component to itself passing the instance
 * of itself to the Component constructor and then call the init() method of the 
 * component.
 */
class Component extends GameObject{
	constructor(params, engine){
		super(params);
		this.engine = engine;
	}

	getComponent(name){
		return this.engine.getComponent(name);
	}

	init(){
		Debug.success(`${this.constructor.name} initialized`);
	}

	move() { }

	draw() { }
}
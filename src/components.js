class Component extends GameObject{
	constructor(params, engine){ 
		super(params);
		this.engine = engine;
	}
	getComponent(name){
		return this.engine.getComponent(name);
	}
}
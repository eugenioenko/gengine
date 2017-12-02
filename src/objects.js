
class GameObject {
	constructor(params){
		Debug.validateParams(this.constructor.name, params, this.__args__());
		Object.assign(this, params);
	}
	__args__() {
		return [];
	}
	init() { }
	move() { }
	draw() { }
}
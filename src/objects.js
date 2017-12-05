
class GameObject {
	constructor(params){
		Debug.validateParams(this.constructor.name, params, this.__params__());
		Object.assign(this, params);
	}
	__params__() {
		return [];
	}
	init() { }
}
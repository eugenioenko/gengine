class GameObject {
	/**
	 * params {parent, x, y, width, height}
	 */
	constructor(params){
		if(!arguments.length) {
			throw new Error("GameObject constructor requires an object literal as argument");
		}
		Object.assign(this, params);
	}
	get gx(){
		return this.x;
	}
	get gy(){
		return this.y;
	}
	get rx(){
		return this.parent ? this.parent.x - this.x  : this.x;
	}
	get ry(){
		return this.parent ? this.parent.y - this.y : this.y;
	}

	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}
}
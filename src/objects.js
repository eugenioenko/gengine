class GameObject {
	constructor(parent, x, y, width, height){
		this.parent = parent;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
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
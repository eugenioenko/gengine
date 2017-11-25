class GameObject {
	constructor(parent, x, y, width, height){
		this.parent = parent;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	get gx(){
		return this.parent ? this.x + this.parent.gx : this.x;
	}
	get gy(){
		return this.parent ? this.y + this.parent.gy : this.y;
	}

	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.gx, this.gy, this.width, this.height, color);
	}
}
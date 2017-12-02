class Collider extends GameObject{
	constructor(params){
		super(params);
	}
	test(collider){
		// to do
	}
	get gx(){
		return this.parent.x + this.x;
	}
	get gy(){
		return this.parent.y + this.y;
	}
	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}
}
class CircleCollider extends Collider{
	constructor(params){
		super(params);
		this.radius = this.width / 2;
	}
	test(collider){
		if(collider instanceof CircleCollider){
			return TestCollision.CircleVsCircle(this, collider);
		}
		if(collider instanceof RectCollider){
			return TestCollision.CircleVsRect(this, collider);
		}
		return false; //posible bug with not knowing which collider to choose
	}
	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.circle(this.gx, this.gy, this.width, color);
	}
}
class RectCollider extends Collider{
	constructor(params){
		super(params);
	}
	test(collider){
		if(collider instanceof CircleCollider){
			return TestCollision.CircleVsRect(collider, this);
		}
		if(collider instanceof RectCollider){
			return TestCollision.RectVsRect(this, collider);
		}

		Debug.error("Unknown collider " + typeof collider);
		return false; //if unknow collider will return false, posible bug
	}
	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.gx, this.gy, this.width, this.height, color);
	}
}
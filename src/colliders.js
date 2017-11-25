class Collider extends GameObject{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){
		// to do
	}
}
class CircleCollider extends Collider{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
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
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){
		if(collider instanceof CircleCollider){
			return TestCollision.CircleVsRect(collider, this);
		}
		if(collider instanceof RectCollider){
			return TestCollision.RectVsRect(this, collider);
		}
		return false; //if unknow collider will return false, posible bug
	}
}
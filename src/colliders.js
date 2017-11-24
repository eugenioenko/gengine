class TestCollision{
	static SphereVsRect(sphere, rect){
		return;
	}
	static RectVsSphere(rect, sphere){
		return this.SphereVsRect(sphere, rect);
	}
	static RectVsRect(rect, rect){
		return;
	}
	static SphereVsSphere(sphere, sphere){
		return;
	}
}
class Collider extends GameObject{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){
		if (this.x < collider.x + collider.width &&
			this.x + this.width > collider.x &&
			this.y < collider.y + collider.height &&
			this.height + this.y > collider.y) {
				return true;
		}
	}
}
class SphereCollider extends Collider{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){
		if(collider instanceof SphereCollider){
			// sphere vs sphere
		}
		if(collider instanceof RectCollider){
			// sphere vs rect
		}
	}
}
class RectCollider extends Collider{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){
		if(collider instanceof SphereCollider){
			// rect vs sphere
		}
		if(collider instanceof RectCollider){
			// rect vs rect
		}
	}
}
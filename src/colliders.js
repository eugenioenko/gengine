class TestCollision{
	static SphereVsRect(sphere, rect){
		// to do
		return;
	}
	static RectVsSphere(rect, sphere){
		return this.SphereVsRect(sphere, rect);
	}
	static RectVsRect(rect, rect){
		// to do
		return;
	}
	static SphereVsSphere(sphere, sphere){
		// to do
		return;
	}
}
class Collider extends GameObject{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){ 
		// to do
	}
}
class SphereCollider extends Collider{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){
		if(collider instanceof SphereCollider){
			TestCollision.SphereVsSphere(this, collider);
		}
		if(collider instanceof RectCollider){
			TestCollision.SphereVsRect(this, collider);
		}
	}
}
class RectCollider extends Collider{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
	}
	test(collider){
		if(collider instanceof SphereCollider){
			TestCollision.SphereVsRect(collider, this);
		}
		if(collider instanceof RectCollider){
			TestCollision.RectVsRect(this, collider);
		}
	}
}
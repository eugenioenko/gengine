/* exported Collider, CircleCollider, RectCollider */

/**
 * Collider represents a rect/circle which can collide with another collider.
 * The position of the collider is relative to its parent sprite.
 * A sprite can have "infinite" number of colliders.
 */
class Collider extends GameObject {

	constructor(params) {
		super(params);
	}

	test(collider) {  // jshint ignore:line
		// to do
	}

	get gx() {
		return this.parent.x + this.x;
	}

	get gy() {
		return this.parent.y + this.y;
	}

	debugDraw(color) {
		color = typeof color === "undefined" ? "red" : color;
		if (this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}
}
/**
 * CircleCollider is a Collider with a circular shape.
 */
class CircleCollider extends Collider {

	constructor(params) {
		super(params);
		this.radius = this.width / 2;
	}

	test(collider) {
		if (collider instanceof CircleCollider) {
			return TestCollision.CircleVsCircle(this, collider);
		}
		if (collider instanceof RectCollider) {
			return TestCollision.CircleVsRect(this, collider);
		}
		return false; //posible bug with not knowing which collider to choose
	}

	debugDraw(color) {
		color = typeof color === "undefined" ? "red" : color;
		if (this.parent && this.parent.display)
			this.parent.display.circle(this.gx, this.gy, this.width, color);
	}
}
/**
 * RectCollider is a collider with a rectange/square shape.
 */
class RectCollider extends Collider { // jshint ignore:line

	constructor(params) {
		super(params);
	}

	params() {
		return ["x", "y", "width", "height"];
	}

	test(collider) {
		if (collider instanceof CircleCollider) {
			return TestCollision.CircleVsRect(collider, this);
		}
		if (collider instanceof RectCollider) {
			return TestCollision.RectVsRect(this, collider);
		}

		Debug.error("Unknown collider " + typeof collider);
		return false; //if unknow collider will return false, posible bug
	}

	debugDraw(color) {
		color = typeof color === "undefined" ? "red" : color;
		if (this.parent && this.parent.display)
			this.parent.display.rect(this.gx, this.gy, this.width, this.height, color);
	}
}

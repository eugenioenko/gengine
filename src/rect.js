/* exported Rect */
class Rect extends GameObject {

	constructor(params) {
		super(params);
	}

	params() {
		return ["x", "y", "width", "height"];
	}

	contains(point) {
		return (point.x >= this.x &&
			point.x <= this.x + this.width &&
			point.y >= this.y &&
			point.y <= this.y + this.height);
	}

	intersects(rect) {
		return (this.x <= rect.x + rect.width &&
			this.x + this.width > rect.x &&
			this.y <= rect.y + rect.height &&
			this.height + this.y >= rect.y);
	}
}

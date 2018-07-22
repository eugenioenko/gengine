/* exported Animation */

class Animation extends GameObject {

	constructor(params) {
		super(params);
		this.start = this.frames[0];
		this.end = this.frames[this.frames.length];
		this.current = this.start;
		this.finished = false;
	}

	__params__() {
		return ["name", "spriteSheet", "frames"];
	}

	__config__() {
		return {
			fps: 60,
			loop: false
		};
	}

	next() {
		if (!this.finished) {
			this.current += 1;
		}
		if (this.current > this.end) {
			if (this.loop) {
				this.current = this.start;
			} else {
				this.finished = true;
				this.current = this.end;
			}
		}
		return this.finished;
	}

	restart() {
		this.current = this.start;
	}

}

class Animator extends GameObject {

	constructor(params) {
		super(params);
	}
}

class AnimatedSprite extends Sprite {

	constructor(params) {
		super(params);
	}

	__params__() {
		return super.__params__().concat(["animator"]);
	}

	draw() {
		if (this.velocity.x === 0) {
			this.animator.idle();
		} else if (this.velocity.x >= 0 && this.velocity.x <= 3) {
			this.animator.walkRight();
		} else if (this.velocity.x > 3) {
			this.animator.runRight();
		} else if (this.velocity.x < 0 && this.velocity.x >= -3) {
			this.animator.walkLeft();
		} else if (this.velocity.x < -3) {
			this.animator.runLeft();
		}
	}
}
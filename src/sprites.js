/* exported Sprite */

/**
 * Base Sprite component. Every Sprite of the engine should derive from this class.
 * Sprites are object which per each loop of the game move, draw and test collision.
 * @param {object}	params  		Object literal of the constructor
 * @param {number}	params.x 		X position of the sprite
 * @param {number}	params.y 		Y position of the sprite
 * @param {number}	params.width	Width of the sprite
 * @param {number}	params.height	Height of the sprite
 * @return {object} Returns the sprite instance
 */
class Sprite extends GameObject {

	constructor(params) {
		super(params);
		this.colliders = [];
		this.colliding = false;
	}

	params() {
		return ["x", "y", "width", "height"];
	}

	/**
	 * Returns the instance of the Component loaded in the engine
	 * @param  {string}		name Name of the component
	 * @return {object}		The Instance of the Component
	 */
	getComponent(name) {
		return this.engine.getComponent(name);
	}

	/**
	 * Adds a collider to the sprite
	 * @param {object} collider Instance of the collider to be added
	 */
	addCollider(collider) {
		collider.parent = this;
		this.colliders.push(collider);
	}

	/**
	 * Draws a box around the sprite
	 * @param  {string} color Color of the rectangle, default red
	 */
	debugDraw(color = "red") {
		if (this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}

	/**
	 * Tests for collision between each collider of the sprite against a sprite
	 * @param {object} sprite Sprite to test the collision with
	 * @return {boolean} True if collision detected
	 */
	testCollision(sprite) {
		if (!TestCollision.RectVsRect(this, sprite)) {
			return false;
		}
		for (let collider1 of this.colliders)
			for (let collider2 of sprite.colliders)
				if (collider1.test(collider2))
					return true;
		return false;
	}

	/**
	 * Method called when the sprite is added to a scene after creation
	 */
	init() { }

	/**
	 * Method executed each game loop
	 */
	move() { }

	/**
	 * Method executed each loop of the game
	 */
	draw() { }

	/**
	 * Method executed when the sprite collided with another sprite.
	 * @param {object} sprite The other sprite with whom the collision ocurred
	 */
	collision(sprite) {
		//jshint unused:false
	}

	/**
	 * Method executed when the sprite is removed from the engine scene
	 */
	destroy() { }

	/**
	 * Removes the sprite from the scene after calling the destroy method.
	 * @important on derrived Sprite classes, don't forget to execute super.remove() at the end
	 * otherwise the sprite won't be removed.
	 */
	remove() {
		this.destroy();
		this.engine.scene.removeSprite(this);
	}
}

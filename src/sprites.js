/**
 * Base Sprite component. Every Sprite of the engine should derive from this class.
 * Sprites are object which per each loop of the game move and draw. 
 */
class Sprite extends GameObject{
	constructor(params){
		super(params);
		this.colliders = [];
		this.colliding = false;
	}
	__params__(){
		return ["x", "y", "width", "height"];
	}
	getComponent(name){
		return this.engine.getComponent(name);
	}
	addCollider(x, y, width, height){
		this.colliders.push(new RectCollider(this, x, y, width, height));
	}
	debugDraw(color = "red"){
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}
	/**
	 * Tests for possible collision between two sprites and if
	 * that happens, tests for individual colliders;
	 */
	testCollision(sprite){
		if(!TestCollision.RectVsRect(this, sprite)){
			return false;
		}
		for(let collider1 of this.colliders)
			for(let collider2 of sprite.colliders)
				if(collider1.test(collider2))
					return true;
		return false;
	}
	get gx(){
		return this.x;
	}
	get gy(){
		return this.y;
	}
	/**
	 * Method called when the sprite is added to a scene after creation
	 */
	init(){ }
	/**
	 * Method executed each game loop
	 */
	move(){ }
	/**
	 * Method executed each loop of the game
	 */
	draw(){ }
	/**
	 * Callback method executed when the sprite collided with another sprite.
	 * @param {sprite} the other sprite whith whom the collision ocurred
	 */
	collision(sprite){ }

	/**
	 * This a "destructor", when a sprite needs to be removed from a scene, executed destroy.
	 * @important on derrived Sprite classes, don't forget to execute super.destroy() at the end.
	 * otherwise the sprite won't be removed.
	 */
	destroy(){
		this.engine.scene.removeSprite(this);
	}
}

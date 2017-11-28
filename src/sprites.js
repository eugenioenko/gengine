class Sprite extends GameObject{
	constructor(params){
		super(params);
		this.colliders = [];
		this.colliding = false;
		this.display = null;
		this.input = null;
		if(this.parent){
			this.display = this.parent.display;
			this.input = this.parent.input;
		}
	}
	addCollider(x, y, width, height){
		this.colliders.push(new RectCollider(this, x, y, width, height));
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
	move(){ }
	draw(){ }
	collision(sprite){ }
	destroy(){ }
}

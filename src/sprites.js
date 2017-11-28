class Sprite extends GameObject{
	constructor(params){
		super(params);
		this.colliders = [];
		this.sprites = [];
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
	addSprite(sprite){
		this.sprites.push(sprite);
		return;
	}
	engineMove(x, y){
		for(let sprite of this.sprites){
			sprite.engineMove(x, y);
		}
		this.move(x, y);
		return;
	}
	engineDraw(x, y){
		for(let sprite of this.sprites){
			sprite.engineDraw(x, y);
		}
		this.draw(x, y);
		return;
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
	engineCheckCollision(sprite){
		if(this.testCollision(sprite)){
			this.colliding = true;
			sprite.colliding = true;
			this.collision(sprite);
			sprite.collision(this);
		} else {
			this.colliding = false;
			sprite.colliding = false;
		}
	}
	engineTestCollision(sprite2){
		for(let sprite of this.sprites){
			sprite.engineCheckCollision(sprite2);
		}
		this.engineCheckCollision(sprite2);
	}
	move(){ }
	draw(){ }
	collision(sprite){ }
	destroy(){ }
}

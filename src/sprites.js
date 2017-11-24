class Sprite extends GameObject{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
		this.colliders = [];
		this.sprites = [];
		this.display = null;
		this.input = null;
		if(this.parent){
			this.display = parent.display;
			this.input = parent.input;
		}
	}
	addCollider(x, y, width, height){
		this.colliders.push(new Collider(this, x, y, width, height));
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
	testCollision(sprite){
		for(let collider1 of this.colliders)
			for(let collider2 of sprite.colliders)
				if(collider1.test(collider2))
					return true;
		return false;
	};
	engineCheckCollision(sprite){
		if(this.testCollision(sprite)){
			this.collision(sprite);
			sprite.collision(this);
		}
	};
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

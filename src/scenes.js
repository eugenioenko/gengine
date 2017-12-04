class Scene extends Component{
	constructor(params, engine){
		super(params, engine);
		this.sprites = [];
	}
	init(){

		super.init();
	}
	move(){
		this.collision();
		for(let sprite of this.sprites){
			sprite.move();
		}
	}
	draw(){
		for(let sprite of this.sprites){
			sprite.draw();
		}
	}
	addSprite(sprite){
		sprite.engine = this.engine;
		sprite.init();
		this.sprites.push(sprite);
		return;
	}

	removeSprite(sprite){
		sprite.destroy();
		let index = this.sprites.indexOf(sprite);
		if(index != -1){
			this.sprites.splice(index, 1);
		}
	}

	collision(){
		for(let i = 0; i < this.sprites.length; ++i){
			for(let j = i +1; j < this.sprites.length; ++j){
				let sprite1 = this.sprites[i];
				let sprite2 = this.sprites[j];
				if(sprite1.testCollision(sprite2)){
					sprite1.collision(sprite2);
					sprite2.collision(sprite1);
				}
			}
		}
	}


}
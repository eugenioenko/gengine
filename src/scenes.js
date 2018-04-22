/**
 * Scene is a collection of sprites of a game level or a game scene.
 * The engine can have a single scene or multiple. Depending on the active scene of
 * the engine, that scene sprites would be draw, moved and collided on the stage.
 */
class Scene extends Component{
	constructor(params, engine){
		super(params, engine);
		this.sprites = [];
	}
	init(){
		this.input = this.getComponent("Input");
		this.camera = this.getComponent("Camera");
		this.display = this.getComponent("Display");
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
		if (this.input.mouse.inside) {
			this.display.circle(this.camera.x + this.input.mouse.x - 1, this.camera.y + this.input.mouse.y - 1, 4, 'red');
		}
	}
	addSprite(sprite){
		sprite.engine = this.engine;
		sprite.init();
		this.sprites.push(sprite);
		return;
	}

	removeSprite(sprite){
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
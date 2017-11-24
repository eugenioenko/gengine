class Engine{
	constructor(canvas){
		this.display = new Display('canvas');
		this.input = new Input();
		this.x = 0;
		this.y = 0;
		this.camera = new Camera(this);
		this.sprites = [];
		this.gameLoop = this.loop.bind(this);
		this.gameLoop();
	}
	collision(){
		for(var i = 0; i < this.sprites.length; ++i){
			for(var j = i +1; j < this.sprites.length; ++j){
				var sprite1 = this.sprites[i];
				var sprite2 = this.sprites[j];
				sprite1.engineTestCollision(sprite2);
			}
		}
	}
	add(sprite){
		this.sprites.push(sprite);
		return;
	}
	move(){
		for(let sprite of this.sprites){
			sprite.engineMove();
		}
		this.camera.move();
		return;
	}
	draw(){
		this.display.clear();
		for(let sprite of this.sprites){
			sprite.engineDraw();
		}
		return;
	}
	loop(){
		window.requestAnimationFrame(this.gameLoop);
		this.collision();
		this.move();
		this.draw();
	}
}
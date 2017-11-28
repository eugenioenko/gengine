class Engine extends GameObject{
	constructor(canvas){
		super({
			parent: null,
			x: 0,
			y: 0,
			width: 640,
			height: 480
		});
		this.display = new Display('canvas');
		this.input = new Input();
		this.x = 0;
		this.y = 0;
		this.camera = new Camera({
			parent: this,
			x: 0,
			y: 0
		});
		this.sprites = [];
		this.frameLimit = false;
		this.frameSkip = 20;
		this.frameCount = 0;
		this.gameLoop = this.loop.bind(this);
		this.gameLoop();
	}
	collision(){
		for(let i = 0; i < this.sprites.length; ++i){
			for(let j = i +1; j < this.sprites.length; ++j){
				let sprite1 = this.sprites[i];
				let sprite2 = this.sprites[j];
				if(sprite1.testCollision(sprite2)){
					sprite1.colliding = true;
					sprite2.colliding = true;
					sprite1.collision(sprite2);
					sprite2.collision(sprite1);
				} else {
					sprite1.colliding = false;
					sprite2.colliding = false;
				}
			}
		}
	}
	add(sprite){
		sprite.display = this.display;
		sprite.input = this.input;
		this.sprites.push(sprite);
		return;
	}
	move(){
		for(let sprite of this.sprites){
			sprite.move();
		}
		this.camera.move();
		return;
	}
	draw(){
		this.display.clear();
		for(let sprite of this.sprites){
			sprite.draw();
		}
		return;
	}
	loop(){
		//if(!this.frameLimit && ++this.frameCount > this.frameSkip){
			this.collision();
			this.move();
			this.draw();
			this.frameCount = 0;
		//}
		window.requestAnimationFrame(this.gameLoop);
	}
}
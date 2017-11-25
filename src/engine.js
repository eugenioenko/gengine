class Engine extends GameObject{
	constructor(canvas){
		super(null, 0, 0, 640,480);
		this.display = new Display('canvas');
		this.input = new Input();
		this.x = 0;
		this.y = 0;
		this.camera = new Camera(this);
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
		//this.camera.move();
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
		//if(!this.frameLimit && ++this.frameCount > this.frameSkip){
			this.collision();
			this.move();
			this.draw();
			this.frameCount = 0;
		//}
		window.requestAnimationFrame(this.gameLoop);
	}
}
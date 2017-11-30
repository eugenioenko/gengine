class Engine extends GameObject{
	constructor(canvas){
		super({
			parent: null,
			x: 0,
			y: 0,
			width: 640,
			height: 480
		});
		this.debugMode = true;
		this.input = new Input();
		this.time = new Time();
		this.x = 0;
		this.y = 0;
		this.camera = new Camera({
			x: 0,
			y: 0,
			engine: this
		});
		this.sprites = [];
		this.frameLimit = false;
		this.frameSkip = 20;
		this.frameCount = 0;
		this.gameLoop = this.loop.bind(this);
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
				}
			}
		}
	}
	getComponent(name){
		return this[name];
	}
	static init(engine, callback){
		window.addEventListener('load', function(){
			engine.display = new CanvasDisplay({
				id: 'canvas',
				engine: engine
			});
			callback(engine);
			engine.time.start();
			engine.gameLoop();
		});
	}

	add(sprite){
		sprite.engine = this;
		sprite.init();
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
	debugInfo(){
		if(!this.debugMode) return;
		this.display.fillText((this.time.time).toFixed(2), 20, 20);
		this.display.fillText((this.time.deltaTime).toFixed(4), 20, 40);
		this.display.fillText(this.time.fps.toFixed(2), 20, 60);
	}
	loop(){
		this.collision();
		this.move();
		this.draw();
		this.frameCount = 0;
		this.debugInfo();
		this.time.calcTime();
		window.requestAnimationFrame(this.gameLoop);
	}
}
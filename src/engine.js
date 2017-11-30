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
		this.components = {};
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
	addComponent(name, component, params){
		this.components[name] = new component(params, this);
		this.components[name].init();
	}
	getComponent(name){
		return this.components[name];
	}
	init(){
		this.addComponent("Input", Input);
		this.addComponent("Camera", Camera);
		this.addComponent("Time", Time);
		this.addComponent("Display", CanvasDisplay, { id: 'canvas'});
		this.display = this.components.Display;
		this.gameLoop();
	}
	static ready(engine, callback){
		window.addEventListener('load', function(){
			engine.init();
			callback(engine);
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
		let components = Object.keys(this.components);
		for(let componentName of components){
			this.components[componentName].move();
		}
		return;
	}
	draw(){
		this.display.clear();
		for(let sprite of this.sprites){
			sprite.draw();
		}
		let components = Object.keys(this.components);
		for(let componentName of components){
			this.components[componentName].draw();
		}
		return;
	}
	debugInfo(){
		/*if(!this.debugMode) return;
		this.display.fillText((this.time.time).toFixed(2), 20, 20);
		this.display.fillText((this.time.deltaTime).toFixed(4), 20, 40);
		this.display.fillText(this.time.fps.toFixed(2), 20, 60);*/
	}
	loop(){
		this.collision();
		this.move();
		this.draw();
		this.frameCount = 0;
		this.debugInfo();
		window.requestAnimationFrame(this.gameLoop);
	}
}
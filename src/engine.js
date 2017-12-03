class Engine extends GameObject{

	constructor(params){
		super(params);
		this.x = 0;
		this.y = 0;
		this.component = {};
		this.components = [];
		this.gameLoop = this.loop.bind(this);
	}
	__args__(){
		return ["canvas", "width", "height", "create", "preload"];
	}

	init(){
		Debug.group('Engine loaded components');
		this.addComponent("Resources", Resources);
		this.addComponent("Input", Input);
		this.addComponent("Camera", Camera, {x: 0, y: 0});
		this.addComponent("Time", Time);
		this.addComponent("Display", CanvasDisplay, {
			id: 'canvas',
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		this.addComponent("Scene", Scene);
		Debug.groupEnd();
		this.time = this.component.Time;
		this.display = this.component.Display;
		this.scene = this.component.Scene;
		this.resources = this.component.Resources;

		this.gameLoop();
	}

	static ready(engine){
		window.addEventListener('load', function(){
			engine.init();
			engine.preload(engine);
			engine.resources.preload(); //resources on complete calls engine.start()
		});
	}

	start(){
		this.create(this);
	}


	addComponent(name, component, params){
		if(typeof this.component[name] !== "undefined"){
			throw new Error(`Component ${name} is already defined`);
		}
		params = typeof params == "undefined" ? {} : params;
		params.name = name;
		this.component[name] = new component(params, this);
		this.component[name].init();
		this.components.push(this.component[name]);
	}

	getComponent(name){
		if(typeof this.component[name] === "undefined"){
			throw new Error(`Component ${name} is not registred`);
		}
		return this.component[name];
	}

	addSprite(sprite){
		this.scene.addSprite(sprite);
	}

	removeSprite(sprite){
		this.scene.removeSprite(sprite);
	}

	move(){
		for(let component of this.components){
			component.move();
		}
	}

	draw(){
		this.display.clear();
		for(let component of this.components){
			component.draw();
		}
	}

	loop(){
		this.move();
		this.fpsDelayCount = 0;
		this.draw();
		this.debugInfo();
		window.requestAnimationFrame(this.gameLoop);
	}

	debugInfo(){
		if(!Debug.active()) return;
		this.display.fillText((this.time.time).toFixed(2), 20, 20);
		this.display.fillText((this.time.deltaTime).toFixed(4), 20, 40);
		this.display.fillText(this.time.fps.toFixed(2), 20, 60);
	}
}
/* exported Engine */
/**
 * Engine is the main object of the game engine.
 * Engine consist of a group of different components which manage different tasks.
 * Each component is a lego piece, and the engine is the glue which binds them together.
 * Once the document is ready, Engine will initialize each component added
 * into it, call the preloader method, execute the game creation function
 * and then start executing the game loop.
 */
class Engine extends GameObject {

	constructor(params) {
		super(params);
		this.x = 0;
		this.y = 0;
		this.component = {};
		this.components = [];
		this.objects = {};
		this.utils = new Utils();
		this.gameLoop = this.loop.bind(this);
	}

	params() {
		return ["canvas", "width", "height"];
	}

	init() {
		Debug.group('Engine loaded components');
		this.addComponent("Resources", Resources);
		this.addComponent("Camera", Camera, {
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		this.addComponent("Input", Input);
		this.addComponent("Time", Time);
		this.addComponent("Sound", Sound);
		this.addComponent("Display", CanvasDisplay, {
			id: 'canvas',
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		this.addComponent("Stage", Stage);
		this.addComponent("Events", Events);
		Debug.groupEnd();
		this.time = this.component.Time;
		this.display = this.component.Display;
		this.stage = this.component.Stage;
		this.resources = this.component.Resources;
		this.sound = this.component.Sound;
		this.input = this.component.Input;
	}
	/**
	 * Static function to replace the windows.onload method.
	 * Once the window is ready, engine will initialize its components, execute
	 * the preloader and when preloader loaded all the resources, create the game
	 * and execute the gameloop.
	 */
	static ready(params) {
		Debug.validateParams('Engine.ready', params, ["canvas", "width", "height", "preload", "create"]);
		(function() {
			let engine = new Engine({
				canvas: params.canvas,
				width: params.width,
				height: params.height
			});
			window.addEventListener('load', function() {
				engine.init();
				params.preload(engine);
				engine.resources.preload(params.create); // important: preload on complete calls create function
				engine.gameLoop();
			});
		})();
	}

	addComponent(name, Component, params = {}) {
		if (Debug.active()) {
			if (typeof this.component[name] !== "undefined") {
				Debug.error(`Component ${name} is already defined`);
			}
		}
		params.name = name;
		this.component[name] = new Component(params, this);
		this.component[name].init();
		this.components.push(this.component[name]);
	}

	getComponent(name) {
		if (Debug.active()) {
			if (typeof this.component[name] === "undefined") {
				Debug.error(`Component ${name} is not registred`);
			}
		}
		return this.component[name];
	}

	move() {
		for (let component of this.components) {
			component.move();
		}
	}

	draw() {
		this.display.clear();
		for (let component of this.components) {
			component.draw();
		}
	}

	loop() {
		this.move();
		this.fpsDelayCount = 0;
		this.draw();
		this.debugInfo();
		window.requestAnimationFrame(this.gameLoop);
	}

	debugInfo() {
		if (!Debug.active()) return;
		this.display.fillText((this.time.time).toFixed(2), 20, 20);
		this.display.fillText((this.time.deltaTime).toFixed(4), 20, 40);
		this.display.fillText(this.time.fps.toFixed(2), 20, 60);
	}
}

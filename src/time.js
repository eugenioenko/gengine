/**
 * Manages the time of the game.
 * time.startTime: seconds elapsed scince the game started
 * time.frameTime: almost the same as startTime, has the elapsed seconds
 * scince the game started but it updates the value by counting the frametime of each gameloop.
 * time.deltaTime: inverse relative value to the fps of the game. When the game runs on 60fps the value is 1.
 * When the fps drop, the deltaTime value is increased proportionaly to the amount of fps droped.
 * Example:
 * 60fps: deltaTime == 1
 * 30fps: deltaTime == 2
 * 15fps: deltaTime == 4
 */
class Time extends Component{
	constructor(params, engine) {
		super(params, engine);
		this.deltaTime = 0;
		this.time = 0;
		this.frameTime = 0;
		this.frameCount = 0;
		this.fps = 0;
		this.startTime = performance.now() / 1000;
		this.lastTime = this.startTime;
	}
	__params__() {
		return [];
	}
	init() {
		this.lastTime = performance.now() / 1000;
		super.init();
	}
	move() {
		let current = performance.now() / 1000;
		this.deltaTimeFS = current - this.lastTime;
		this.deltaTime = this.deltaTimeFS / (1/60);
		this.frameTime += this.deltaTime;
		this.time = current - this.startTime;
		this.lastTime = current;
		this.fps = 1000 / (this.deltaTimeFS * 1000);
	}
}

class Time {
	constructor(){
		this.deltaTime = 0;
		this.time = 0;
		this.frameTime = 0;
		this.frameCount = 0;
		this.fps = 0;
		this.startTime = performance.now();
		this.lastTime = this.startTime;
	}
	start(){
		this.lastTime = performance.now();
	}
	calcTime(){
		let current = performance.now();
		this.deltaTime = current - this.lastTime;
		this.frameTime += this.deltaTime;
		this.time = current - this.startTime;
		this.lastTime = current;
		this.fps = 1000 / this.deltaTime;
	}
}
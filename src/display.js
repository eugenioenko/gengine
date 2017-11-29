class Display extends GameObject{
	constructor(params){
		super(params);
		this.canvas = document.getElementById(this.id);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.scale = 1;
	}
	set zoom(value){
		// to do: sets zoom scale
	}
	get zoom(){
		return this.scale;
	}
	clear(){
		// to do: clears the canvas
	}

	fillRect(x, y, width, height, color){
		// to do: fills a rect
	}
	rect(x, y, width, height, color){
		// to do: draws a rectangle
	}
	circle(x, y, width, color){
		// to do: draws a circle
	}
}
class CanvasDisplay extends Display{
	constructor(params){
		super(params);
		this.canvas = document.getElementById(this.id);
		this.ctx = this.canvas.getContext('2d');
		this.scale = 1;
	}
	set zoom(value){
		this.scale = value;
		this.ctx.scale(value, value);
		this.engine.width = this.engine.width / value;
		this.engine.height = this.engine.height / value;
	}
	get zoom(){
		return this.scale;
	}
	clear(){
		this.ctx.clearRect(0,0,this.width / this.scale,this.height / this.scale);
	}

	fillRect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.fillStyle =  color;
		this.ctx.rect(-this.engine.x + x, -this.engine.y + y, width, height);
		this.ctx.fill();
	}
	rect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.strokeStyle =  color;
		this.ctx.rect(-this.engine.x + x, -this.engine.y + y, width, height);
		this.ctx.stroke();
	}
	circle(x, y, width, color){
		this.ctx.beginPath();
		this.ctx.arc(-this.engine.x + x, -this.engine.y + y, width/2, 0, 2 * Math.PI, false);
		this.ctx.strokeStyle =  color;
		this.ctx.stroke();
	}
}

class WebGLDisplay extends Display{
	constructor(params){
		super(params);
		this.canvas = document.getElementById(this.id);
		this.gl = this.canvas.getContext('webgl');
		this.scale = 1;
		if (!this.gl) {
			new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
		}

		  // Set clear color to black, fully opaque
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		  // Clear the color buffer with specified clear color
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
}

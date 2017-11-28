class Display {
	constructor(canvasId){
		this.canvas = document.getElementById(canvasId);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.ctx = this.canvas.getContext('2d');
		this.scale = 1;
		this.x = 0;
		this.y = 0;
	}
	set zoom(value){
		this.scale = value;
		this.ctx.scale(value, value);
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
		this.ctx.rect(this.x + x, this.y + y, width, height);
		this.ctx.fill();
	}
	rect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.strokeStyle =  color;
		this.ctx.rect(this.x + x, this.y + y, width, height);
		this.ctx.stroke();
	}
	circle(x, y, width, color){
		this.ctx.beginPath();
		this.ctx.arc(this.x + x, this.y + y, width/2, 0, 2 * Math.PI, false);
		this.ctx.strokeStyle =  color;
		this.ctx.stroke();
	}
}

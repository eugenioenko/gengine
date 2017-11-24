class Display {
	constructor(canvasId){
		this.canvas = document.getElementById(canvasId);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.ctx = this.canvas.getContext('2d');
		this.x = 0;
		this.y = 0;
	}
	clear(){
		this.ctx.clearRect(0,0,this.width,this.height);
	};

	fillRect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.fillStyle =  color;
		this.ctx.rect(this.x + x, this.y + y, width, height);
		this.ctx.fill();
	};
	rect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.strokeStyle =  color;
		this.ctx.rect(this.x + x, this.y + y, width, height);
		this.ctx.stroke();
	};
}

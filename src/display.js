/**
 * Base/example class of the Display component of the Engine.
 */
class Display extends Component{
	constructor(params, engine){
		super(params, engine);
		this.scale = 1;
	}
	set zoom(value){ }
	get zoom(){
		return this.scale;
	}
	init() {
		this.canvas = document.getElementById(this.id);
		this.camera = this.getComponent("Camera");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		super.init();
	}
	clear(){ }

	fillRect(x, y, width, height, color){ }
	rect(x, y, width, height, color){
		// to do: draws a rectangle
	}
	circle(x, y, width, color){ }
	move() {
		this.clear();
	}
}
/**
 * The component for drawing sprites and figures into the canvas screen.
 */
class CanvasDisplay extends Component{
	constructor(params, engine){
		super(params, engine);
		this.scale = 1;
	}
	__params__(){
		return ["x", "y", "width", "height"];
	}
	__configs__() {
		return {
			imageSmoothingEnabled: false
		};
	}
	init () {
		this.canvas = document.getElementById(this.id);
		this.canvas.setAttribute('width', this.width);
		this.canvas.setAttribute('height', this.height);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.font = "16px Helvetica";
		this.ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
		this.camera = this.getComponent("Camera");
		super.init();
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
		//this.ctx.clearRect(0, 0, this.width / this.scale, this.height / this.scale);
		this.ctx.fillStyle = '#0FF';
		this.ctx.fillRect(0, 0, this.width / this.scale, this.height / this.scale);
	}
	fillRect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.fillStyle =  color;
		this.ctx.rect(-this.camera.x + x, -this.camera.y + y, width, height);
		this.ctx.closePath();
		this.ctx.fill();
	}
	rect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle =  color;
		this.ctx.rect(-this.camera.x + x, -this.camera.y + y, width, height);
		this.ctx.closePath();
		this.ctx.stroke();
	}
	circle(x, y, width, color){
		this.ctx.beginPath();
		this.ctx.arc(-this.camera.x + x, -this.camera.y + y, width/2, 0, 2 * Math.PI, false);
		this.ctx.strokeStyle =  color;
		this.ctx.closePath();
		this.ctx.stroke();
	}
	fillTriangleUp(x, y, width, height, color) {
		x = -this.camera.x + x;
		y = -this.camera.y + y;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + height);
		this.ctx.lineTo(x + width, y + height);
		this.ctx.lineTo(x + width, y);
		this.ctx.closePath();
		// the fill color
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	fillTriangleDown(x, y, width, height, color) {
		x = -this.camera.x + x;
		y = -this.camera.y + y;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x, y + height);
		this.ctx.lineTo(x + width, y + height);
		this.ctx.closePath();
		// the fill color
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	fillText(text, x, y){
		this.ctx.fillText(text, x, y);
	}
	drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
		this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy,dWidth, dHeight);
	}
	drawTile(x, y, width, height, sheet, index){
		let tile = sheet.tiles[index];
		this.ctx.drawImage(sheet.image, tile.x, tile.y, sheet.width, sheet.height, x - this.camera.x, y - this.camera.y, width, height);
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

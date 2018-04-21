class Matrix {
	constructor(width, height){
		this.array = new Uint16Array(width * height);
		this.width = width;
		this.height = height;
	}
	read(x, y){
		return this.array[y * this.width + x];
	}
	write(x, y, value){
		this.array[y * this.width + x] = value;
	}
	load(array){
		this.array = new Uint16Array(array);
	}
	randomize(){
		for(let i = 0; i < this.array.length; ++i){
			this.array[i] = Maths.rand(0, 3);
		}
	}
}
class TileMap extends Sprite{
	constructor(params){
		super(params);
		this.map = new Matrix(this.width, this.height);
		this.mwidth = this.width * this.twidth;
		this.mheight = this.height * this.theight;
	}
	__params__(){
		return ["x", "y", "width", "height", "twidth", "theight", "sheet", "tiles"];
	}
	read(x, y){
		return this.map.read(x, y);
	}
	write(x, y, value){
		this.map.write(x, y, value);
	}
	load(array){
		if (array.length !== (this.width * this.height)) {
			Debug.warn(`Tilemap size mismatch with width: ${this.width} and height ${this.height}`);
		}
		this.map.load(array);
	}
	init(){
		this.camera = this.getComponent("Camera");
		this.display = this.getComponent("Display");
		//this.map.randomize();
	}
	randomize(){
		this.map.randomize();
	}
	getTileX(x){
		return Math.floor((x / this.twidth) % this.mwidth);
	}
	getTileY(y){
		return Math.floor((y / this.theight) % this.mheight);
	}
	getTile(x, y){
		x = this.getTileX(x);
		y = this.getTileY(y);
		let tile = this.tiles[this.read(x, y)] || this.tiles[0];
		tile.x = x;
		tile.y = y;
		tile.width = this.twidth;
		tile.height = this.theight;
		return tile;
	}
	getCoorners(x, y, width, height){
		return {
			upLeft: this.getTile(x, y),
			upRight: this.getTile(x+width, y),
			downLeft: this.getTile(x, y+height),
			downRight: this.getTile(x+width, y+height)
		};
	}
	getDrawRect(){
		let x1 = this.getTileX(this.camera.x);
		let y1 = this.getTileY(this.camera.y);
		let x2 = Math.ceil(this.camera.width / this.twidth);
		let y2 = Math.ceil(this.camera.height / this.theight);
		x1 = Maths.clamp(x1, 0, this.width);
		y1 = Maths.clamp(y1, 0, this.height);
		x2 = Maths.clamp(x2+x1+1, x1, this.width);
		y2 = Maths.clamp(y2+y1+1, y1, this.height);
		return {
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2
		};
	}
	draw(){
		let rect = this.getDrawRect();
		for(var i = rect.x1; i < rect.x2; ++i){
			for(var j = rect.y1; j < rect.y2; ++j){
				let tile = this.read(i, j);
				if(tile) {
					this.display.drawTile(
						this.x + (i * this.twidth),
						this.y + (j * this.theight),
						this.twidth,
						this.theight,
						this.sheet,
						tile - 1
					);
				}
			}
		}
		return;
	}
	getCorners(x, y, sprite){

	}
}

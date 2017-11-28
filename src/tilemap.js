var Tiles = ['black', 'grey', 'blue', 'green'];
class TileMap extends Sprite{
	constructor(params){
		super(params);
		this.twidth = 32;
		this.theight = 32;
		this.map = new Uint16Array(this.width * this.height);
		this.randomize();

	}
	read(x, y){
		return this.map[y * this.width + x];
	}
	write(x, y, value){
		this.map[y * this.width + x] = value;
	}
	randomize(){
		for(let i = 0; i < this.map.length; ++i){
			this.map[i] = Maths.rand(0, 3);
		}
	}
	getDrawRect(){
		return{
			x1: Math.floor(this.engine.x / this.twidth),
			y1: Math.floor(this.engine.y / this.theight), 
			x2: Math.ceil(this.engine.width / this.twidth),
			y2: Math.ceil(this.engine.height / this.theight)
		};
	}
	draw(){
		let rect = this.getDrawRect();
		for(var i = rect.x1; i <= rect.x1+rect.x2; ++i){
			for(var j = rect.y1; j <= rect.y2+rect.y2; ++j){
				this.display.fillRect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[this.read(i,j)]);
			}
		}
		return;
	}
	/*
	draw(){
		let rect = this.getDrawRect();
		for(var i = 0; i <= this.width; ++i){
			for(var j = 0; j <= this.height; ++j){
				this.display.fillRect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[this.read(i,j)]);
			}
		}
		return;
	}*/
}

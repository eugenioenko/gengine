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

	draw(){
		for(var i = 0; i <= this.width; ++i){
			for(var j = 0; j <= this.height; ++j){
				this.display.fillRect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[this.read(i,j)]);
			}
		}
		return;
	}
}

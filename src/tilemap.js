

var Tiles = [
	{color: '#ffb3ba', solid: true}, 
	{color: '#ffdfba', solid: true},
	{color: '#ffffba', solid: true},
	{color: '#baffc9', solid: true},
	{color: '#bae1ff', solid: true}
];

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
	randomize(){
		for(let i = 0; i < this.array.length; ++i){
			this.array[i] = Maths.rand(0, 3);
		}
	}
}
class TileMap extends Sprite{
	constructor(params){
		super(params);
		this.twidth = 64;
		this.theight = 64;
		this.map = new Matrix(this.width, this.height);
	}
	read(x, y){
		return this.map.read(x, y);
	}
	write(x, y, value){
		this.map.write(x, y, value);
	}
	init(){
		this.display = this.getComponent("display");
		this.map.randomize();
	}
	randomize(){
		this.map.randomize();
	}
	getTileX(x){
		return Math.floor(x / this.twidth);
	}
	
	getTileY(y){
		return Math.floor(y / this.theight);
	}
	getDrawRect(){
		let x1 = this.getTileX(this.engine.x);
		let y1 = this.getTileY(this.engine.y);
		let x2 = Math.ceil(this.engine.width / this.twidth);
		let y2 = Math.ceil(this.engine.height / this.theight);
		x1 = Maths.clamp(x1, 0, this.width);
		y1 = Maths.clamp(y1, 0, this.height);
		x2 = Maths.clamp(x2+x1+1, x1, this.width);
		y2 = Maths.clamp(y2+y1+1, y1, this.height);
		return{
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
				this.display.fillRect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[this.read(i,j)].color);
			}
		}
		return;
	}
	getCorners(x, y, sprite){ 
		/*sprite.downY = Math.floor((y+sprite.height-1)/game.tileH);
		sprite.upY = Math.floor((y-sprite.height)/game.tileH);
		sprite.leftX = Math.floor((x-sprite.width)/game.tileW);
		sprite.rightX = Math.floor((x+sprite.width-1)/game.tileW);
		//check if they are walls
		sprite.upleft = game["t_"+sprite.upY+"_"+sprite.leftX].walkable;
		sprite.downleft = game["t_"+sprite.downY+"_"+sprite.leftX].walkable;
		sprite.upright = game["t_"+sprite.upY+"_"+sprite.rightX].walkable;
		sprite.downright = game["t_"+sprite.downY+"_"+sprite.rightX].walkable;*/
	}
}

class RectSheet{
	constructor(x1, y1, x2, y2){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
}
/**
 * A sprite sheet consists of different sprites/tiles drawn in the same image.
 * When created, the Spritesheet will create the coordinates of each sprite/tile on
 * the image depending on the width/height of the frame/tile on the sheet.
 */
class SpriteSheet extends GameObject{
	constructor(params){
		super(params);
		this.tiles = [];
		let rwidth = Math.floor(this.image.width / this.width+this.gap);
		let cheight = Math.floor(this.image.height / this.height+this.gap);
		for(let i = 0; i < rwidth; ++i){
			for(let j = 0; j < cheight; ++j){
				let x1 = i * this.width + this.gap;
				let y1 = j * this.height + this.gap;
				let x2 = x1 + this.width;
				let y2 = y1 + this.height;
				this.tiles.push(new RectSheet(x1, y1, x2, y2));
			}
		}
	}
	__params__(){
		return ["width", "height", "image", "gap"];
	}

}
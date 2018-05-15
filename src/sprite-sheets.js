/* exported Point, SpriteSheet */
class Point{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
/**
 * A sprite sheet consists of different sprites/tiles drawn in the same image.
 * When created, the Spritesheet will create the coordinates of each sprite/tile on
 * the image depending on the width/height of the frame/tile on the sheet.
 */
class SpriteSheet extends GameObject {

	constructor(params) {
		super(params);
		this.tiles = [];
		let iCount = 1;
		let jCount = 1;
		if (this.padding) {
			while (this.image.width - this.offsetX - iCount++ * (this.width + this.padding) >= this.width);
			while (this.image.height - this.offsetY - jCount++ * (this.height + this.padding) >= this.width);
			iCount--;
			jCount--;
		} else {
			iCount = Math.floor((this.image.width - this.offsetX) / this.width);
			jCount = Math.floor((this.image.height - this.offsetY) / this.height);
		}

		for (let j = 0; j < jCount; ++j) {
			for (let i = 0; i < iCount; ++i) {
				let x = this.offsetX + (i * this.padding) + i * this.width;
				let y = this.offsetY + (j * this.padding) + j * this.height;
				this.tiles.push(new Point(x, y));
			}
		}
	}

	__params__() {
		return ["width", "height", "image"];
	}

	__config__() {
		return {
			offsetX: 0,
			offsetY: 0,
			padding: 0
		};
	}
}

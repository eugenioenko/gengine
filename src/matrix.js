/* exported Matrix */
class Matrix {

	constructor(width, height) {
		this.array = new Uint16Array(width * height);
		this.width = width;
		this.height = height;
	}

	read(x, y) {
		return this.array[y * this.width + x];
	}

	write(x, y, value) {
		this.array[y * this.width + x] = value;
	}

	load(array) {
		this.array = new Uint16Array(array);
	}

	randomize() {
		for (let i = 0; i < this.array.length; ++i) {
			this.array[i] = Maths.rand(0, 3);
		}
	}

}

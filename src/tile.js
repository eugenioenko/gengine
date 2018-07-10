/* exported Tile */
class Tile extends GameObject {

	constructor(params) {
		super(params);
	}

	__params__() {
		return [];
	}

	__config__() {
		return {
			solid: {
				top: false, bottom: false, right: false, left: false
			},
			angle: 0
		};
	}

}
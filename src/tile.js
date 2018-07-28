/* exported Tile */
class Tile extends GameObject {

	constructor(params) {
		super(params);
	}

	params() {
		return [];
	}

	config() {
		return {
			solid: {
				top: false, bottom: false, right: false, left: false
			},
			angle: 0
		};
	}

}
/* exported Input */
class Input extends Component {

	constructor(params, engine) {
		super(params, engine);
		this.keyCode_ = {};
		this.mouse = {
			x: 0,
			y: 0,
			inside: false
		};
	}

	init() {
		this.camera = this.getComponent("Camera");
		super.init();
	}
	params() {
		return [];
	}

	mouseMove(e) {
		let rect = this.engine.display.canvas.getBoundingClientRect();
		this.mouse.x = e.clientX - rect.left;
		this.mouse.y = e.clientY - rect.top;
		if (e.buttons === 2) {
			this.camera.x -= e.movementX;
			this.camera.y -= e.movementY;
		}
	}

	mouseEnter() {
		this.mouse.inside = true;
	}

	mouseLeave() {
		this.mouse.inside = false;
	}

	mouseClick() {
		let x = this.engine.tilemap.getTileX(this.mouse.x + this.camera.x);
		let y = this.engine.tilemap.getTileY(this.mouse.y + this.camera.y);
		this.engine.tilemap.write(x, y, parseInt(document.getElementById("tile").value));
	}

	keyDown(e) {
		this.keyCode_[e.code] = true;
	}

	keyUp(e) {
		this.keyCode_[e.code] = false;
	}

	keyCode(code) {
		return typeof this.keyCode_[code] !== "undefined" ? this.keyCode_[code] : false;
	}

	getAxisHorizontal() {
		let result =  this.keyCode("ArrowLeft") ? -1 : 0;
		result += this.keyCode("ArrowRight") ? 1 : 0;
		return result;
	}

	getAxisVertical() {
		let result = this.keyCode("ArrowUp") ? -1 : 0;
		result += this.keyCode("ArrowDown") ? 1 : 0;
		return result;
	}
}

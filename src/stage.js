/* exported Stage */

/**
 * Stage is a collection of scenes.
 * Engine can have multiple scenes active or visible at the same time.
 */
class Stage extends Component {
	constructor(params, engine) {
		super(params, engine);
		this.scenes = [];
		let scene = new Scene({}, engine);
		scene.init();
		this.scenes.push(scene);
	}

	init() {
		this.input = this.getComponent("Input");
		this.camera = this.getComponent("Camera");
		this.display = this.getComponent("Display");
		super.init();
	}

	move() {
		for (let scene of this.scenes) {
			scene.move();
		}
	}

	draw() {
		for (let scene of this.scenes) {
			scene.draw();
		}
		if (this.input.mouse.inside) {
			this.display.circle(this.camera.x + this.input.mouse.x - 1, this.camera.y + this.input.mouse.y - 1, 4, 'red');
		}
	}
}

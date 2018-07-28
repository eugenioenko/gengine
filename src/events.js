/* exported Events */
class Events extends Component {

	constructor(params, engine) {
		super(params, engine);
	}

	init() {
        let input = this.getComponent("Input");
        let display = this.getComponent("Display");
        display.canvas.addEventListener("mousemove", input.mouseMove.bind(input), false);
        display.canvas.addEventListener("mouseenter", input.mouseEnter.bind(input), false);
        display.canvas.addEventListener("mouseleave", input.mouseLeave.bind(input), false);
        display.canvas.addEventListener("click", input.mouseClick.bind(input), false);
		window.addEventListener("keydown", input.keyDown.bind(input), false);
		window.addEventListener("keyup", input.keyUp.bind(input), false);
		super.init();
	}

	params() {
		return [];
	}

}

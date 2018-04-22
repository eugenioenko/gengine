class Input extends Component{
	constructor(params, engine){
		super(params, engine);
		this.keyCode_ = {};
		this.mouse = {
			x: 0,
			y: 0,
			inside: false
		};
	}
	init(){
		this.camera = this.getComponent("Camera");
		super.init();
	}
	__params__(){
		return [];
	}
	mouseMove(e) {
		let rect = this.canvas.getBoundingClientRect();
		this.mouse.x = e.clientX - rect.left;
		this.mouse.y = e.clientY - rect.top;
		if (e.buttons) {
			this.camera.x -= e.movementX;
			this.camera.y -= e.movementY;
		}
	}
	mouseEnter(e) {
		this.mouse.inside = true;
	}
	mouseLeave(e) {
		this.mouse.inside = false;
	}
	keyDown(e){
		this.keyCode_[e.code] = true;
	}
	keyUp(e){
		this.keyCode_[e.code] = false;
	}
	keyCode(code){
		return typeof this.keyCode_[code] !== "undefined" ? this.keyCode_[code] : false;
	}
	getAxisHorizontal(){
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
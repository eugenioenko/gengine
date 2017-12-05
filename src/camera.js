class Camera extends Component{
	constructor(params, engine){
		super(params, engine);
		this.speed = 10;
	}
	__params__(){
		return ["x", "y", "width", "height"];
	}
	init(){
		this.input = this.getComponent("Input");
		super.init();
	}
	move(){
		if(this.input.keyCode("KeyS")) this.y -= this.speed;
		if(this.input.keyCode("KeyW")) this.y += this.speed;
		if(this.input.keyCode("KeyD")) this.x += this.speed;
		if(this.input.keyCode("KeyA")) this.x -= this.speed;
	}
}
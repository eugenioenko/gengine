class Camera extends Component{
	constructor(params, engine){
		super(params, engine);
		this.speed = 10;
	}
	init(){
		this.input = this.engine.getComponent("Input");
	}
	move(){
		if(this.input.keyCode("KeyS")) this.engine.y -= this.speed;
		if(this.input.keyCode("KeyW")) this.engine.y += this.speed;
		if(this.input.keyCode("KeyD")) this.engine.x += this.speed;
		if(this.input.keyCode("KeyA")) this.engine.x -= this.speed;
	}
}
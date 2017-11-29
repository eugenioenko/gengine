class Camera extends Sprite{
	constructor(params){
		super(params);
		this.bound = null;
		this.speed = 10;
		this.input = this.getComponent("input");
	}
	follow(object){
	}
	init(){

	}
	move(){
		if(this.input.keyCode("KeyS")) this.engine.y -= this.speed;
		if(this.input.keyCode("KeyW")) this.engine.y += this.speed;
		if(this.input.keyCode("KeyD")) this.engine.x += this.speed;
		if(this.input.keyCode("KeyA")) this.engine.x -= this.speed;
	}
}
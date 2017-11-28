class Camera extends Sprite{
	constructor(params){
		super(params);
		this.bound = null;
		this.speed = 3;
	}
	follow(object){
	}
	move(){
		if(this.input.keyCode("KeyS")) this.parent.display.y += this.speed;
		if(this.input.keyCode("KeyW")) this.parent.display.y -= this.speed;
		if(this.input.keyCode("KeyD")) this.parent.display.x += this.speed;
		if(this.input.keyCode("KeyA")) this.parent.display.x -= this.speed;
	}
}
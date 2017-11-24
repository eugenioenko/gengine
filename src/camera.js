class Camera extends Sprite{
	constructor(parent, x, y){
		super(parent, x, y);
		this.speed = 3;
	}
	move(){
		if(this.input.keyCode("KeyS")) this.parent.display.y += this.speed;
		if(this.input.keyCode("KeyW")) this.parent.display.y -= this.speed;
		if(this.input.keyCode("KeyD")) this.parent.display.x += this.speed;
		if(this.input.keyCode("KeyA")) this.parent.display.x -= this.speed;
	}
}
class PlatformerController extends Component {
	constructor(params, engine) {
		super(params, engine);
	}
	__params__() {
		return ["tilemap"];
	}
	getCoorners(x1, y1, x2, y2, coorners){
		this.tilemap.getCoorners(x1, y1, x2, y2, coorners);
	}
	init() {
		super.init();
	}
}
class Player extends Sprite{
	constructor(params){
		super(params);
		this.color = "blue";
		this.coorners = {};
		this.vars = {};
		this.smoothTime = 1.3;
		this.vars.cv = 0;
		this.dir = 1;
		this.speed = 6;
		this.speedY = 0;
		this.moveDistanceY = 0;
		this.velocityY = 0;
		this.gravity = 0.5;
		this.maxSpeedY = 10;
		this.jumpForce = 12;
		this.jumping = false;
		this.shooting = false;

		this.accelerationForceX = 0.3;
		this.accelerationX = 0;
		this.maxSpeedX = 8;
		this.velocityX = 0;
		this.frictionX = 0.8;
		this.dirX = 0;
		this.addCollider(-10, -10, this.width+10, this.height+10);
	}
	getCoorners(x, y){
		this.controller.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.time = this.getComponent("Time");
		this.sound = this.getComponent("Sound");
		this.scene = this.getComponent("Scene");
		this.camera = this.getComponent("Camera");
		this.controller = this.getComponent("PlatformerController");

		this.camera.x = Math.floor(this.x - this.camera.width / 2);
		this.camera.y = Math.floor(this.y - this.camera.height / 2);
	}
	move(){
		// left right movement
		let moveDistanceX = 0;
		let inputX = this.input.getAxis("Horizontal");
		// acceleration movement
		this.accelerationX = inputX * this.accelerationForceX;
		this.velocityX += this.accelerationX * this.time.deltaTime;
		// friction
		if (!inputX) {
			let currentDir = Math.sign(this.velocityX);
			this.velocityX += -currentDir * this.frictionX * this.time.deltaTime;
			if (Math.sign(this.velocityX) !== currentDir) {
				this.velocityX = 0;
			}
		}
		this.velocityX = Maths.clamp(this.velocityX, -this.maxSpeedX, this.maxSpeedX);
		moveDistanceX += this.velocityX * this.time.deltaTime;
		moveDistanceX = Math.floor(moveDistanceX);

		// test collision
		this.getCoorners(this.x + moveDistanceX, this.y);
		if(
			(moveDistanceX > 0 && this.coorners.downRight.solid && this.coorners.upRight.solid) ||
			(moveDistanceX < 0 && this.coorners.downLeft.solid && this.coorners.upLeft.solid)
		){
			this.velocityX = 0;
			moveDistanceX = 0;
		}
		// set new position
		this.x += moveDistanceX;
		this.camera.x += moveDistanceX;

		// gravity
		this.moveDistanceY = Math.floor(this.velocityY);
		this.velocityY += this.gravity * this.time.deltaTime;

		this.moveDistanceY = Maths.clamp(this.moveDistanceY, -this.maxSpeedY, this.maxSpeedY);
		this.getCoorners(this.x, this.y + this.moveDistanceY);

		if(this.moveDistanceY > 0){
			if(this.coorners.downRight.solid || this.coorners.downLeft.solid){
				this.moveDistanceY = 0;
				this.velocityY = 0;
				this.jumping = false;
			}
		} else {
			if(this.coorners.upRight.solid || this.coorners.upLeft.solid){
				this.moveDistanceY = 0;
				this.velocityY = 0;
			}
		}

		this.y += this.moveDistanceY;
		this.camera.y += this.moveDistanceY;

		// jump pressed and not jumping
		if(this.input.keyCode("ArrowUp") && !this.jumping){
			this.jumping = true;

			this.velocityY = -this.jumpForce;
		}
		// jump released and jumping
		if(!this.input.keyCode("ArrowUp") && this.jumping){
			if(this.velocityY < -this.jumpForce/2){
				this.velocityY = -this.jumpForce/2;
			}
		}
	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}

class Enemy extends Sprite {
	constructor(params) {
		super(params);
		this.color = "red";
		this.coorners = {};
		this.dirX = 1;
		this.speed = 3;
		this.speedY = 0;
		this.moveDistanceY = 0;
		this.moveDistanceX = 0;
		this.velocityY = 0;
		this.gravity = 0.5;
		this.maxSpeedY = 10;
		this.addCollider(0, 0, this.width, this.height);
	}
	getCoorners(x, y) {
		this.controller.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init() {
		this.display = this.getComponent("Display");
		this.time = this.getComponent("Time");
		this.controller = this.getComponent("PlatformerController");
	}
	move() {
		// left right movement
		this.moveDistanceX = Math.floor(this.dirX * this.speed * this.time.deltaTime);
		this.getCoorners(this.x + this.moveDistanceX, this.y);

		if (this.dirX == 1) {
			if(this.coorners.downRight.solid && this.coorners.upRight.solid) {
				this.dirX = -1;
			} else {
				this.x += this.moveDistanceX;
			}
		}
		if(this.dirX == -1) {
			if(this.coorners.downLeft.solid && this.coorners.upLeft.solid) {
				this.dirX = 1;
			} else {
				this.x += this.moveDistanceX;
			}
		}
		// gravity
		this.moveDistanceY = Math.floor(this.velocityY);
		this.velocityY += this.gravity * this.time.deltaTime;

		this.moveDistanceY = Maths.clamp(this.moveDistanceY, -this.maxSpeedY, this.maxSpeedY);
		this.getCoorners(this.x, this.y + this.moveDistanceY);

		if (this.moveDistanceY > 0 && this.coorners.downRight.solid || this.coorners.downLeft.solid) {
			this.moveDistanceY = 0;
			this.velocityY = 0;
		}
		this.y += this.moveDistanceY;
	}
	draw() {
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite) {

	}
}
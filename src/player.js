class PlatformController extends Component {
	constructor(params, engine) {
		super(params, engine);
		this.maxVelocityY = 10;
		this.gravity = 0.5;
	}
	__params__() {
		return ["tilemap"];
	}
	getCoorners(x1, y1, width, height){
		return this.tilemap.getCoorners(x1, y1, width, height);
	}
	checkForWalls(sprite, moveDistanceX) {
		moveDistanceX = Math.floor(moveDistanceX);
		let coorners = this.getCoorners(sprite.x + moveDistanceX, sprite.y, sprite.width, sprite.height);
		if (moveDistanceX > 0 && (coorners.downRight.solid || coorners.upRight.solid)) {
			sprite.velocityX = 0;
			sprite.accelerationX = 0;
			moveDistanceX = (coorners.downRight.x * coorners.downLeft.width) - sprite.x - sprite.width - 1;
		}
		if (moveDistanceX < 0 && (coorners.downLeft.solid || coorners.upLeft.solid)) {
			moveDistanceX = sprite.x - ((coorners.downLeft.x + 1) * coorners.downLeft.width) - 1;
			moveDistanceX *= -1;
			sprite.velocityX = 0;
			sprite.accelerationX = 0;
		}
		return moveDistanceX;
	}
	applyGravity(sprite) {
		let moveDistanceY = Math.floor(sprite.velocityY);
		if (!sprite.jumping) {
			sprite.velocityY += this.gravity * this.time.deltaTime;
		} else {
			sprite.velocityY += this.gravity * 1.2 * this.time.deltaTime;
		}
		moveDistanceY = Maths.clamp(moveDistanceY, -this.maxVelocityY, this.maxVelocityY);
		let coorners = this.getCoorners(sprite.x, sprite.y + moveDistanceY, sprite.width, sprite.height);
		if (moveDistanceY > 0) {
			if (coorners.downRight.solid || coorners.downLeft.solid) {
				moveDistanceY = 0;
				sprite.velocityY = 0;
				sprite.jumping = false;
			}
		} else {
			if (coorners.upRight.solid || coorners.upLeft.solid) {
				moveDistanceY = 0;
				sprite.velocityY = 0;
			}
		}
		return moveDistanceY;
	}
	init() {
		super.init();
		this.time = this.getComponent("Time");
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
		this.velocityY = 0;
		this.jumpForce = 12;
		this.jumping = false;
		this.shooting = false;

		this.accelerationForceX = 1.8;
		this.accelerationX = 0;
		this.maxSpeedMultX = 9;
		this.velocityX = 0;
		this.frictionX = 0.9;
		this.dirX = 0;
		this.addCollider(-10, -10, this.width+10, this.height+10);
	}
	getCoorners(x, y){
		return this.controller.getCoorners(x, y, this.width, this.height);
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.time = this.getComponent("Time");
		this.sound = this.getComponent("Sound");
		this.scene = this.getComponent("Scene");
		this.camera = this.getComponent("Camera");
		this.controller = this.getComponent("PlatformController");

		this.camera.x = Math.floor(this.x - this.camera.width / 2);
		this.camera.y = Math.floor(this.y - this.camera.height / 2);
	}
	move(){
		// left right movement
		let moveDistanceX = 0;
		let inputX = this.input.getAxisHorizontal();

		// acceleration movement

		if (!this.jumping) {
			this.accelerationX = inputX * this.accelerationForceX;
		} else {
			this.accelerationX = inputX * this.accelerationForceX / 6;
		}
		this.velocityX += this.accelerationX * this.time.deltaTime;
		// friction
		let currentDir = Math.sign(this.velocityX);
		if (!this.jumping) {
			this.velocityX += -currentDir * this.frictionX * this.time.deltaTime;
		} else {
			this.velocityX += -currentDir * this.frictionX / 10 * this.time.deltaTime;
		}
		if (Math.sign(this.velocityX) !== currentDir) {
			this.velocityX = 0;
		}
		// limit speed
		let maxSpeedX = this.maxSpeedMultX;
		if (this.input.keyCode("KeyZ") && inputX && (this.coorners.downLeft.solid || this.coorners.downRight.solid)) {
			maxSpeedX *= 2;
		}
		this.velocityX = Maths.clamp(this.velocityX, -maxSpeedX, maxSpeedX);
		moveDistanceX += this.velocityX * this.time.deltaTime;

		//moveDistanceX = inputX * 8 * this.time.deltaTime;
		moveDistanceX = this.controller.checkForWalls(this, moveDistanceX);
		this.x += moveDistanceX;
		this.camera.x += moveDistanceX;
		// gravity
		let moveDistanceY = this.controller.applyGravity(this);
		this.y += moveDistanceY;
		this.camera.y += moveDistanceY;
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
		this.controller = this.getComponent("PlatformController");
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
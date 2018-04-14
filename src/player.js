class NetworkPlayer extends Sprite{
	constructor(params){
		super(params);
		this.color = "red";
		this.width = 32;
		this.height = 32;
	}
	__params__(){
		return ["x", "y"];
	}
	init(){
		this.display = this.getComponent("Display");
	}
	move(){ }
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}

class Bullet extends Sprite{
	constructor(params){
		super(params);
		this.x = this.parent.x + 16;
		this.y = this.parent.y + 16;
		this.width = 9;
		this.height = 3;
		this.color = "red";
		this.speed = 3;
	}
	init(){
		this.display = this.getComponent("Display");
		this.network = this.getComponent("Network");
		this.time = this.getComponent("Time");
		this.camera = this.getComponent("Camera");
	}
	move(){
		this.x += this.speed * this.dir * this.time.deltaTime;
		if(this.x < this.camera.x){
			this.destroy();
		}
		if(this.x > this.camera.x+this.engine.width){
			this.destroy();
		}
	}
	destroy(){
		this.parent.shooting = false;
		console.log('destroy');
		super.destroy();
	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	__params__(){
		return ["parent", "dir"];
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
		this.moveDistanceX = 0;
		this.velocityY = 0;
		this.gravity = 0.5;
		this.maxSpeedY = 10;
		this.jumpForce = 12;
		this.jumping = false;
		this.shooting = false;
	}
	getCoorners(x, y){
		this.tilemap.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.tilemap = this.engine.tilemap;
		this.time = this.getComponent("Time");
		this.sound = this.getComponent("Sound");
		this.scene = this.getComponent("Scene");
		this.camera = this.getComponent("Camera");

		this.camera.x = Math.floor(this.x - this.camera.width / 2);
		this.camera.y = Math.floor(this.y - this.camera.height / 2);
	}
	move(){
		// left right movement
		let inputX = this.input.getAxisRaw("Horizontal");
		if(inputX > 0){
			this.dir = 1;
		}
		if(inputX < 0){
			this.dir = -1;
		}
		this.moveDistanceX = Math.floor(inputX * this.speed * this.time.deltaTime);
		this.getCoorners(this.x + this.moveDistanceX, this.y);
		this.moveDistanceX = Math.floor(this.moveDistanceX);
		if(
			(inputX == 1 && !this.coorners.downRight.solid && !this.coorners.upRight.solid) ||
			(inputX == -1 && !this.coorners.downLeft.solid && !this.coorners.upLeft.solid)
		){
			this.x += this.moveDistanceX;
			this.camera.x += this.moveDistanceX;
		}
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
		// shooting
		if(this.input.keyCode("ArrowDown") && !this.shooting){
			this.shooting = true;
			this.scene.addSprite(new Bullet({
				parent: this,
				dir: this.dir
			}));
		}

		if(this.input.keyCode("KeyK") && !this.shooting){
			this.sound.addEffect();
			this.sound.play();
		}
	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}
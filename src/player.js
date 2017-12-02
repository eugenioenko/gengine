class Player extends Sprite{
	constructor(params){
		super(params);
		this.color = "blue";
		this.coorners = {};
		this.vars = {};
		this.smoothTime = 1.3;
		this.vars.cv = 0;
		this.speed = 6;
		this.speedY = 0;
		this.moveDistanceY = 0;
		this.moveDistanceX = 0;
		this.velocityY = 0;
		this.gravity = 0.5;
		this.maxSpeedY = 10;
		this.jumpForce = 12;
		this.jumping = false;
		this.args = {
			cv: 0
		};
		this.argsx = {
			cv: 0
		};

	}
	getCoorners(x, y){
		tilemap.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.tilemap = this.engine.tilemap;
		this.time = this.getComponent("Time");
	}
	move(){
		// left right movement
		let inputX = this.input.getAxisRaw("Horizontal");
		this.moveDistanceX = inputX * this.speed * this.time.deltaTime;
		this.getCoorners(this.x + this.moveDistanceX, this.y);
		this.moveDistanceX = Math.floor(this.moveDistanceX);
		if(
			(inputX == 1 && !this.coorners.downRight.solid && !this.coorners.upRight.solid) ||
			(inputX == -1 && !this.coorners.downLeft.solid && !this.coorners.upLeft.solid)
		){
			this.x += this.moveDistanceX;
			this.engine.x += this.moveDistanceX; //Maths.smoothDamp(this.engine.x, this.engine.x + this.moveDistanceX, this.argsx, 0.1, 30, 10);
			//this.engine.x += moveDistanceX;
		}
		// gravity
		this.moveDistanceY = this.velocityY;
		this.velocityY += this.gravity;

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
		//this.engine.y += this.moveDistanceY;
		this.engine.y = Maths.smoothDamp(this.engine.y, this.engine.y + this.moveDistanceY, this.args, 0.3, 13, 1);

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
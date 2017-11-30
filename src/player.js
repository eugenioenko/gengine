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
		this.accelerationY = 0;
		this.velocityY = 0;
		this.gravity = 3;
		this.maxSpeedY = 10;
		/*this.gravity = 3;
		this.jumpSpeed = 0;
		this.jumpForce = 1.5;
		this.maxJumpSpeed = 20;
		this.jumpCount = 0;
		this.jumping = false;*/


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
		let moveDistanceX = inputX * this.speed * this.time.deltaTime;
		this.getCoorners(this.x + moveDistanceX, this.y);
		if(
			(inputX == 1 && !this.coorners.downRight.solid && !this.coorners.upRight.solid) ||
			(inputX == -1 && !this.coorners.downLeft.solid && !this.coorners.upLeft.solid)
		){
			this.x += moveDistanceX;
			this.engine.x += moveDistanceX;
		}

		
	

		// gravity
		// 
		this.moveDistanceY = this.velocityY;
		this.velocityY += this.accelerationY;
		this.accelerationY = this.gravity;
		
		this.moveDistanceY = Maths.clamp(this.moveDistanceY, -this.maxSpeedY, this.maxSpeedY);
		this.getCoorners(this.x, this.y + this.moveDistanceY);

		if(this.moveDistanceY > 0){
			if(this.coorners.downRight.solid || this.coorners.downLeft.solid){
				this.moveDistanceY = 0;
				this.velocityY = 0;
			}
		}
		/*
		// making jump
		if(this.speedY == 0){
			if(this.input.keyCode("ArrowUp") ){
				this.jumping = true;
				this.jumpSpeed = 0;
			}
		}
		//jumping
		if(this.jumpSpeed >= this.maxJumpSpeed){
			this.jumping = false;
			this.jumpSpeed = 0;
		}*/

		this.y += this.moveDistanceY;
		this.engine.y += this.moveDistanceY;




	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}
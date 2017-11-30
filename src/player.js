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
		this.maxSpeedY = 10;
		this.gravity = 3;
		this.jumping = false;
	}
	getCoorners(x, y){
		tilemap.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init(){
		this.input = this.getComponent("input");
		this.display = this.getComponent("display");
		this.tilemap = this.getComponent("tilemap");
		this.time = this.getComponent("time");
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
		}

		// gravity
		this.speedY += this.gravity * this.time.deltaTime;
		this.speedY = Maths.clamp(this.speedY, -this.maxSpeedY, this.maxSpeedY);
		this.getCoorners(this.x, this.y + this.speedY);

		if(this.speedY > 0){
			if(this.coorners.downRight.solid || this.coorners.downLeft.solid){
				this.speedY = 0;
			}
		}
		// making jump
		if(this.speedY == 0){
			if(this.input.keyCode("ArrowUp") ){
				this.speedY = -this.maxSpeedY*5;
			}
		}

		this.y += this.speedY;

	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}
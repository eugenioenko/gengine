class TestSprite extends Sprite{
	constructor(params){
		super(params);
		//this.colliders.push(new RectCollider(this, 0, 0, 50, 50));
		this.colliders.push(new CircleCollider({
			parent: this,
			x: this.width/2,
			y: this.height/2,
			width: this.width,
			height: this.height
		}));
		this.color = "white";
		this.rotation = 0;
	}
	move(){
		if(!this.colliding){
			this.color = "white";
		}

		if(this.input.keyCode("ArrowDown")) this.y += this.speed;
		if(this.input.keyCode("ArrowUp")) this.y -= this.speed;
		if(this.input.keyCode("ArrowRight")) this.x += this.speed;
		if(this.input.keyCode("ArrowLeft")) this.x -= this.speed;

		this.x += Math.cos(this.rotation * Math.PI/180) * this.speed;
		this.y += Math.sin(this.rotation * Math.PI/180) * this.speed;
		if(++this.rotation > 360){
			this.rotation = 0;
		}
		var m = Maths.clamp(Math.abs(this.speed+3) * 70, 0, 250);
		this.color = `rgb(${m},${m},${m})`;


	}
	draw(){
		this.colliders[0].debugDraw(this.color);
		//this.display.rect(this.x+2, this.y+2, this.width-4, this.height-4, 'green');
	}
	collision(sprite){


	}
}


let engine = new Engine('canvas');
/*engine.add(new TileMap({
	parent: engine,
	x: 0,
	y: 0
}));*/


engine.add(new TileMap({
	parent: engine,
	x: 0,
	y: 0,
	width: 500,
	height: 500
}));
/*
for (var i = 0; i < 1000; ++i){
	engine.add(new TestSprite({
		x: Maths.rand(200, 480),
		y: Maths.rand(150, 330),
		width: 5,
		height: 5,
		rotation: Maths.rand(0, 359),
		speed: Maths.rand(-3, 3)
	}));
}*/















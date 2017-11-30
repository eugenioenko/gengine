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
	init(){
		this.input = this.getComponent("input");
		this.display = this.getComponent("display");
		this.tilemap = this.getComponent("tilemap");
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
	}
	collision(sprite){

	}
}
class Player extends Sprite{
	constructor(params){
		super(params);
		this.color = "blue";
		this.coorners = {};
	}
	getCoorners(){
		this.coorners.tl = this.tilemap.getTile(this.x, this.y);
		this.coorners.tr = this.tilemap.getTile(this.x+this.width, this.y);
		this.coorners.dl = this.tilemap.getTile(this.x, this.y+this.height);
		this.coorners.dr = this.tilemap.getTile(this.x+this.width, this.y+this.height);
	}
	init(){
		this.input = this.getComponent("input");
		this.display = this.getComponent("display");
		this.tilemap = this.getComponent("tilemap");
	}
	move(){
		this.getCoorners();
		if(this.input.keyCode("ArrowDown")) this.y += this.speed;
		if(this.input.keyCode("ArrowUp")) this.y -= this.speed;
		if(this.input.keyCode("ArrowRight")) this.x += this.speed;
		if(this.input.keyCode("ArrowLeft")) this.x -= this.speed;
	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}


var e = {};
function Game(engine){
	e = engine;
	var map = [
		1,1,1,1,1,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,1,0,0,0,1,
		1,0,0,1,1,1,1,0,0,1,
		1,0,0,0,0,1,0,0,0,1,
		1,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,
	];
	tilemap = new TileMap({
		x: 0,
		y: 0,
		width: 10,
		height: 7
	});
	tilemap.load(map);
	engine.tilemap = tilemap;
	engine.add(tilemap);

	engine.add(new Player({
		x: 100,
		y: 100,
		width: 48,
		height: 48,
		speed: 4
	}));


	for (var i = 0; i < 10; ++i){
		engine.add(new TestSprite({
			x: Maths.rand(200, 480),
			y: Maths.rand(150, 330),
			width: 5,
			height: 5,
			rotation: Maths.rand(0, 359),
			speed: Maths.rand(-3, 3)
		}));
	}
}
Engine.init(new Engine('canvas'), Game);

















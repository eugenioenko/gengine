class TestSprite extends Sprite{
	constructor(params){
		super(params);
		this.colliders.push(new CircleCollider({
			parent: this,
			x: this.width/2,
			y: this.height/2,
			width: this.width,
			height: this.height
		}));
		this.args = {
			cv: 0
		};
		if(!this.speed){
			this.speed = 1;
		}
		this.rx = this.x;
		this.ry = this.y;
		this.x = 0;
		this.y = 0;
		this.color = "red";
		this.rotation = 0;
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.tilemap = this.engine.tilemap;
	}
	move(){
		if(!this.colliding){
			this.color = "red";
		}
		//if(this.input.keyCode("ArrowDown")) this.y += this.speed;
		if(this.input.keyCode("ArrowUp")) {
			this.rotation += 30;
			this.rotationSpeed++;
		}
		//if(this.input.keyCode("ArrowRight")) this.x += this.speed;
		//if(this.input.keyCode("ArrowLeft")) this.x -= this.speed;
		this.rx += Math.cos(this.rotation * Math.PI/180) * this.speed;
		this.ry += Math.sin(this.rotation * Math.PI/180) * this.speed;
		this.x = Maths.smoothDamp(this.x, this.parent.x + this.rx - 320, this.args, 0.3, 13, 1);
		this.y = Maths.smoothDamp(this.y, this.parent.y + this.ry - 220, this.args, 0.3, 13, 1);
		//smoothDamp(current, target, $currentVelocity, smoothTime, maxSpeed, deltaTime)
		//this.x = this.parent.x + this.rx -320;
		//this.y = this.parent.y + this.ry - 220;
		this.rotation += this.rotationSpeed;
		if(this.rotation > 360){
			this.rotation = 0;
		}
		var m = Maths.clamp(Math.abs(this.speed+3) * 70, 0, 250);
		this.color = `rgb(${255},${122},${m})`;
	}
	draw(){
		this.colliders[0].debugDraw(this.color);
	}
	collision(sprite){

	}
}

var e = {};
function Game(engine){
	e = engine;
	var map = [
		1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,
		1,0,0,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,
		1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,
		1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,1,0,1,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,1,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,

	];
	tilemap = new TileMap({
		x: 0,
		y: 0,
		width: 60,
		height: 14,
		twidth: 48,
		theight: 48
	});
	tilemap.load(map);
	engine.tilemap = tilemap;
	engine.addSprite(tilemap);
	let player = new Player({
		x: 320,
		y: 220,
		width: 32,
		height: 32
	});
	engine.addSprite(player);
	for (var i = 0; i < 100; ++i){
		engine.addSprite(new TestSprite({
			x: Maths.rand(200, 480),
			y: Maths.rand(150, 330),
			width: 4,
			height: 4,
			rotation: Maths.rand(0, 359),
			speed: Math.random() * 3,
			rotationSpeed: Maths.rand(1, 10),
			parent: player
		}));
	}
}

Engine.ready(new Engine('canvas'), Game);



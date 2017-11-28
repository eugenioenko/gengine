class Maths{
	static clamp(value, min, max){
		 return Math.min(Math.max(value, min), max);
	}
	static lerp(min, max, t){
		return min + (max - min) * t;
	}
	static rand(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

class GameObject {
	/**
	 * params {parent, x, y, width, height}
	 */
	constructor(params){
		if(!arguments.length) {
			throw new Error("GameObject constructor requires an object literal as argument");
		}
		Object.assign(this, params);
	}
	get gx(){
		return this.x;
	}
	get gy(){
		return this.y;
	}


	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}
}
class Input {
	constructor(){
		this.keyCode_ = {};
		window.addEventListener("keydown", this.keyDown.bind(this), false);
		window.addEventListener("keyup", this.keyUp.bind(this), false);
	}
	keyDown(e){
		this.keyCode_[e.code] = true;
	}
	keyUp(e){
		this.keyCode_[e.code] = false;
	}
	keyCode(code){
		return typeof this.keyCode_[code] !== "undefined" ? this.keyCode_[code] : false;
	}
}
class Display extends GameObject{
	constructor(params){
		super(params);
		this.canvas = document.getElementById(this.id);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.ctx = this.canvas.getContext('2d');
		this.scale = 1;
	}
	set zoom(value){
		this.scale = value;
		this.ctx.scale(value, value);
		this.engine.width = this.engine.width / value;
		this.engine.height = this.engine.height / value;
	}
	get zoom(){
		return this.scale;
	}
	clear(){
		this.ctx.clearRect(0,0,this.width / this.scale,this.height / this.scale);
	}

	fillRect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.fillStyle =  color;
		this.ctx.rect(-this.engine.x + x, -this.engine.y + y, width, height);
		this.ctx.fill();
	}
	rect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.strokeStyle =  color;
		this.ctx.rect(-this.engine.x + x, -this.engine.y + y, width, height);
		this.ctx.stroke();
	}
	circle(x, y, width, color){
		this.ctx.beginPath();
		this.ctx.arc(-this.engine.x + x, -this.engine.y + y, width/2, 0, 2 * Math.PI, false);
		this.ctx.strokeStyle =  color;
		this.ctx.stroke();
	}
}

class TestCollision{
	static CircleVsRect(circle, rect){
		let halfRectWidth = rect.width / 2;
		let halfRectHeight = rect.height / 2;
		let halfDistX = Math.abs(circle.gx - rect.gx - halfRectWidth);
		let halfDistY = Math.abs(circle.gy - rect.gy - halfRectHeight);
		if (halfDistX > (halfRectWidth + circle.radius)) return false;
		if (halfDistY > (halfRectHeight + circle.radius)) return false;
		if (halfDistX <= (halfRectWidth)) return true;
		if (halfDistY <= (halfRectHeight)) return true;
		//corner collision
		let dx = halfDistX - halfRectWidth;
		let dy = halfDistY - halfRectHeight;
		return (dx * dx + dy * dy <= Math.pow(circle.radius,2));
	}
	static RectVsCircle(rect, circle){
		return this.CircleVsRect(circle, rect);
	}
	static RectVsRect(rect1, rect2){
		if (rect1.gx <= rect2.gx + rect2.width &&
			rect1.gx + rect1.width > rect2.gx &&
			rect1.gy <= rect2.gy + rect2.height &&
			rect1.height + rect1.gy >= rect2.gy
		){
			return true;
		}
		return false;
	}
	static CircleVsCircle(circle1, circle2){
		let dx = circle1.gx - circle2.gx;
		let dy = circle1.gy - circle2.gy;
		let distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < circle1.width/2 + circle2.width/2) {
			return true;
		}
		return false;
	}
}
class Collider extends GameObject{
	constructor(params){
		super(params);
	}
	test(collider){
		// to do
	}
	get gx(){
		return this.parent.x + this.x;
	}
	get gy(){
		return this.parent.y + this.y;
	}
}
class CircleCollider extends Collider{
	constructor(params){
		super(params);
		this.radius = this.width / 2;
	}
	test(collider){
		if(collider instanceof CircleCollider){
			return TestCollision.CircleVsCircle(this, collider);
		}
		if(collider instanceof RectCollider){
			return TestCollision.CircleVsRect(this, collider);
		}
		return false; //posible bug with not knowing which collider to choose
	}
	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.circle(this.gx, this.gy, this.width, color);
	}
}
class RectCollider extends Collider{
	constructor(params){
		super(params);
	}
	test(collider){
		if(collider instanceof CircleCollider){
			return TestCollision.CircleVsRect(collider, this);
		}
		if(collider instanceof RectCollider){
			return TestCollision.RectVsRect(this, collider);
		}
		return false; //if unknow collider will return false, posible bug
	}
	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.gx, this.gy, this.width, this.height, color);
	}
}
class Sprite extends GameObject{
	constructor(params){
		super(params);
		this.colliders = [];
		this.colliding = false;
		this.display = null;
		this.input = null;
		if(this.parent){
			this.display = this.parent.display;
			this.input = this.parent.input;
		}
	}
	addCollider(x, y, width, height){
		this.colliders.push(new RectCollider(this, x, y, width, height));
	}
	/**
	 * Tests for possible collision between two sprites and if
	 * that happens, tests for individual colliders;
	 */
	testCollision(sprite){
		if(!TestCollision.RectVsRect(this, sprite)){
			return false;
		}
		for(let collider1 of this.colliders)
			for(let collider2 of sprite.colliders)
				if(collider1.test(collider2))
					return true;
		return false;
	}
	move(){ }
	draw(){ }
	collision(sprite){ }
	destroy(){ }
}

class Engine extends GameObject{
	constructor(canvas){
		super({
			parent: null,
			x: 0,
			y: 0,
			width: 640,
			height: 480
		});
		this.display = new Display({
			id: 'canvas',
			engine: this,
			parent: null
		});
		this.input = new Input();
		this.x = 0;
		this.y = 0;
		this.camera = new Camera({
			engine: this,
			parent: this,
			x: 0,
			y: 0
		});
		this.sprites = [];
		this.frameLimit = false;
		this.frameSkip = 20;
		this.frameCount = 0;
		this.gameLoop = this.loop.bind(this);
		this.gameLoop();
	}
	collision(){
		for(let i = 0; i < this.sprites.length; ++i){
			for(let j = i +1; j < this.sprites.length; ++j){
				let sprite1 = this.sprites[i];
				let sprite2 = this.sprites[j];
				if(sprite1.testCollision(sprite2)){
					sprite1.colliding = true;
					sprite2.colliding = true;
					sprite1.collision(sprite2);
					sprite2.collision(sprite1);
				}
			}
		}
	}
	add(sprite){
		sprite.engine = engine;
		sprite.display = this.display;
		sprite.input = this.input;
		this.sprites.push(sprite);
		return;
	}
	move(){
		for(let sprite of this.sprites){
			sprite.move();
		}
		this.camera.move();
		return;
	}
	draw(){
		this.display.clear();
		for(let sprite of this.sprites){
			sprite.draw();
		}
		return;
	}
	loop(){
		//if(!this.frameLimit && ++this.frameCount > this.frameSkip){
			//this.collision();
			this.move();
			this.draw();
			this.frameCount = 0;
		//}
		window.requestAnimationFrame(this.gameLoop);
	}
}
class Camera extends Sprite{
	constructor(params){
		super(params);
		this.bound = null;
		this.speed = 3;
	}
	follow(object){
	}
	move(){
		if(this.input.keyCode("KeyS")) this.engine.y -= this.speed;
		if(this.input.keyCode("KeyW")) this.engine.y += this.speed;
		if(this.input.keyCode("KeyD")) this.engine.x += this.speed;
		if(this.input.keyCode("KeyA")) this.engine.x -= this.speed;
	}
}
var Tiles = ['black', 'grey', 'blue', 'green'];
class TileMap extends Sprite{
	constructor(params){
		super(params);
		this.twidth = 32;
		this.theight = 32;
		this.map = new Uint16Array(this.width * this.height);
		this.randomize();

	}
	read(x, y){
		return this.map[y * this.width + x];
	}
	write(x, y, value){
		this.map[y * this.width + x] = value;
	}
	randomize(){
		for(let i = 0; i < this.map.length; ++i){
			this.map[i] = Maths.rand(0, 3);
		}
	}
	getDrawRect(){
			let x1 = Math.floor(this.engine.x / this.twidth);
			let y1 = Math.floor(this.engine.y / this.theight);
			let x2 = Math.ceil(this.engine.width / this.twidth);
			let y2 = Math.ceil(this.engine.height / this.theight);
			

			x1 = Maths.clamp(x1, 0, this.width);
			y1 = Maths.clamp(y1, 0, this.height);

			x2 = Maths.clamp(x2+x1, x1, this.width);
			y2 = Maths.clamp(y2+y1, y1, this.height);

		return{
			x1: x1,
			y1: y1, 
			x2: x2,
			y2: y2
		};
	}
	draw(){
		let rect = this.getDrawRect();
		for(var i = rect.x1; i <= rect.x2; ++i){
			for(var j = rect.y1; j <= rect.y2; ++j){
				this.display.fillRect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[this.read(i,j)]);
			}
		}
		return;
	}
	/*
	draw(){
		let rect = this.getDrawRect();
		for(var i = 0; i <= this.width; ++i){
			for(var j = 0; j <= this.height; ++j){
				this.display.fillRect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[this.read(i,j)]);
			}
		}
		return;
	}*/
}

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















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
	static smoothDamp(current, target, $currentVelocity, smoothTime, maxSpeed, deltaTime){
		smoothTime = Math.max(0.0001, smoothTime);
		let num = 2.0 / smoothTime;
		let num2 = num * deltaTime;
		let num3 = 1.0 / (1.0 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
		let num4 = current - target;
		let num5 = target;
		let num6 = maxSpeed * smoothTime;
		num4 = Maths.clamp(num4, -num6, num6);
		target = current - num4;
		let num7 = ($currentVelocity.cv + num * num4) * deltaTime;
		$currentVelocity.cv = ($currentVelocity.cv - num * num7) * num3;
		let num8 = target + (num4 + num7) * num3;
		if ((num5 - current > 0.0) == (num8 > num5)){
			num8 = num5;
			$currentVelocity.cv = (num8 - num5) / deltaTime;
		}
		return num8;
	}
}
class Debug{

	static active(){
		return window.GENGINE_DEBUG_MODE;
	}

	static log(message){
		if(!this.active()) return;
		console.trace();
		console.log(message);
	}

	static info(message){
		if(!this.active()) return;
		console.info(`%c${message}`, 'color: blue');
	}
	static success(message){
		if(!this.active) return;
		console.info(`%c${message}`, 'color: green');
	}

	static warn(message){
		if(!this.active()) return;
		console.warn(message);
	}

	static error(message){
		if(!this.active()) return;
		console.groupEnd();
		throw new Error(message);
	}

	static group(name){
		if(!this.active()) return;
		console.groupCollapsed(name);
	}

	static groupEnd(){
		if(!this.active()) return;
		console.groupEnd();
	}
	/**
	 * Validates that the object literal of the constructor
	 * has the elements of the required array
	 * @param  {object} params   The constructor argument
	 * @param  {array} required The list of required keys
	 */
	static validateParams(name, params, required){
		if(!this.active()) return;
		for(let key of required){
			if(typeof params[key] === "undefined"){
				Debug.error(`${name} requires of "${key}" in the constructor`);
			}
		}
	}

}


class GameObject {
	constructor(params){
		Debug.validateParams(this.constructor.name, params, this.__args__());
		Object.assign(this, params);
	}
	__args__() {
		return [];
	}
	init() { }
	move() { }
	draw() { }
}
class Component extends GameObject{
	constructor(params, engine){
		super(params);
		this.engine = engine;
	}

	getComponent(name){
		return this.engine.getComponent(name);
	}

	init(){
		Debug.success(`${this.constructor.name} initialized`);
	}
}
class Time extends Component{
	constructor(params, engine){
		super(params, engine);
		this.deltaTime = 0;
		this.time = 0;
		this.frameTime = 0;
		this.frameCount = 0;
		this.fps = 0;
		this.startTime = performance.now() / 1000;
		this.lastTime = this.startTime;
	}
	__args__(){
		return [];
	}
	init(){
		this.lastTime = performance.now() / 1000;
		super.init();
	}
	move(){
		let current = performance.now() / 1000;
		this.deltaTimeFS = current - this.lastTime;
		this.deltaTime = this.deltaTimeFS / (1/60);
		this.frameTime += this.deltaTime;
		this.time = current - this.startTime;
		this.lastTime = current;
		this.fps = 1000 / (this.deltaTimeFS * 1000);
	}
}

class Input extends Component{
	constructor(params){
		super(params);
		this.keyCode_ = {};
	}
	init(){
		window.addEventListener("keydown", this.keyDown.bind(this), false);
		window.addEventListener("keyup", this.keyUp.bind(this), false);
		super.init();
	}
	__args__(){
		return [];
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
	getAxisRaw(type){
		let result = 0;
		result =  this.keyCode("ArrowLeft") ? -1 : 0;
		result += this.keyCode("ArrowRight") ? 1 : 0;
		return result;
	}
}
class Display extends Component{
	constructor(params, engine){
		super(params, engine);
		this.scale = 1;
	}
	set zoom(value){ }
	get zoom(){
		return this.scale;
	}
	init() {
		this.canvas = document.getElementById(this.id);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		super.init();
	}
	clear(){ }

	fillRect(x, y, width, height, color){ }
	rect(x, y, width, height, color){
		// to do: draws a rectangle
	}
	circle(x, y, width, color){ }
	move() {
		this.clear();
	}
}
class CanvasDisplay extends Component{
	constructor(params, engine){
		super(params, engine);
		this.scale = 1;
	}
	__args__(){
		return ["x", "y", "width", "height"];
	}
	init () {
		this.canvas = document.getElementById(this.id);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.font = "16px Helvetica";
		super.init();
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
		this.ctx.clearRect(0, 0, this.width / this.scale, this.height / this.scale);
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
	fillText(text, x, y){
		this.ctx.fillText(text, x, y);
	}
}

class WebGLDisplay extends Display{
	constructor(params){
		super(params);
		this.canvas = document.getElementById(this.id);
		this.gl = this.canvas.getContext('webgl');
		this.scale = 1;
		if (!this.gl) {
			new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
		}
		// Set clear color to black, fully opaque
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		// Clear the color buffer with specified clear color
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
}

class Network extends Component{
	constructor(params, engine){
		super(params, engine);
		this.sprites = {};
		if(typeof io === "undefined"){
			Debug.error('Network requires socketio.js');
		}
		this.socket = io(this.url, {
  			autoConnect: false
		});
		this.socket.on('connect', this.onConnect.bind(this));
		this.socket.on('connect_error', this.onConnectionError.bind(this));
		this.socket.on('disconnect', this.onDisconnect.bind(this));

		this.socket.on('enter_network_player', this.onEnterNetworkPlayer.bind(this));
		this.socket.on('leave_network_player', this.onLeaveNetworkPlayer.bind(this));
		this.socket.on('update_network_player', this.onUpdateNetworkPlayer.bind(this));
	}

	__args__(){
		return ["url", "player", "dummy"];
	}

	init(){
		this.connect();
		super.init();
	}

	move(){
		this.socket.emit('move_player', {
			x: this.player.x,
			y: this.player.y,
			id: this.socket.id
		});
	}

	draw(){

	}

	connect(){
		Debug.info(`Connecting to the server ${this.url}`);
		this.socket.connect();
	}

	disconnect(){
		Debug.warn(`Disonected from server`);
		this.socket.disconnect();
	}

	onConnect(data){
		Debug.info(`Connected to the server`);
		this.socket.emit('init_player', {
			id: this.socket.id,
			x: this.player.x,
			y: this.player.y
		});
	}

	onDisconnect(data){
		this.socket.disconnect();
	}

	onConnectionError(data){
		Debug.warn(`Server connection error`);
		this.socket.disconnect();
	}

	createNetworkPlayer(data){
		this.sprites[data.id] = new this.dummy({
			x: data.x,
			y: data.y,
			parent: this
		});
		this.engine.addSprite(this.sprites[data.id]);
	}

	onEnterNetworkPlayer(data){
		this.createNetworkPlayer(data);
	}

	onLeaveNetworkPlayer(data){
		if(typeof this.sprites[data.id] !== "undefined"){
			this.engine.removeSprite(this.sprites[data.id]);
			delete this.sprites[data.id];
		}
	}

	onUpdateNetworkPlayer(data){
		if(typeof this.sprites[data.id] === "undefined"){
			this.createNetworkPlayer(data);
		}
		this.sprites[data.id].x = data.x;
		this.sprites[data.id].y = data.y;
	}

	/**
	 * todo: cualquier cosa que se ocurra, sonidos podrian loopear, otros no.
	 * Musica de fondo seria un sonido?
	 */
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
	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
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

		Debug.error("Unknown collider " + typeof collider);
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
	}
	__args__(){
		return ["x", "y", "width", "height"];
	}
	getComponent(name){
		return this.engine.getComponent(name);
	}
	addCollider(x, y, width, height){
		this.colliders.push(new RectCollider(this, x, y, width, height));
	}
	debugDraw(color){
		color = typeof color === "undefined" ? "red" : color;
		if(this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
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
	get gx(){
		return this.x;
	}
	get gy(){
		return this.y;
	}
	init(){ }
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
		this.components = {};
		this.sprites = [];
		this.gameLoop = this.loop.bind(this);
	}

	init(){
		Debug.group('Engine loaded components');
		this.addComponent("Input", Input);
		this.addComponent("Camera", Camera, {x: 0, y: 0});
		this.addComponent("Time", Time);
		this.addComponent("Display", CanvasDisplay, {
			id: 'canvas',
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		Debug.groupEnd();
		this.time = this.components.Time;
		this.display = this.components.Display;

		this.gameLoop();
	}

	static ready(engine, callback){
		window.addEventListener('load', function(){
			engine.init();
			callback(engine);
		});
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

	addComponent(name, component, params){
		if(typeof this.components[name] !== "undefined"){
			throw new Error(`Component ${name} is already defined`);
		}
		params = typeof params == "undefined" ? {} : params;
		params.name = name;
		this.components[name] = new component(params, this);
		this.components[name].init();
	}

	getComponent(name){
		if(typeof this.components[name] === "undefined"){
			throw new Error(`Component ${name} is not registred`);
		}
		return this.components[name];
	}

	addSprite(sprite){
		sprite.engine = this;
		sprite.init();
		this.sprites.push(sprite);
		return;
	}

	removeSprite(sprite){
		sprite.destroy();
		let index = this.sprites.indexOf(sprite);
		if(index != -1){
			this.sprites.splice(index, 1);
		}
	}

	move(){
		for(let sprite of this.sprites){
			sprite.move();
		}
		let components = Object.keys(this.components);
		for(let componentName of components){
			this.components[componentName].move();
		}
		return;
	}

	draw(){
		this.display.clear();
		for(let sprite of this.sprites){
			sprite.draw();
		}
		let components = Object.keys(this.components);
		for(let componentName of components){
			this.components[componentName].draw();
		}
		return;
	}

	loop(){
		this.collision();
		this.move();
		this.fpsDelayCount = 0;
		this.draw();
		this.debugInfo();
		window.requestAnimationFrame(this.gameLoop);
	}

	debugInfo(){
		if(!Debug.active()) return;
		this.display.fillText((this.time.time).toFixed(2), 20, 20);
		this.display.fillText((this.time.deltaTime).toFixed(4), 20, 40);
		this.display.fillText(this.time.fps.toFixed(2), 20, 60);
	}
}
class NetworkPlayer extends Sprite{
	constructor(params){
		super(params);
		this.color = "red";
		this.width = 32;
		this.height = 32;
	}
	__args__(){
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
		this.maxSpeedY = 10000;
		this.jumpForce = 12;
		this.jumping = false;
		this.lastX = this.x;
		this.lastY = this.y;

	}
	getCoorners(x, y){
		tilemap.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.tilemap = this.engine.tilemap;
		this.network = this.getComponent("Network");
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
		this.engine.y += this.moveDistanceY;
		//this.engine.y = Maths.smoothDamp(this.engine.y, this.engine.y + this.moveDistanceY, this.args, 0.3, 13, 1);

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
		if(this.lastX != this.x && this.lastY != this.y){
			this.network.move({
				x: this.x,
				y: this.y
			});
			this.lastX = this.x;
			this.lastY = this.y;
		}
	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}
class Camera extends Component{
	constructor(params, engine){
		super(params, engine);
		this.speed = 10;
	}
	__args__(){
		return ["x", "y"];
	}
	init(){
		this.input = this.getComponent("Input");
		super.init();
	}
	move(){
		if(this.input.keyCode("KeyS")) this.engine.y -= this.speed;
		if(this.input.keyCode("KeyW")) this.engine.y += this.speed;
		if(this.input.keyCode("KeyD")) this.engine.x += this.speed;
		if(this.input.keyCode("KeyA")) this.engine.x -= this.speed;
	}
}


var Tiles = [
	{color: '#eee', solid: false},
	{color: '#333', solid: true},
	{color: '#037', solid: true},
	{color: '#730', solid: true},
	{color: '#bae1ff', solid: true}
];

class Matrix {
	constructor(width, height){
		this.array = new Uint16Array(width * height);
		this.width = width;
		this.height = height;
	}
	read(x, y){
		return this.array[y * this.width + x];
	}
	write(x, y, value){
		this.array[y * this.width + x] = value;
	}
	load(array){
		this.array = new Uint16Array(array);
	}
	randomize(){
		for(let i = 0; i < this.array.length; ++i){
			this.array[i] = Maths.rand(0, 3);
		}
	}
}
class TileMap extends Sprite{
	constructor(params){
		super(params);
		//this.twidth = 64;
		//this.theight = 64;
		this.map = new Matrix(this.width, this.height);
	}
	__args__(){
		return ["x", "y", "width", "height", "twidth", "theight"];
	}
	read(x, y){
		return this.map.read(x, y);
	}
	write(x, y, value){
		this.map.write(x, y, value);
	}
	load(array){
		this.map.load(array);
	}
	init(){
		this.display = this.getComponent("Display");
		//this.map.randomize();
	}
	randomize(){
		this.map.randomize();
	}
	getTileX(x){
		return Math.floor(x / this.twidth);
	}
	getTileY(y){
		return Math.floor(y / this.theight);
	}
	getTile(x, y){
		return Tiles[this.read(this.getTileX(x), this.getTileY(y))];
	}
	getCoorners(x, y, width, height, coorners){
		coorners.upLeft = this.getTile(x, y);
		coorners.upRight = this.getTile(x+width, y);
		coorners.downLeft = this.getTile(x, y+height);
		coorners.downRight = this.getTile(x+width, y+height);
	}
	getDrawRect(){
		let x1 = this.getTileX(this.engine.x);
		let y1 = this.getTileY(this.engine.y);
		let x2 = Math.ceil(this.engine.width / this.twidth);
		let y2 = Math.ceil(this.engine.height / this.theight);
		x1 = Maths.clamp(x1, 0, this.width);
		y1 = Maths.clamp(y1, 0, this.height);
		x2 = Maths.clamp(x2+x1+1, x1, this.width);
		y2 = Maths.clamp(y2+y1+1, y1, this.height);
		return{
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2
		};
	}
	draw(){
		let rect = this.getDrawRect();
		for(var i = rect.x1; i < rect.x2; ++i){
			for(var j = rect.y1; j < rect.y2; ++j){
				this.display.fillRect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[this.read(i,j)].color);
				this.display.rect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[0].color);
			}
		}
		return;
	}
	getCorners(x, y, sprite){

	}
}

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
	__args__(){
		return ["x", "y", "width", "height", "speed", "rotation", "rotationSpeed"];
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.tilemap = this.engine.tilemap;
	}
	move(){

		this.rx += Math.cos(this.rotation * Math.PI/180) * this.speed;
		this.ry += Math.sin(this.rotation * Math.PI/180) * this.speed;
		this.x = this.parent.x + this.rx;
		this.y = this.parent.y + this.ry;
		this.rotation += this.rotationSpeed;
		if(this.rotation > 360){
			this.rotation = 0;
		}
		this.color = 'pink';
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
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1,
		1,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,
		1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,
		1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
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

	engine.addComponent("Network", Network, {
		url: 'http://enko.duckdns.org:3331',
		player: player,
		dummy: NetworkPlayer
	});
	engine.addSprite(player);

	for (var i = 0; i < 2; ++i){
		engine.addSprite(new TestSprite({
			x: Maths.rand(0, 5),
			y: Maths.rand(-20, 0),
			width: 16,
			height: 16,
			rotation: Maths.rand(0, 359),
			speed: 2,
			rotationSpeed: Maths.rand(7, 10),
			parent: player
		}));
	}
}

Engine.ready(new Engine('canvas'), Game);



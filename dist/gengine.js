"use strict"; // jshint ignore:line

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
		if(!Debug.active()) return;
		console.trace();
		console.log(message);
	}

	static info(message){
		if(!Debug.active()) return;
		console.info(`%c${message}`, 'color: blue');
	}
	static success(message){
		if(!Debug.active()) return;
		console.info(`%c${message}`, 'color: green');
	}

	static warn(message){
		if(!Debug.active()) return;
		console.warn(message);
	}

	static error(message){
		if(!Debug.active()) return;
		console.groupEnd();
		throw new Error(message);
	}

	static group(name){
		if(!Debug.active()) return;
		console.groupCollapsed(name);
	}

	static groupEnd(){
		if(!Debug.active()) return;
		console.groupEnd();
	}
	/**
	 * Validates that the object literal of the constructor
	 * has the elements of the required array
	 * @param  {object} params   The constructor argument
	 * @param  {array} required The list of required keys
	 */
	static validateParams(name, params, required){
		if(!Debug.active()) return;
		for(let key of required){
			if(typeof params[key] === "undefined"){
				Debug.error(`${name} requires of "${key}" in the constructor`);
			}
		}
	}

}


class GameObject {
	constructor(params){
		Debug.validateParams(this.constructor.name, params, this.__params__());
		Object.assign(this, params);
	}
	__params__() {
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
	__params__(){
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
	__params__(){
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
	__params__(){
		return ["x", "y", "width", "height"];
	}
	init () {
		this.canvas = document.getElementById(this.id);
		this.canvas.setAttribute('width', this.width);
		this.canvas.setAttribute('height', this.height);
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

	__params__(){
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
		Debug.success(`Connected to the server`);
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
	__params__(){
		return ["x", "y", "width", "height"];
	}
	getComponent(name){
		return this.engine.getComponent(name);
	}
	addCollider(x, y, width, height){
		this.colliders.push(new RectCollider(this, x, y, width, height));
	}
	debugDraw(color = "red"){
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

class Scene extends Component{
	constructor(params, engine){
		super(params, engine);
		this.sprites = [];
	}
	init(){

		super.init();
	}
	move(){
		this.collision();
		for(let sprite of this.sprites){
			sprite.move();
		}
	}
	draw(){
		for(let sprite of this.sprites){
			sprite.draw();
		}
	}
	addSprite(sprite){
		sprite.engine = this.engine;
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

	collision(){
		for(let i = 0; i < this.sprites.length; ++i){
			for(let j = i +1; j < this.sprites.length; ++j){
				let sprite1 = this.sprites[i];
				let sprite2 = this.sprites[j];
				if(sprite1.testCollision(sprite2)){
					sprite1.collision(sprite2);
					sprite2.collision(sprite1);
				}
			}
		}
	}


}
class Sound extends Component{
	constructor(params, engine){
		super(params, engine);
		
	}
	init(){
		/**
		 * llamado cuando el componente es agregado al motor
		 * Aqui se podrian precargar algunos sonidos default del motor
		 */
		this.resources = this.getComponent("Resources");
		// va al final del init, actualmente si esta activado modo Debug,
		// tira mensaje en console de que el componente fue cargado
		super.init();
	}
	move(){
		// se ejecuta cada ciclo del gameloop
		// podria estar vacio
	}
	draw(){
		// se ejecuta cada ciclo del gameloop
		// podria estar vacio
	}


	load(src){

	}
	play(name){
		this.resources.getResource(name).play();
	}
	stop(name){

	}
	pause(name){

	}

	/**
	 * todo: cualquier cosa que se ocurra, sonidos podrian loopear, otros no.
	 * Musica de fondo seria un sonido?
	 */
}

/**
 * Metodo de testeo sin agregar al motor
 * el primer parametro es un object literal
 * que puede tener lo que sea que se necesite cuando se contruye
 */
// let sound = new Sound({}, null);
// ej2
// let sound = new Sound({algo: "algo"}, null);

/**
 * metodo de testeo en el motor
 * engine.addComponent("Sound", Sound, {params});
 *
 * luego desde cualquier sprite o componente
 * this.sound = this.getComponent("Sound"); //devuelve la instancia del motor de sonido del motor.
 */
class Engine extends GameObject{

	constructor(params){
		super(params);
		this.x = 0;
		this.y = 0;
		this.component = {};
		this.components = [];
		this.gameLoop = this.loop.bind(this);
	}
	__params__(){
		return ["canvas", "width", "height"];
	}

	init(){
		Debug.group('Engine loaded components');
		this.addComponent("Resources", Resources);
		this.addComponent("Input", Input);
		this.addComponent("Camera", Camera, {x: 0, y: 0});
		this.addComponent("Time", Time);
		this.addComponent("Sound", Sound);
		this.addComponent("Display", CanvasDisplay, {
			id: 'canvas',
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		this.addComponent("Scene", Scene);
		Debug.groupEnd();
		this.time = this.component.Time;
		this.display = this.component.Display;
		this.scene = this.component.Scene;
		this.resources = this.component.Resources;	
		this.sound = this.component.Sound;	
	}

	static ready(params){
		Debug.validateParams('Engine.ready', params, ["canvas", "width", "height", "preload", "create"]);
		(function(){
			var engine = new Engine({
				canvas: params.canvas,
				width: params.width,
				height: params.height
			});
			window.addEventListener('load', function(){
				engine.init();
				params.preload(engine);
				engine.resources.preload(params.create); // important: preload on complete calls create function
				engine.gameLoop();
			});
		})();
	}


	addComponent(name, component, params = {}){
		if(Debug.active()){
			if(typeof this.component[name] !== "undefined"){
				Debug.error(`Component ${name} is already defined`);
			}
		}
		params.name = name;
		this.component[name] = new component(params, this);
		this.component[name].init();
		this.components.push(this.component[name]);
	}

	getComponent(name){
		if(Debug.active()){
			if(typeof this.component[name] === "undefined"){
				Debug.error(`Component ${name} is not registred`);
			}
		}
		return this.component[name];
	}

	addSprite(sprite){
		this.scene.addSprite(sprite);
	}

	removeSprite(sprite){
		this.scene.removeSprite(sprite);
	}

	move(){
		for(let component of this.components){
			component.move();
		}
	}

	draw(){
		this.display.clear();
		for(let component of this.components){
			component.draw();
		}
	}

	loop(){
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
class Camera extends Component{
	constructor(params, engine){
		super(params, engine);
		this.speed = 10;
	}
	__params__(){
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
	__params__(){
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

class ResourceItem {

	constructor(params){
		Debug.validateParams('Resources.add', params, ["url", "type", "name"]);
		Object.assign(this, params);
		this.item = {};
	}

	load(success, error){
		this.item = document.createElement("audio");
		this.item.src = this.url;
		if(this.type == 'audio'){
			(function(that){
				that.item.addEventListener('canplaythrough', function(){
					Debug.success(`Loaded resource ${that.name}`);
					success();
				});
				that.item.addEventListener('error', function(){
					Debug.warn(`Error loading resources ${that.name}: ${that.url}`);
					error();
				});	
			})(this);
		}else{
			(function(that){
				that.item.addEventListener('load', function(){
					Debug.success(`Loaded resource ${that.name}`);
					success();
				});
				that.item.addEventListener('error', function(){
					Debug.warn(`Error loading resources ${that.name}: ${that.url}`);
					error();
				});	
			})(this);
		}
		
	}

}
class Resources extends Component{

	constructor(params, engine){
		super(params, engine);
		this.items = {};
		this.length = 0;
		this.loaded = 0;
		this.errors = 0;
	}

	init(){
		super.init();
	}

	add(params){
		// resources will be always overrided if existed before, problem in the future?
		this.items[params.name] = new ResourceItem(params);
		this.length++;
	}
	getResource(name){
		return this.items[name].item;
	}
	remove(name){
		delete this.items.name;
	}

	success(){
		this.loaded++;
		this.checkAllResourcesLoaded();
	}

	error(){
		// game continues even if resource failed to load. 
		// better implementation pending.
		this.errors++;
		this.loaded++;
		this.checkAllResourcesLoaded();
	}

	checkAllResourcesLoaded(){

		if(this.loaded == this.length){
			if(this.errors){
				Debug.warn(`${this.errors} resources failed to load`);
			}
			Debug.groupEnd();
			/**
			 *  callback to create game!
			 */
			this.callback(this.engine);
		}	
	}
	preload(callback){
		this.callback = callback;
		let names = Object.keys(this.items);
		Debug.group('Preloading Resources');
		for(let name of names){
			this.items[name].load(this.success.bind(this), this.error.bind(this));
		}
		
	}
}
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
		this.lastX = this.x;
		this.lastY = this.y;

	}
	getCoorners(x, y){
		this.tilemap.getCoorners(x, y, this.width, this.height, this.coorners);
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
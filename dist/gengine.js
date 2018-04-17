"use strict"; // jshint ignore:line

class Maths{
	/**
	 * Clamps a value between min and max
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 */
	static clamp(value, min, max){
		 return Math.min(Math.max(value, min), max);
	}
	static lerp(min, max, t){
		return min + (max - min) * t;
	}
	static rand(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	static randRange(min, max){
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

	static RectIntersect(rect1, rect2) {
		if (rect1.x <= rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y <= rect2.y + rect2.height &&
			rect1.height + rect1.y >= rect2.y
		) {
			return true;
		}
		return false;
	}
}

/**
 * Class with static methods to facilitate the messages on the javascript console.
 * All the methods of Debug class will only run if the debug mode is on.
 * To activate the debug mode, declare a global variable before initializing the engine
 * with the name: GENGINE_DEBUG_MODE = true.
 * If the debug mode is off, no messages would be sent to the console.
 * While developing your project, its recomended to have the debug mode on to get
 * some messages of the state of the engine.
 */
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

/**
 * Base Object of mostly all the classes of the engine.
 * It creates a structure so that when instances of objects are created,
 * the parameters are passed as object literals.
 *
 * The __params__ is used as validation of the arguments pased in the constructor.
 * __params__ should return an array with the names of all the keys which should be
 * present during the construction of an gameObject. This will only happen if the debug
 * mode is activated.
 *
 * @example
 * let o = new GameObject({x: 0, y: 0});
 *
 */
class GameObject {
	constructor(params){
		Debug.validateParams(this.constructor.name, params, this.__params__());
		Object.assign(this, params);
		const config = this.__config__();
		for (let key in config){
			if (typeof this[key] === "undefined") {
				this[key] = config[key];
			}
		}
	}
	__params__() {
		return [];
	}
	__config__() {
		return {};
	}
	init() { }
}
class Utils{
	constructor(){
		this.autoIncrementGen = (function*(){
			let count = 0;
			while(count++ < Number.MAX_SAFE_INTEGER){
				yield count;
			}
		})();

		this.characters = ['A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z','$'];
	}
	randomId(length=6){
		let result = '';
		for(let i = 0; i < length; ++i){
			result += this.characters[Math.floor(Math.random() * this.characters.length)];
		}
		return result;
	}
	/**
	 * Auto Increment generator
	 * @return {Number} An autoIncremented Number
	 */
	autoIncrement(){
		return this.autoIncrementGen.next().value;
	}
}

/**
 * A Base class of a Gengine component.
 * A component is a piece of the Engine and the Engine consists of multiple
 * components. Some Components form part of the core of the Engine, others could
 * be added as need at runtime.
 *
 * When the Engine is ready, it will add a component to itself passing the instance
 * of itself to the Component constructor and then call the init() method of the 
 * component.
 */
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

	move() { }

	draw() { }
}
/**
 * Manages the time of the game.
 * time.startTime: seconds elapsed scince the game started
 * time.frameTime: almost the same as startTime, has the elapsed seconds
 * scince the game started but it updates the value by counting the frametime of each gameloop.
 * time.deltaTime: inverse relative value to the fps of the game. When the game runs on 60fps the value is 1. 
 * When the fps drop, the deltaTime value is increased proportionaly to the amount of fps droped.
 * Example:
 * 60fps: deltaTime == 1
 * 30fps: deltaTime == 2
 * 15fps: deltaTime == 4
 */
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
	getAxisHorizontal(){
		let result =  this.keyCode("ArrowLeft") ? -1 : 0;
		result += this.keyCode("ArrowRight") ? 1 : 0;
		return result;
	}
	getAxisVertical() {
		let result = this.keyCode("ArrowUp") ? -1 : 0;
		result += this.keyCode("ArrowDown") ? 1 : 0;
		return result;
	}
}
/**
 * Base/example class of the Display component of the Engine.
 */
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
		this.camera = this.getComponent("Camera");
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
/**
 * The component for drawing sprites and figures into the canvas screen.
 */
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
		this.camera = this.getComponent("Camera");
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
		this.ctx.rect(-this.camera.x + x, -this.camera.y + y, width, height);
		this.ctx.closePath();
		this.ctx.fill();
	}
	rect(x, y, width, height, color){
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle =  color;
		this.ctx.rect(-this.camera.x + x, -this.camera.y + y, width, height);
		this.ctx.closePath();
		this.ctx.stroke();
	}
	circle(x, y, width, color){
		this.ctx.beginPath();
		this.ctx.arc(-this.camera.x + x, -this.camera.y + y, width/2, 0, 2 * Math.PI, false);
		this.ctx.strokeStyle =  color;
		this.ctx.closePath();
		this.ctx.stroke();
	}
	fillTriangleUp(x, y, width, height, color) {
		x = -this.camera.x + x;
		y = -this.camera.y + y;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + height);
		this.ctx.lineTo(x + width, y + height);
		this.ctx.lineTo(x + width, y);
		this.ctx.closePath();
		// the fill color
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	fillTriangleDown(x, y, width, height, color) {
		x = -this.camera.x + x;
		y = -this.camera.y + y;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x, y + height);
		this.ctx.lineTo(x + width, y + height);
		this.ctx.closePath();
		// the fill color
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	fillText(text, x, y){
		this.ctx.fillText(text, x, y);
	}
	drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
		this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy,dWidth, dHeight);
	}
	drawTile(sheet, index, x, y){
		let tile = sheet.tiles[index];
		this.ctx.drawImage(sheet.image, tile.x1, tile.y1, sheet.width, sheet.height, x, y, sheet.width, sheet.height);
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

class Rect extends GameObject{
    constructor (params) {
        super(params);
    }
    __params__() {
        return ["x", "y", "width", "height"];
    }

    contains(point) {
        return (point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height);
    }

    intersects(rect) {
        return (this.x <= rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y <= rect.y + rect.height &&
                this.height + this.y >= rect.y);
    }
}

class QuadTree extends Rect {
    constructor (params) {
        super(params);
        this.sectors = [];
        this.sprites = [];
    }

    __params__() {
        return ["x", "y", "width", "height", "capacity"];
    }

    subdivide () {
        let width = this.width / 2;
        let height = this.height / 2;
        this.sectors[0] = new QuadTree({
            x: this.x,
            y: this.y,
            width: width,
            height: height,
            capacity: this.capacity
        });
        this.sectors[1] = new QuadTree({
            x: this.x + width,
            y: this.y,
            width: width,
            height: height,
            capacity: this.capacity
        });
        this.sectors[2] = new QuadTree({
            x: this.x + width,
            y: this.y + height,
            width: width,
            height: height,
            capacity: this.capacity
        });
        this.sectors[3] = new QuadTree({
            x: this.x,
            y: this.y + height,
            width: width,
            height: height,
            capacity: this.capacity
        });
    }

    insert (sprite) {
        if (!this.contains(sprite)) {
            return false;
        }
        if (this.sprites.length < this.capacity) {
            this.sprites.push(sprite);
            return true;
        }
        if (!this.sectors.length) {
            this.subdivide();
        }
        return this.sectors[0].insert(sprite) || this.sectors[1].insert(sprite) || this.sectors[2].insert(sprite) || this.sectors[3].insert(sprite);
    }

    query(rect, sprites) {
        if (typeof sprites === "undefined") {
            sprites = [];
        }
        if (!rect.intersects(this)) {
            return sprites;
        }
        for (let sprite of this.sprites) {
            if (rect.contains(sprite)) {
                sprites.push(sprite);
            }
        }
        for (let sectore of this.sectors) {
            sectore.query(rect, sprites);
        }
        return sprites;
    }

}

var qtree = new QuadTree({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    capacity: 10
});
for(let i = 0; i < 30; ++i){
    qtree.insert({
        x: Maths.rand(0, 100),
        y: Maths.rand(0, 100),
        width: 10,
        height: 10
    });
}
/**
 * A class with static methods which test for collision between different
 * types of colliders.
 */
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
/**
 * Collider represents a rect/circle which can collide with another collider.
 * The position of the collider is relative to its parent sprite.
 * A sprite can have "infinite" number of colliders.
 */
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
/**
 * CircleCollider is a Collider with a circular shape.
 */
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
/**
 * RectCollider is a collider with a rectange/square shape.
 */
class RectCollider extends Collider{
	constructor(params){
		super(params);
	}
	__params__() {
		return ["parent", "x", "y", "width", "height"];
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
class RectSheet{
	constructor(x1, y1, x2, y2){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
}
/**
 * A sprite sheet consists of different sprites/tiles drawn in the same image.
 * When created, the Spritesheet will create the coordinates of each sprite/tile on
 * the image depending on the width/height of the frame/tile on the sheet.
 */
class SpriteSheet extends GameObject{
	constructor(params){
		super(params);
		this.tiles = [];
		let rwidth = Math.floor(this.image.width / this.width+this.gap);
		let cheight = Math.floor(this.image.height / this.height+this.gap);
		for(let i = 0; i < rwidth; ++i){
			for(let j = 0; j < cheight; ++j){
				let x1 = i * this.width + this.gap;
				let y1 = j * this.height + this.gap;
				let x2 = x1 + this.width;
				let y2 = y1 + this.height;
				this.tiles.push(new RectSheet(x1, y1, x2, y2));
			}
		}
	}
	__params__(){
		return ["width", "height", "image", "gap"];
	}

}
/**
 * Base Sprite component. Every Sprite of the engine should derive from this class.
 * Sprites are object which per each loop of the game move and draw.
 */
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
		this.colliders.push(new RectCollider({
			parent: this,
			x: x,
			y: y,
			width: width,
			height:height
		}));
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

	/**
	 * Method called when the sprite is added to a scene after creation
	 */
	init(){ }
	/**
	 * Method executed each game loop
	 */
	move(){ }
	/**
	 * Method executed each loop of the game
	 */
	draw(){ }
	/**
	 * Callback method executed when the sprite collided with another sprite.
	 * @param {sprite} the other sprite whith whom the collision ocurred
	 */
	collision(sprite){ }

	/**
	 * This a "destructor", when a sprite needs to be removed from a scene, executed destroy.
	 * @important on derrived Sprite classes, don't forget to execute super.destroy() at the end.
	 * otherwise the sprite won't be removed.
	 */
	destroy(){
		this.engine.scene.removeSprite(this);
	}
}

/**
 * Scene is a collection of sprites of a game level or a game scene.
 * The engine can have a single scene or multiple. Depending on the active scene of
 * the engine, that scene sprites would be draw, moved and collided on the stage.
 */
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

	play(){

	}
	stop(name){

	}
	pause(name){

	}
}
class BufferSounds extends GameObject {

  constructor(params) {
    super(params);
    this.buffer = [];
  }
  __params__(){
    return ['urls'];
  }
  init(){
      super.init();
      this.getContext();
      var that = this;

      for(let url of this.urls){
        that.load(url);
      }

  }

  load(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    var that = this;

    request.onload = function() {
      that.context.decodeAudioData(request.response, function(buffer) {

        that.buffer.push(buffer);
      }, that.error);
    };
    request.send();
  }
  getContext(){
      try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext||window.msAudioContext;
        this.context = new AudioContext();
      } catch(e) {
        alert('Este navegador no soporta la API de audio');
      }
  }

  error(error){
    Debug.error('BufferSounds: '+error);
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }

}
/**
 * Engine is the main object of the game engine.
 * Engine consist of a group of different components which manage different tasks.
 * Each component is a lego piece, and the engine is the glue which binds them together.
 * Once the document is ready, Engine will initialize each component added
 * into it, call the preloader method, execute the game creation function
 * and then start executing the game loop.
 */
class Engine extends GameObject{

	constructor(params){
		super(params);
		this.x = 0;
		this.y = 0;
		this.component = {};
		this.components = [];
		this.objects = {};
		this.gameLoop = this.loop.bind(this);
	}
	__params__(){
		return ["canvas", "width", "height"];
	}

	init(){
		Debug.group('Engine loaded components');
		this.addComponent("Resources", Resources);
		this.addComponent("Input", Input);
		this.addComponent("Camera", Camera, {
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
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
	/**
	 * Static function to replace the windows.onload method.
	 * Once the window is ready, engine will initialize its components, execute
	 * the preloader and when preloader loaded all the resources, create the game
	 * and execute the gameloop.
	 */
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
/**
 * Component for managing camera position on the screen.
 * The Camera is the viewport of the game, meaning you see the game world 
 * through the camera.
 */
class Camera extends Component{
	constructor(params, engine){
		super(params, engine);
		this.speed = 10;
	}
	__params__(){
		return ["x", "y", "width", "height"];
	}

	init(){
		this.input = this.getComponent("Input");
		super.init();
	}

	move(){
		if(this.input.keyCode("KeyS")) this.y -= this.speed;
		if(this.input.keyCode("KeyW")) this.y += this.speed;
		if(this.input.keyCode("KeyD")) this.x += this.speed;
		if(this.input.keyCode("KeyA")) this.x -= this.speed;
	}

}


var Tiles = [
	{ color: '#eee', solid: false, angle: 0, friction: 0.0 },
	{ color: '#333', solid: true, angle: 45, friction: 0.4 },
	{ color: '#333', solid: true, angle: 135, friction: 0.4 },
	{ color: '#333', solid: true, angle: 0, friction: 0.4 },
	{ color: 'red', solid: true, angle: 0, friction: 0.8 },
	{ color: 'cyan', solid: true, angle: 0, friction: -0.1 },
	{ color: 'blue', solid: true, angle: 0, friction: 3.8 }
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
		this.camera = this.getComponent("Camera");
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
		x = this.getTileX(x);
		y = this.getTileY(y);
		let tile = Tiles[this.read(x, y)];
		tile.x = x;
		tile.y = y;
		tile.width = this.twidth;
		tile.height = this.theight;
		return tile;
	}
	getCoorners(x, y, width, height, coorners){
		coorners.upLeft = this.getTile(x, y);
		coorners.upRight = this.getTile(x+width, y);
		coorners.downLeft = this.getTile(x, y+height);
		coorners.downRight = this.getTile(x+width, y+height);
	}
	getDrawRect(){
		let x1 = this.getTileX(this.camera.x);
		let y1 = this.getTileY(this.camera.y);
		let x2 = Math.ceil(this.camera.width / this.twidth);
		let y2 = Math.ceil(this.camera.height / this.theight);
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
				let tile = this.read(i, j);
				if(tile == 2) {
					this.display.fillRect(this.x + (i * this.twidth), this.y + (j * this.theight), this.twidth, this.theight, Tiles[0].color);
					this.display.fillTriangleUp(this.x + (i * this.twidth), this.y + (j * this.theight), this.twidth, this.theight, Tiles[tile].color);
				} else if (tile == 3) {
					this.display.fillRect(this.x + (i * this.twidth), this.y + (j * this.theight), this.twidth, this.theight, Tiles[0].color);
					this.display.fillTriangleDown(this.x + (i * this.twidth), this.y + (j * this.theight), this.twidth, this.theight, Tiles[tile].color);
				} else {
					this.display.fillRect(this.x + (i * this.twidth), this.y + (j * this.theight), this.twidth, this.theight, Tiles[tile].color);
					this.display.rect(this.x+(i*this.twidth), this.y+(j*this.theight), this.twidth, this.theight, Tiles[0].color);
				}
			}
		}
		return;
	}
	getCorners(x, y, sprite){

	}
}

/**
 * A RecourceItem is a media object like image, audio. It is used by the Resources class 
 * during the preload phase of the engine loading.
 */
class ResourceItem {

	constructor(params, event={success: 'load', error: 'error'}){
		Debug.validateParams('Resources.add', params, ["url", "type", "name"]);
		Object.assign(this, params);
		this.event = event;
		this.item = {};
	}

	load(success, error){
		this.item = document.createElement(this.type);
		this.item.src = this.url;
		(function(that){
			that.item.addEventListener(that.event.success, listenSuccess);
			that.item.addEventListener(that.event.error, listenError);
			function listenSuccess(){
				Debug.success(`Loaded resource ${that.name}`);
				that.item.removeEventListener(that.event.success, listenSuccess);
				success();
			}
			function listenError(){
				Debug.success(`Loaded resource ${that.name}`);
				that.item.removeEventListener(that.event.error, listenError);
				error();
			}
		})(this);
	}

}
/**
 * Resources component is set of the images and audio resources of the game.
 * It handles adding and getting the resources by a name and also the preload phase of the engine loading.
 */
class Resources extends Component{

	constructor(params, engine){
		super(params, engine);
		this.items = {};
		this.length = 0;
		this.loaded = 0;
		this.errors = 0;
		this.events = {
			"img" : {
				success: "load",
				error: "error"
			},
			"audio": {
				success: "canplaythrough",
				error: "error"
			}
		};
	}

	init(){
		super.init();
	}

	add(params){
		// resources will be always overrided if existed before, problem in the future?
		this.items[params.name] = new ResourceItem(params, this.events[params.type]);
		this.length++;
	}
	get(name){
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
class PlatformerController extends Component {
	constructor(params, engine) {
		super(params, engine);
	}
	__params__() {
		return ["tilemap"];
	}
	getCoorners(x1, y1, width, height, coorners){
		this.tilemap.getCoorners(x1, y1, width, height, coorners);
	}
	init() {
		super.init();
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
		this.velocityY = 0;
		this.gravity = 0.5;
		this.maxSpeedY = 10;
		this.jumpForce = 12;
		this.jumping = false;
		this.shooting = false;

		this.accelerationForceX = 0.8;
		this.accelerationX = 0;
		this.maxSpeedMultX = 3;
		this.velocityX = 0;
		this.frictionX = 0.4;
		this.dirX = 0;
		this.addCollider(-10, -10, this.width+10, this.height+10);
	}
	getCoorners(x, y){
		this.controller.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init(){
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.time = this.getComponent("Time");
		this.sound = this.getComponent("Sound");
		this.scene = this.getComponent("Scene");
		this.camera = this.getComponent("Camera");
		this.controller = this.getComponent("PlatformerController");

		this.camera.x = Math.floor(this.x - this.camera.width / 2);
		this.camera.y = Math.floor(this.y - this.camera.height / 2);
	}
	move(){
		// left right movement
		let moveDistanceX = 0;
		let inputX = this.input.getAxisHorizontal();
		/*
		// acceleration movement
		this.accelerationX = inputX * this.accelerationForceX;
		this.velocityX += this.accelerationX * this.time.deltaTime;
		// friction
		let currentDir = Math.sign(this.velocityX);
		this.getCoorners(this.x + moveDistanceX, this.y + this.width/2);
		let friction = (this.coorners.downRight.friction + this.coorners.downLeft.friction) / 2;
		this.velocityX += -currentDir * friction * this.time.deltaTime;
		if (Math.sign(this.velocityX) !== currentDir) {
			this.velocityX = 0;
		}
		// limit speed
		let maxSpeedX = this.maxSpeedMultX;
		if (this.input.keyCode("KeyZ") && inputX && (this.coorners.downLeft.solid || this.coorners.downRight.solid)) {
			maxSpeedX *= 2;
		}
		this.velocityX = Maths.clamp(this.velocityX, -maxSpeedX, maxSpeedX);
		moveDistanceX += this.velocityX * this.time.deltaTime;
		*/
		moveDistanceX = inputX * 18 * this.time.deltaTime;
		moveDistanceX = Math.floor(moveDistanceX);
		// test collision
		this.getCoorners(this.x + moveDistanceX, this.y);
		if(moveDistanceX > 0 && (this.coorners.downRight.solid || this.coorners.upRight.solid)) {
			this.velocityX = 0;
			moveDistanceX = (this.coorners.downRight.x * this.coorners.downLeft.width) - this.x - this.width - 1;


		}
		if(moveDistanceX < 0 && (this.coorners.downLeft.solid || this.coorners.upLeft.solid)){
			this.velocityX = 0;
			moveDistanceX = this.x - ((this.coorners.downLeft.x + 1) * this.coorners.downLeft.width) -1;
			moveDistanceX *= -1;

		}
		this.x += moveDistanceX;
		this.camera.x += moveDistanceX;






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
	}
	draw(){
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite){

	}
}

class Enemy extends Sprite {
	constructor(params) {
		super(params);
		this.color = "red";
		this.coorners = {};
		this.dirX = 1;
		this.speed = 3;
		this.speedY = 0;
		this.moveDistanceY = 0;
		this.moveDistanceX = 0;
		this.velocityY = 0;
		this.gravity = 0.5;
		this.maxSpeedY = 10;
		this.addCollider(0, 0, this.width, this.height);
	}
	getCoorners(x, y) {
		this.controller.getCoorners(x, y, this.width, this.height, this.coorners);
	}
	init() {
		this.display = this.getComponent("Display");
		this.time = this.getComponent("Time");
		this.controller = this.getComponent("PlatformerController");
	}
	move() {
		// left right movement
		this.moveDistanceX = Math.floor(this.dirX * this.speed * this.time.deltaTime);
		this.getCoorners(this.x + this.moveDistanceX, this.y);

		if (this.dirX == 1) {
			if(this.coorners.downRight.solid && this.coorners.upRight.solid) {
				this.dirX = -1;
			} else {
				this.x += this.moveDistanceX;
			}
		}
		if(this.dirX == -1) {
			if(this.coorners.downLeft.solid && this.coorners.upLeft.solid) {
				this.dirX = 1;
			} else {
				this.x += this.moveDistanceX;
			}
		}
		// gravity
		this.moveDistanceY = Math.floor(this.velocityY);
		this.velocityY += this.gravity * this.time.deltaTime;

		this.moveDistanceY = Maths.clamp(this.moveDistanceY, -this.maxSpeedY, this.maxSpeedY);
		this.getCoorners(this.x, this.y + this.moveDistanceY);

		if (this.moveDistanceY > 0 && this.coorners.downRight.solid || this.coorners.downLeft.solid) {
			this.moveDistanceY = 0;
			this.velocityY = 0;
		}
		this.y += this.moveDistanceY;
	}
	draw() {
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	collision(sprite) {

	}
}
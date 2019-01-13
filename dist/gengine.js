"use strict"; // jshint ignore:line
/* exported Maths */
class Maths{
	/**
	 * Clamps a value between min and max
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 */
	static clamp(value, min, max) {
		 return Math.min(Math.max(value, min), max);
	}

	static lerp(min, max, t) {
		return min + (max - min) * t;
	}

	static rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static smoothDamp(current, target, $currentVelocity, smoothTime, maxSpeed, deltaTime) {
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
		if ((num5 - current > 0.0) === (num8 > num5)) {
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

/* exported Debug */
/**
 * Class with static methods to facilitate the messages on the javascript console.
 * All the methods of Debug class will only run if the debug mode is on.
 * To activate the debug mode, declare a global variable before initializing the engine
 * with the name: GENGINE_DEBUG_MODE = true.
 * If the debug mode is off, no messages would be sent to the console.
 * While developing your project, its recomended to have the debug mode on to get
 * some messages of the state of the engine.
 */
class Debug {

	static active() {
		return window.GENGINE_DEBUG_MODE;
	}

	static log(message) {
		if (!Debug.active()) return;
		console.trace();
		console.log(message);
	}

	static info(message) {
		if (!Debug.active()) return;
		console.info(`%c${message}`, 'color: blue');
	}
	static success(message) {
		if (!Debug.active()) return;
		console.info(`%c${message}`, 'color: green');
	}

	static warn(message) {
		if (!Debug.active()) return;
		console.warn(message);
	}

	static error(message) {
		if (!Debug.active()) return;
		console.groupEnd();
		throw new Error(message);
	}

	static group(name) {
		if (!Debug.active()) return;
		console.groupCollapsed(name);
	}

	static groupEnd() {
		if (!Debug.active()) return;
		console.groupEnd();
	}

	/**
	 * Validates that the object literal of the constructor
	 * has the elements of the required array
	 * @param  {object} params   The constructor argument
	 * @param  {array} required The list of required keys
	 */
	static validateParams(name, params, required) {
		if (!Debug.active()) return;
		if (!required || !required.length) return;
		if (required.length && !params){
			Debug.warn(`${name} requires this members in the constructor: {${required.join(',')}}`);
		}
		for (let key of required) {
			if (typeof params[key] === "undefined") {
				Debug.error(`${name} requires of "${key}" in the constructor`);
			}
		}
	}

}

/* exported GameObject, Rect */
/**
 * Base Object of mostly all the classes of the engine.
 * It creates a structure so that when instances of objects are created,
 * the parameters are passed as object literals.
 *
 * The params is used as validation of the arguments pased in the constructor.
 * params should return an array with the names of all the keys which should be
 * present during the construction of an gameObject. This will only happen if the debug
 * mode is activated.
 *
 * @example
 * let o = new GameObject({x: 0, y: 0});
 *
 */
class GameObject {

	constructor(params) {
		Debug.validateParams(this.constructor.name, params, this.params());
		Object.assign(this, params);
		const config = this.config();
		for (let key in config) {
			if (typeof this[key] === "undefined") {
				this[key] = config[key];
			}
		}
	}

	params() {
		return [];
	}

	config() {
		return {};
	}

	init() { }
}

/* exported Rect */
class Rect extends GameObject {

	constructor(params) {
		super(params);
	}

	params() {
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

/* exported Utils */

class Utils {

	constructor() {

		let autoIncrementGen = (function*() {
			let count = 0;
			while(count++ < Number.MAX_SAFE_INTEGER) {
				yield count;
			}
		})();

		/**
		 * Auto Increment generator, starts with 1
		 * @return {number} An autoIncremented number
		 */
		this.autoIncrementId = function() {
			return autoIncrementGen.next().value;
		};

		this.characters = [
			'A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i',
			'J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r',
			'S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z'
		];
	}

	randomId(length=7) {
		let result = '#';
		for (let i = 0; i < length; ++i) {
			result += this.characters[Math.floor(Math.random() * this.characters.length)];
		}
		return result;
	}

}

/* exported Component */

/**
 * This is a base class of the component of the engine,
 * Components are single instance pieces of the engine.
 * The engine consist of multiple components which perform various tasks.
 * Some Components form part of the core of the Engine, others could
 * be added as need at runtime.
 * When the Engine is ready, it will create the instance of the component and pass itself as the engine parameter.
 * Each Component instance has access to the engine
 * The engine is the responsable for calling new Component, this constructor shouldn't be called in the game code
 * @param {object} params Object literal with parameters passed to the component constructed
 * @param {object} engine The instance of the engine, this will be passed by the engine
 */
class Component extends GameObject {

	constructor(params, engine) {
		super(params);
		this.engine = engine;
		this.name = params.name;
	}
	/**
	 * Returns an instance of an engine component
	 * @param  {string} name The name of the component
	 * @return {object}      Instance of the component
	 */
	getComponent(name) {
		return this.engine.getComponent(name);
	}

	/**
	 * Method called when the component has been added to the engine and is ready
	 */
	init() {
		Debug.success(`${this.name} initialized`);
	}

	/**
	 * Method called each cycle of the engine game loop
	 */
	move() { }

	/**
	 * Method called each cycle of the engine game loop
	 */
	draw() { }

}

/* exported Time */
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
class Time extends Component {

	constructor(params, engine) {
		super(params, engine);
		this.deltaTime = 0;
		this.time = 0;
		this.frameTime = 0;
		this.frameCount = 0;
		this.fps = 0;
		this.startTime = performance.now() / 1000;
		this.lastTime = this.startTime;
	}

	params() {
		return [];
	}

	init() {
		this.lastTime = performance.now() / 1000;
		super.init();
	}

	move() {
		let current = performance.now() / 1000;
		this.deltaTimeFS = current - this.lastTime;
		this.deltaTime = this.deltaTimeFS / (1/60);
		this.frameTime += this.deltaTime;
		this.time = current - this.startTime;
		this.lastTime = current;
		this.fps = 1000 / (this.deltaTimeFS * 1000);
	}
}

/* exported Input */
class Input extends Component {

	constructor(params, engine) {
		super(params, engine);
		this.keyCode_ = {};
		this.mouse = {
			x: 0,
			y: 0,
			inside: false
		};
	}

	init() {
		this.camera = this.getComponent("Camera");
		super.init();
	}
	params() {
		return [];
	}

	mouseMove(e) {
		let rect = this.engine.display.canvas.getBoundingClientRect();
		this.mouse.x = e.clientX - rect.left;
		this.mouse.y = e.clientY - rect.top;
		if (e.buttons === 2) {
			this.camera.x -= e.movementX;
			this.camera.y -= e.movementY;
		}
	}

	mouseEnter() {
		this.mouse.inside = true;
	}

	mouseLeave() {
		this.mouse.inside = false;
	}

	mouseClick() {
		let x = this.engine.tilemap.getTileX(this.mouse.x + this.camera.x);
		let y = this.engine.tilemap.getTileY(this.mouse.y + this.camera.y);
		this.engine.tilemap.write(x, y, parseInt(document.getElementById("tile").value));
	}

	keyDown(e) {
		this.keyCode_[e.code] = true;
	}

	keyUp(e) {
		this.keyCode_[e.code] = false;
	}

	keyCode(code) {
		return typeof this.keyCode_[code] !== "undefined" ? this.keyCode_[code] : false;
	}

	getAxisHorizontal() {
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

/* exported Display, CanvasDisplay, WebGLDisplay */

/**
 * Abstract class of the Display component of the Engine.
 */
class Display extends Component{

	constructor(params, engine) {
		super(params, engine);
		this.scale = 1;
	}

	set zoom(value) {
		//jshint unused:false
	}

	get zoom() {
		return this.scale;
	}

	init() {
		this.canvas = document.getElementById(this.id);
		this.camera = this.getComponent("Camera");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		super.init();
	}

	clear() { }

	fillRect(x, y, width, height, color) {
		//jshint unused:false
	}

	rect(x, y, width, height, color) {
		//jshint unused:false
	}

	circle(x, y, width, color) {
		//jshint unused:false
	 }

	move() {
		this.clear();
	}
}
/**
 * The component for drawing sprites and figures into the canvas screen.
 */
class CanvasDisplay extends Component{
	constructor(params, engine) {
		super(params, engine);
		this.scale = 1;
	}

	params() {
		return ["x", "y", "width", "height"];
	}

	__configs__() {
		return {
			imageSmoothingEnabled: false
		};
	}

	init () {
		this.canvas = document.getElementById(this.id);
		this.canvas.setAttribute('width', this.width);
		this.canvas.setAttribute('height', this.height);
		this.canvas.style.cursor = "none";
		this.ctx = this.canvas.getContext('2d');
		this.ctx.font = "16px Helvetica";
		this.ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
		this.camera = this.getComponent("Camera");
		super.init();
	}

	set zoom(value) {
		this.scale = value;
		this.ctx.scale(value, value);
		this.engine.width = this.engine.width / value;
		this.engine.height = this.engine.height / value;
	}

	get zoom() {
		return this.scale;
	}

	clear() {
		//this.ctx.clearRect(0, 0, this.width / this.scale, this.height / this.scale);
		this.ctx.fillStyle = '#0FF';
		this.ctx.fillRect(0, 0, this.width / this.scale, this.height / this.scale);
	}

	fillRect(x, y, width, height, color) {
		this.ctx.beginPath();
		this.ctx.fillStyle =  color;
		this.ctx.rect(-this.camera.x + x, -this.camera.y + y, width, height);
		this.ctx.closePath();
		this.ctx.fill();
	}

	rect(x, y, width, height, color) {
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle =  color;
		this.ctx.rect(-this.camera.x + x, -this.camera.y + y, width, height);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	circle(x, y, width, color) {
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

	fillText(text, x, y) {
		this.ctx.fillText(text, x, y);
	}

	drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
		this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	}

	drawTile(x, y, width, height, sheet, index) {
		let tile = sheet.tiles[index];
		this.ctx.drawImage(sheet.image, tile.x, tile.y, sheet.width, sheet.height, x - this.camera.x, y - this.camera.y, width, height);
	}
}

class WebGLDisplay extends Display {

	constructor(params) {
		super(params);
		this.canvas = document.getElementById(this.id);
		this.gl = this.canvas.getContext('webgl');
		this.scale = 1;
		if (!this.gl) {
			Debug.error("Unable to initialize WebGL. Your browser or machine may not support it.");
		}
		// Set clear color to black, fully opaque
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		// Clear the color buffer with specified clear color
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
}

/* exported Events */
class Events extends Component {

	constructor(params, engine) {
		super(params, engine);
	}

	init() {
        let input = this.getComponent("Input");
        let display = this.getComponent("Display");
        display.canvas.addEventListener("mousemove", input.mouseMove.bind(input), false);
        display.canvas.addEventListener("mouseenter", input.mouseEnter.bind(input), false);
        display.canvas.addEventListener("mouseleave", input.mouseLeave.bind(input), false);
        display.canvas.addEventListener("click", input.mouseClick.bind(input), false);
		window.addEventListener("keydown", input.keyDown.bind(input), false);
		window.addEventListener("keyup", input.keyUp.bind(input), false);
		super.init();
	}

	params() {
		return [];
	}

}

/* exported Network */
class Network extends Component{
	constructor(params, engine) {
		super(params, engine);
		this.sprites = {};
		if (typeof io === "undefined") {
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

	params() {
		return ["url", "player", "dummy"];
	}

	init() {
		this.connect();
		super.init();
	}

	move() {
		this.socket.emit('move_player', {
			x: this.player.x,
			y: this.player.y,
			id: this.socket.id
		});
	}

	draw() {

	}

	connect() {
		Debug.info(`Connecting to the server ${this.url}`);
		this.socket.connect();
	}

	disconnect() {
		Debug.warn(`Disonected from server`);
		this.socket.disconnect();
	}

	onConnect(data) {  // jshint ignore:line
		Debug.success(`Connected to the server`);
		this.socket.emit('init_player', {
			id: this.socket.id,
			x: this.player.x,
			y: this.player.y
		});
	}

	onDisconnect(data) {  // jshint ignore:line
		this.socket.disconnect();
	}

	onConnectionError(data) {  // jshint ignore:line
		Debug.warn(`Server connection error`);
		this.socket.disconnect();
	}

	createNetworkPlayer(data) {
		this.sprites[data.id] = new this.dummy({
			x: data.x,
			y: data.y,
			parent: this
		});
		this.engine.addSprite(this.sprites[data.id]);
	}

	onEnterNetworkPlayer(data) {
		this.createNetworkPlayer(data);
	}

	onLeaveNetworkPlayer(data) {
		if (typeof this.sprites[data.id] !== "undefined") {
			this.engine.removeSprite(this.sprites[data.id]);
			delete this.sprites[data.id];
		}
	}

	onUpdateNetworkPlayer(data) {
		if (typeof this.sprites[data.id] === "undefined") {
			this.createNetworkPlayer(data);
		}
		this.sprites[data.id].x = data.x;
		this.sprites[data.id].y = data.y;
	}

}

/* exported QuadTree */
class QuadTree extends Rect {

    constructor (params) {
        super(params);
        this.sectors = [];
        this.sprites = [];
    }

    params() {
        return ["x", "y", "width", "height", "capacity"];
    }

    subdivide() {
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

    insert(sprite) {
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
/**
let qtree = new QuadTree({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    capacity: 10
});
for (let i = 0; i < 30; ++i) {
    qtree.insert({
        x: Maths.rand(0, 100),
        y: Maths.rand(0, 100),
        width: 10,
        height: 10
    });
}
*/

/* exported TestCollision */
/**
 * A class with static methods which test for collision between different
 * types of colliders.
 */
class TestCollision {

	static CircleVsRect(circle, rect) {
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

	static RectVsCircle(rect, circle) {
		return this.CircleVsRect(circle, rect);
	}

	static RectVsRect(rect1, rect2) {
		if (rect1.gx <= rect2.gx + rect2.width &&
			rect1.gx + rect1.width > rect2.gx &&
			rect1.gy <= rect2.gy + rect2.height &&
			rect1.height + rect1.gy >= rect2.gy
		) {
			return true;
		}
		return false;
	}

	static CircleVsCircle(circle1, circle2) {
		let dx = circle1.gx - circle2.gx;
		let dy = circle1.gy - circle2.gy;
		let distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < circle1.width/2 + circle2.width/2) {
			return true;
		}
		return false;
	}
}

/* exported Collider, CircleCollider, RectCollider */

/**
 * Collider represents a rect/circle which can collide with another collider.
 * The position of the collider is relative to its parent sprite.
 * A sprite can have "infinite" number of colliders.
 */
class Collider extends GameObject {

	constructor(params) {
		super(params);
	}

	test(collider) {  // jshint ignore:line
		// to do
	}

	get gx() {
		return this.parent.x + this.x;
	}

	get gy() {
		return this.parent.y + this.y;
	}

	debugDraw(color) {
		color = typeof color === "undefined" ? "red" : color;
		if (this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}
}
/**
 * CircleCollider is a Collider with a circular shape.
 */
class CircleCollider extends Collider {

	constructor(params) {
		super(params);
		this.radius = this.width / 2;
	}

	test(collider) {
		if (collider instanceof CircleCollider) {
			return TestCollision.CircleVsCircle(this, collider);
		}
		if (collider instanceof RectCollider) {
			return TestCollision.CircleVsRect(this, collider);
		}
		return false; //posible bug with not knowing which collider to choose
	}

	debugDraw(color) {
		color = typeof color === "undefined" ? "red" : color;
		if (this.parent && this.parent.display)
			this.parent.display.circle(this.gx, this.gy, this.width, color);
	}
}
/**
 * RectCollider is a collider with a rectange/square shape.
 */
class RectCollider extends Collider { // jshint ignore:line

	constructor(params) {
		super(params);
	}

	params() {
		return ["x", "y", "width", "height"];
	}

	test(collider) {
		if (collider instanceof CircleCollider) {
			return TestCollision.CircleVsRect(collider, this);
		}
		if (collider instanceof RectCollider) {
			return TestCollision.RectVsRect(this, collider);
		}

		Debug.error("Unknown collider " + typeof collider);
		return false; //if unknow collider will return false, posible bug
	}

	debugDraw(color) {
		color = typeof color === "undefined" ? "red" : color;
		if (this.parent && this.parent.display)
			this.parent.display.rect(this.gx, this.gy, this.width, this.height, color);
	}
}

/* exported Point, SpriteSheet */
class Point{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
/**
 * A sprite sheet consists of different sprites/tiles drawn in the same image.
 * When created, the Spritesheet will create the coordinates of each sprite/tile on
 * the image depending on the width/height of the frame/tile on the sheet.
 */
class SpriteSheet extends GameObject {

	constructor(params) {
		super(params);
		this.tiles = [];
		let iCount = 1;
		let jCount = 1;
		if (this.padding) {
			while (this.image.width - this.offsetX - iCount++ * (this.width + this.padding) >= this.width);
			while (this.image.height - this.offsetY - jCount++ * (this.height + this.padding) >= this.width);
			iCount--;
			jCount--;
		} else {
			iCount = Math.floor((this.image.width - this.offsetX) / this.width);
			jCount = Math.floor((this.image.height - this.offsetY) / this.height);
		}

		for (let j = 0; j < jCount; ++j) {
			for (let i = 0; i < iCount; ++i) {
				let x = this.offsetX + (i * this.padding) + i * this.width;
				let y = this.offsetY + (j * this.padding) + j * this.height;
				this.tiles.push(new Point(x, y));
			}
		}
	}

	params() {
		return ["width", "height", "image"];
	}

	config() {
		return {
			offsetX: 0,
			offsetY: 0,
			padding: 0
		};
	}
}

/* exported Sprite */

/**
 * Base Sprite component. Every Sprite of the engine should derive from this class.
 * Sprites are object which per each loop of the game move, draw and test collision.
 * @param {object}	params  		Object literal of the constructor
 * @param {number}	params.x 		X position of the sprite
 * @param {number}	params.y 		Y position of the sprite
 * @param {number}	params.width	Width of the sprite
 * @param {number}	params.height	Height of the sprite
 * @return {object} Returns the sprite instance
 */
class Sprite extends GameObject {

	constructor(params) {
		super(params);
		this.colliders = [];
		this.colliding = false;
	}

	params() {
		return ["x", "y", "width", "height"];
	}

	/**
	 * Returns the instance of the Component loaded in the engine
	 * @param  {string}		name Name of the component
	 * @return {object}		The Instance of the Component
	 */
	getComponent(name) {
		return this.engine.getComponent(name);
	}

	/**
	 * Adds a collider to the sprite
	 * @param {object} collider Instance of the collider to be added
	 */
	addCollider(collider) {
		collider.parent = this;
		this.colliders.push(collider);
	}

	/**
	 * Draws a box around the sprite
	 * @param  {string} color Color of the rectangle, default red
	 */
	debugDraw(color = "red") {
		if (this.parent && this.parent.display)
			this.parent.display.rect(this.x, this.y, this.width, this.height, color);
	}

	/**
	 * Tests for collision between each collider of the sprite against a sprite
	 * @param {object} sprite Sprite to test the collision with
	 * @return {boolean} True if collision detected
	 */
	testCollision(sprite) {
		if (!TestCollision.RectVsRect(this, sprite)) {
			return false;
		}
		for (let collider1 of this.colliders)
			for (let collider2 of sprite.colliders)
				if (collider1.test(collider2))
					return true;
		return false;
	}

	/**
	 * Method called when the sprite is added to a scene after creation
	 */
	init() { }

	/**
	 * Method executed each game loop
	 */
	move() { }

	/**
	 * Method executed each loop of the game
	 */
	draw() { }

	/**
	 * Method executed when the sprite collided with another sprite.
	 * @param {object} sprite The other sprite with whom the collision ocurred
	 */
	collision(sprite) {
		//jshint unused:false
	}

	/**
	 * Method executed when the sprite is removed from the engine scene
	 */
	destroy() { }

	/**
	 * Removes the sprite from the scene after calling the destroy method.
	 * @important on derrived Sprite classes, don't forget to execute super.remove() at the end
	 * otherwise the sprite won't be removed.
	 */
	remove() {
		this.destroy();
		this.engine.scene.removeSprite(this);
	}
}

/* exported Animation, Animator, AnimatedSprite */

class Animation extends GameObject {

	constructor(params) {
		super(params);
		this.start = this.frames[0];
		this.end = this.frames[this.frames.length];
		this.current = this.start;
		this.finished = false;
	}

	params() {
		return ["name", "spriteSheet", "frames"];
	}

	config() {
		return {
			fps: 60,
			loop: false
		};
	}

	next() {
		if (!this.finished) {
			this.current += 1;
		}
		if (this.current > this.end) {
			if (this.loop) {
				this.current = this.start;
			} else {
				this.finished = true;
				this.current = this.end;
			}
		}
		return this.finished;
	}

	restart() {
		this.current = this.start;
	}

}

class Animator extends GameObject {

	constructor(params) {
		super(params);
	}
}

class AnimatedSprite extends Sprite {

	constructor(params) {
		super(params);
	}

	params() {
		return super.params().concat(["animator"]);
	}

	draw() {
		if (this.velocity.x === 0) {
			this.animator.idle();
		} else if (this.velocity.x >= 0 && this.velocity.x <= 3) {
			this.animator.walkRight();
		} else if (this.velocity.x > 3) {
			this.animator.runRight();
		} else if (this.velocity.x < 0 && this.velocity.x >= -3) {
			this.animator.walkLeft();
		} else if (this.velocity.x < -3) {
			this.animator.runLeft();
		}
	}
}
/* exported Scene */
/**
 * Scene is a collection of sprites of a game.
 * Only the sprites in the same scene can collide with each other.
 * The engine can have a single scene or multiple. Depending on the active scene of
 * the engine, that scene sprites would be draw, moved and collided on the stage.
 */
class Scene extends Component {
	constructor(params, engine) {
		super(params, engine);
		this.sprites = [];
	}

	config() {
		return {
			active: true,
			visible: true
		};
	}

	init() {
		super.init();
	}

	move() {
		if (!this.active) {
			return;
		}
		this.collision();
		for (let sprite of this.sprites) {
			sprite.move();
		}
	}

	draw() {
		if (!this.visible) {
			return;
		}
		for (let sprite of this.sprites) {
			sprite.draw();
		}
	}

	addSprite(sprite) {
		sprite.engine = this.engine;
		sprite.id = this.engine.utils.autoIncrementId();
		sprite.scene = this;
		this.engine.objects[sprite.id] = {
			sprite: sprite
		};
		sprite.init();
		this.sprites.push(sprite);
		return;
	}

	removeSprite(sprite) {
		let index = this.sprites.indexOf(sprite);
		if (index !== -1) {
			this.sprites.splice(index, 1);
		}
	}

	collision() {
		for (let i = 0; i < this.sprites.length; ++i) {
			for (let j = i +1; j < this.sprites.length; ++j) {
				let sprite1 = this.sprites[i];
				let sprite2 = this.sprites[j];
				if (sprite1.testCollision(sprite2)) {
					sprite1.collision(sprite2);
					sprite2.collision(sprite1);
				}
			}
		}
	}
}

/* exported Stage */

/**
 * Stage is a collection of scenes.
 * Engine can have multiple scenes active or visible at the same time.
 */
class Stage extends Component {
	constructor(params, engine) {
		super(params, engine);
		this.scenes = [];
		let scene = new Scene({name: "main"}, engine);
		scene.init();
		scene.stage = this;
		this.scenes.push(scene);
	}

	init() {
		this.input = this.getComponent("Input");
		this.camera = this.getComponent("Camera");
		this.display = this.getComponent("Display");
		super.init();
	}

	move() {
		for (let scene of this.scenes) {
			scene.move();
		}
	}

	draw() {
		for (let scene of this.scenes) {
			scene.draw();
		}
		if (this.input.mouse.inside) {
			this.display.circle(this.camera.x + this.input.mouse.x - 1, this.camera.y + this.input.mouse.y - 1, 4, 'red');
		}
	}
}

/* exported Sound */
class Sound extends Component{
	constructor(params, engine) {
		super(params, engine);
	}

	init() {
		super.init();
	}

	move() {
		// se ejecuta cada ciclo del gameloop
		// podria estar vacio
	}

	draw() {
		// se ejecuta cada ciclo del gameloop
		// podria estar vacio
	}

	play() {

	}

	stop(name) {  // jshint ignore:line

	}

	pause(name) {  // jshint ignore:line

	}
}

/* exported Engine */
/**
 * Engine is the main object of the game engine.
 * Engine consist of a group of different components which manage different tasks.
 * Each component is a lego piece, and the engine is the glue which binds them together.
 * Once the document is ready, Engine will initialize each component added
 * into it, call the preloader method, execute the game creation function
 * and then start executing the game loop.
 */
class Engine extends GameObject {

	constructor(params) {
		super(params);
		this.x = 0;
		this.y = 0;
		this.component = {};
		this.components = [];
		this.objects = {};
		this.utils = new Utils();
		this.gameLoop = this.loop.bind(this);
	}

	params() {
		return ["canvas", "width", "height"];
	}

	init() {
		Debug.group('Engine loaded components');
		this.addComponent("Resources", Resources);
		this.addComponent("Camera", Camera, {
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		this.addComponent("Input", Input);
		this.addComponent("Time", Time);
		this.addComponent("Sound", Sound);
		this.addComponent("Display", CanvasDisplay, {
			id: 'canvas',
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		this.addComponent("Stage", Stage);
		this.addComponent("Events", Events);
		Debug.groupEnd();
		this.time = this.component.Time;
		this.display = this.component.Display;
		this.stage = this.component.Stage;
		this.resources = this.component.Resources;
		this.sound = this.component.Sound;
		this.input = this.component.Input;
	}
	/**
	 * Static function to replace the windows.onload method.
	 * Once the window is ready, engine will initialize its components, execute
	 * the preloader and when preloader loaded all the resources, create the game
	 * and execute the gameloop.
	 */
	static create(params) {
		Debug.validateParams('Engine.create', params, ["canvas", "width", "height", "preload", "game"]);
		(function() {
			let engine = new Engine({
				canvas: params.canvas,
				width: params.width,
				height: params.height
			});
			window.addEventListener('load', function() {
				engine.init();
				params.preload(engine);
				engine.resources.preload(params.game); // important: preload on complete calls game function
				engine.gameLoop();
			});
		})();
	}

	addComponent(name, Component, params = {}) {
		if (Debug.active()) {
			if (typeof this.component[name] !== "undefined") {
				Debug.error(`Component ${name} is already defined`);
			}
		}
		params.name = name;
		this.component[name] = new Component(params, this);
		this.component[name].init();
		this.components.push(this.component[name]);
	}

	getComponent(name) {
		if (Debug.active()) {
			if (typeof this.component[name] === "undefined") {
				Debug.error(`Component ${name} is not registred`);
			}
		}
		return this.component[name];
	}

	move() {
		for (let component of this.components) {
			component.move();
		}
	}

	draw() {
		this.display.clear();
		for (let component of this.components) {
			component.draw();
		}
	}

	loop() {
		this.move();
		this.fpsDelayCount = 0;
		this.draw();
		this.debugInfo();
		window.requestAnimationFrame(this.gameLoop);
	}

	debugInfo() {
		if (!Debug.active()) return;
		this.display.fillText((this.time.time).toFixed(2), 20, 20);
		this.display.fillText((this.time.deltaTime).toFixed(4), 20, 40);
		this.display.fillText(this.time.fps.toFixed(2), 20, 60);
	}
}

/* exported Camera */
/**
 * Component for managing camera position on the screen.
 * The Camera is the viewport of the game, meaning you see the game world
 * through the camera.
 * exported Camera
 */
class Camera extends Component {

	constructor(params, engine) {
		super(params, engine);
		this.speed = 10;
	}
	params() {
		return ["x", "y", "width", "height"];
	}

	init() {
		//this.input = this.getComponent("Input");
		super.init();
	}

	move() {
		/*if (this.input.keyCode("KeyS")) this.y -= this.speed;
		if (this.input.keyCode("KeyW")) this.y += this.speed;
		if (this.input.keyCode("KeyD")) this.x += this.speed;
		if (this.input.keyCode("KeyA")) this.x -= this.speed;*/
	}

}

/* exported Matrix */
class Matrix {

	constructor(width, height) {
		this.array = new Uint16Array(width * height);
		this.width = width;
		this.height = height;
	}

	read(x, y) {
		return this.array[y * this.width + x];
	}

	write(x, y, value) {
		this.array[y * this.width + x] = value;
	}

	load(array) {
		this.array = new Uint16Array(array);
	}

	randomize() {
		for (let i = 0; i < this.array.length; ++i) {
			this.array[i] = Maths.rand(0, 3);
		}
	}

}

/* exported Tile */
class Tile extends GameObject {

	constructor(params) {
		super(params);
	}

	params() {
		return [];
	}

	config() {
		return {
			solid: {
				top: false, bottom: false, right: false, left: false
			},
			angle: 0
		};
	}

}
/* exported TileMap */
class TileMap extends Sprite {

	constructor(params) {
		super(params);
		this.map = new Matrix(this.width, this.height);
		this.mwidth = this.width * this.twidth;
		this.mheight = this.height * this.theight;
	}

	params() {
		return ["x", "y", "width", "height", "twidth", "theight", "sheet", "tiles"];
	}

	read(x, y) {
		return this.map.read(x, y);
	}

	write(x, y, value) {
		this.map.write(x, y, value);
	}

	load(array) {
		if (array.length !== (this.width * this.height)) {
			Debug.warn(`Tilemap size mismatch with width: ${this.width} and height ${this.height}`);
		}
		this.map.load(array);
	}

	save() {
		let result = '';
		let count = 0;
		for (let i = 0; i < this.map.array.length; ++i) {
			let char = this.map.array[i];
			char = char.toString();
			char = char.length > 1 ? char : "  " + char;
			char = char.length > 2 ? char : " " + char;
			result += char + ",";
			if (++count >= this.width) {
				count = 0;
				result += "\r\n";
			}
		}
		document.getElementById("map").value = result;
	}

	init() {
		this.camera = this.getComponent("Camera");
		this.display = this.getComponent("Display");
		//this.map.randomize();
	}

	randomize() {
		this.map.randomize();
	}

	getTileX(x) {
		return Math.floor((x / this.twidth) % this.mwidth);
	}

	getTileY(y) {
		return Math.floor((y / this.theight) % this.mheight);
	}

	getTile(x, y) {
		x = this.getTileX(x);
		y = this.getTileY(y);
		let tile = this.tiles[this.read(x, y)] || this.tiles[0];
		tile.x = x;
		tile.y = y;
		tile.width = this.twidth;
		tile.height = this.theight;
		return tile;
	}

	getCoorners(x, y, width, height) {
		return {
			upLeft: this.getTile(x, y),
			upRight: this.getTile(x+width, y),
			downLeft: this.getTile(x, y+height),
			downRight: this.getTile(x+width, y+height)
		};
	}

	getDrawRect() {
		let x1 = this.getTileX(this.camera.x);
		let y1 = this.getTileY(this.camera.y);
		let x2 = Math.ceil(this.camera.width / this.twidth);
		let y2 = Math.ceil(this.camera.height / this.theight);
		x1 = Maths.clamp(x1, 0, this.width);
		y1 = Maths.clamp(y1, 0, this.height);
		x2 = Maths.clamp(x2+x1+1, x1, this.width);
		y2 = Maths.clamp(y2+y1+1, y1, this.height);
		return {
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2
		};
	}

	draw() {
		let rect = this.getDrawRect();
		for (let i = rect.x1; i < rect.x2; ++i) {
			for (let j = rect.y1; j < rect.y2; ++j) {
				let tile = this.read(i, j);
				if (tile) {
					this.display.drawTile(
						this.x + (i * this.twidth),
						this.y + (j * this.theight),
						this.twidth,
						this.theight,
						this.sheet,
						tile - 1
					);
				}
			}
		}
		return;
	}

	getCorners(x, y, sprite) { // jshint ignore:line

	}
}

/* exported ResourceItem, Resources */
/**
 * A RecourceItem is a media object like image, audio. It is used by the Resources class
 * during the preload phase of the engine loading.
 */

class ResourceItem {
	constructor(params) {
		Debug.validateParams('Resources.add', params, ["url", "type", "name"]);
		Object.assign(this, params);
		this.buffer = {};
		this.item = {};
	}

	load(successCallback, errorCallback) {
		const request = new XMLHttpRequest();
		request.responseType = "blob";
		request.onload = () => {
			if (request.status >= 200 && request.status < 400) {
				this.buffer  = request.response;
				this.item = new Image();
				this.item.src = window.URL.createObjectURL(request.response);
				Debug.info(`Success loading ${this.name}`);
				successCallback();
			} else {
				Debug.error(`Error loading ${this.name}`);
				errorCallback();
			}
		};
		request.onerror = () => {
			Debug.error(`Error loading ${this.name}`);
			errorCallback();
		};
		request.open('GET', this.url, true);
		request.send();
	}

}
/**
 * Resources component is set of the images and audio resources of the game.
 * It handles adding and getting the resources by a name and also the preload phase of the engine loading.
 */
class Resources extends Component {
	constructor(params, engine) {
		super(params, engine);
		this.items = {};
		this.length = 0;
		this.loaded = 0;
		this.errors = 0;
	}

	init() {
		super.init();
	}

	add(params) {
		// resources will be always overrided if existed before, problem in the future?
		this.items[params.name] = new ResourceItem(params);
		this.length++;
	}

	get(name) {
		return this.items[name].item;
	}

	remove(name) {
		delete this.items[name];
	}

	success() {
		this.loaded++;
		this.checkAllResourcesLoaded();
	}

	error() {
		// game continues even if resource failed to load.
		// better implementation pending.
		this.errors++;
		this.loaded++;
		this.checkAllResourcesLoaded();
	}

	checkAllResourcesLoaded() {

		if (this.loaded === this.length) {
			if (this.errors) {
				Debug.warn(`${this.errors} resources failed to load`);
			}
			Debug.groupEnd();
			/**
			 *  callback to create game!
			 */
			setTimeout(() => {
				this.callback(this.engine);
			}, 1000);

		}
	}

	preload(callback) {
		this.callback = callback;
		let names = Object.keys(this.items);
		Debug.group('Preloading Resources');
		for (let name of names) {
			this.items[name].load(this.success.bind(this), this.error.bind(this));
		}

	}
}

/* exported PlatformController, Player */
class PlatformController extends Component {

	constructor(params, engine) {
		super(params, engine);
		this.maxVelocityY = 10;
		this.gravity = 0.5;
	}

	params() {
		return ["tilemap"];
	}

	getCoorners(x1, y1, width, height) {
		return this.tilemap.getCoorners(x1, y1, width, height);
	}

	checkForWalls(sprite, moveDistanceX) {
		moveDistanceX = Math.floor(moveDistanceX);
		let coorners = this.getCoorners(sprite.x + moveDistanceX, sprite.y, sprite.width, sprite.height);
		if (moveDistanceX > 0 && (coorners.downRight.solid.left || coorners.upRight.solid.left)) {
			sprite.velocityX = 0;
			sprite.accelerationX = 0;
			moveDistanceX = 0;
			//moveDistanceX = (coorners.downRight.x * coorners.downLeft.width) - sprite.x - sprite.width - 1;
		}
		if (moveDistanceX < 0 && (coorners.downLeft.solid.right || coorners.upLeft.solid.right)) {
			//moveDistanceX = sprite.x - ((coorners.downLeft.x + 1) * coorners.downLeft.width) - 1;
			//moveDistanceX *= -1;
			sprite.velocityX = 0;
			sprite.accelerationX = 0;
			moveDistanceX = 0;
		}
		return moveDistanceX;
	}

	applyGravity(sprite) {
		let moveDistanceY = Math.floor(sprite.velocityY);
		if (!sprite.jumping) {
			sprite.velocityY += this.gravity * this.time.deltaTime;
		} else {
			sprite.velocityY += this.gravity * 1.2 * this.time.deltaTime;
		}
		moveDistanceY = Maths.clamp(moveDistanceY, -this.maxVelocityY, this.maxVelocityY);
		let coorners = this.getCoorners(sprite.x, sprite.y + moveDistanceY, sprite.width, sprite.height);
		if (moveDistanceY > 0) {
			if (coorners.downRight.solid.top || coorners.downLeft.solid.top) {
				moveDistanceY = 0;
				sprite.velocityY = 0;
				sprite.jumping = false;
			}
		} else {
			if (coorners.upRight.solid.bottom || coorners.upLeft.solid.bottom) {
				moveDistanceY = 0;
				sprite.velocityY = 0;
			}
		}
		return moveDistanceY;
	}

	init() {
		super.init();
		this.time = this.getComponent("Time");
	}
}

class Player extends Sprite {

	constructor(params) {
		super(params);
		this.color = "blue";
		this.coorners = {};
		this.vars = {};
		this.smoothTime = 1.3;
		this.vars.cv = 0;
		this.dir = 1;
		this.speed = 6;
		this.speedY = 0;
		this.velocityY = 0;
		this.jumpForce = 12;
		this.jumping = false;
		this.shooting = false;

		this.accelerationForceX = 1.8;
		this.accelerationX = 0;
		this.maxSpeedMultX = 9;
		this.velocityX = 0;
		this.frictionX = 0.9;
		this.dirX = 0;
		this.addCollider(new RectCollider({
			x: -10,
			y: -10,
			width: this.width + 10,
			height: this.height + 10
		}));
	}

	getCoorners(x, y) {
		return this.controller.getCoorners(x, y, this.width, this.height);
	}

	init() {
		this.input = this.getComponent("Input");
		this.display = this.getComponent("Display");
		this.time = this.getComponent("Time");
		this.sound = this.getComponent("Sound");
		this.camera = this.getComponent("Camera");
		this.controller = this.getComponent("PlatformController");

		this.camera.x = Math.floor(this.x - this.camera.width / 2);
		this.camera.y = Math.floor(this.y - this.camera.height / 2);
	}

	move() {
		// left right movement
		let moveDistanceX = 0;
		let inputX = this.input.getAxisHorizontal();

		// acceleration movement

		if (!this.jumping) {
			this.accelerationX = inputX * this.accelerationForceX;
		} else {
			this.accelerationX = inputX * this.accelerationForceX / 6;
		}
		this.velocityX += this.accelerationX * this.time.deltaTime;
		// friction
		let currentDir = Math.sign(this.velocityX);
		if (!this.jumping) {
			this.velocityX += -currentDir * this.frictionX * this.time.deltaTime;
		} else {
			this.velocityX += -currentDir * this.frictionX / 10 * this.time.deltaTime;
		}
		if (Math.sign(this.velocityX) !== currentDir) {
			this.velocityX = 0;
		}
		// limit speed
		let maxSpeedX = this.maxSpeedMultX;
		if (this.input.keyCode("KeyZ") && inputX && (this.coorners.downLeft.solid.top || this.coorners.downRight.solid.top)) {
			maxSpeedX *= 2;
		}
		this.velocityX = Maths.clamp(this.velocityX, -maxSpeedX, maxSpeedX);
		moveDistanceX += this.velocityX * this.time.deltaTime;

		//moveDistanceX = inputX * 8 * this.time.deltaTime;
		moveDistanceX = this.controller.checkForWalls(this, moveDistanceX);
		this.x += moveDistanceX;
		this.camera.x += moveDistanceX;
		// gravity
		let moveDistanceY = this.controller.applyGravity(this);
		this.y += moveDistanceY;
		this.camera.y += moveDistanceY;
		// jump pressed and not jumping
		if (this.input.keyCode("ArrowUp") && !this.jumping) {
			this.jumping = true;
			this.velocityY = -this.jumpForce;
		}
		// jump released and jumping
		if (!this.input.keyCode("ArrowUp") && this.jumping) {
			if (this.velocityY < -this.jumpForce/2) {
				this.velocityY = -this.jumpForce/2;
			}
		}
	}

	draw() {
		this.display.fillRect(this.x, this.y, this.width, this.height, this.color);
	}

	collision(sprite) {  // jshint ignore:line

	}
}

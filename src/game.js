class TestSprite2 extends Sprite{
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
		this.speed = 1;
		this.color = "white";
		this.rotation = 0;
	}
	move(){
		if(!this.colliding){
			this.color = "white";
		}

		if(this.input.keyCode("ArrowDown")) this.y += this.speed;
		if(this.input.keyCode("ArrowUp")) this.y -= this.speed;
		if(this.input.keyCode("ArrowRight")) {
			this.x += this.speed;

		}
		if(this.input.keyCode("ArrowLeft")) this.x -= this.speed;

	}
	draw(){
		this.colliders[0].debugDraw(this.color);
		this.display.rect(this.x+2, this.y+2, this.width-4, this.height-4, 'green');
	}
	collision(sprite){
		this.color = "red";

	}
}
class TestSprite1 extends Sprite{
	constructor(params){
		super(params);
		this.colliders.push(new CircleCollider({
			parent: this,
			x: this.width/2,
			y: this.height/2,
			width: this.width,
			height: this.height
		}));
		this.speed = 1;
		this.color = "white";
	}
	move(){
		if(!this.colliding){
			this.color = "white";
		}
	}
	draw(){
		for(let collider of this.colliders){
			collider.debugDraw(this.color);
		}

		this.display.rect(this.x+2, this.y+2, this.width-4, this.height-4, 'blue');
	}
	collision(sprite){
		this.color = "red";
	}
}


let engine = new Engine('canvas');
engine.add(new TileMap({
	parent: engine,
	x: 0,
	y: 0
}));
engine.add(new TestSprite1({
	x: engine.display.width/2-150,
	y: engine.display.height/2-150,
	width: 300,
	height: 300
}));
engine.add(new TestSprite2({
	x: 100,
	y: 140,
	width: 25,
	height: 25
}));













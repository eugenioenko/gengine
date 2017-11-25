class TestSprite2 extends Sprite{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
		this.colliders.push(new RectCollider(this, 0, 0, 50, 50));
		this.speed = 1;
		this.color = "white";
	}
	move(){
		if(!this.colliding){
			this.color = "white";
		}
		if(this.input.keyCode("ArrowDown")) this.y += this.speed;
		if(this.input.keyCode("ArrowUp")) this.y -= this.speed;
		if(this.input.keyCode("ArrowRight")) this.x += this.speed;
		if(this.input.keyCode("ArrowLeft")) this.x -= this.speed;
	}
	draw(){
		this.colliders[0].debugDraw(this.color);
	}
	collision(sprite){
		this.color = "red";
	}
}
class TestSprite1 extends Sprite{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
		//this.colliders.push(new RectCollider(this, 0, 0, 50, 50));
		this.colliders.push(new CircleCollider(this, 25, 25, 50, 50));
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
	}
	collision(sprite){
		this.color = "red";
	}
}


let engine = new Engine('canvas');
engine.add(new TestSprite1(engine, 200, 200, 50, 50));
engine.add(new TestSprite2(engine, 100, 140, 50, 50));
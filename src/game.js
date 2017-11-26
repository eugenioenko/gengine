class TestSprite2 extends Sprite{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
		//this.colliders.push(new RectCollider(this, 0, 0, 50, 50));
		this.colliders.push(new CircleCollider(this, this.width/2, this.height/2, this.width, this.height));
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
		if(this.input.keyCode("ArrowRight")) this.x += this.speed;
		if(this.input.keyCode("ArrowLeft")) this.x -= this.speed;

	}
	draw(){
		this.colliders[0].debugDraw(this.color);
		//this.display.rect(this.x+2, this.y+2, this.width-4, this.height-4, 'blue');
	}
	collision(sprite){
		this.color = "red";

	}
}
class TestSprite1 extends Sprite{
	constructor(parent, x, y, width, height){
		super(parent, x, y, width, height);
		this.colliders.push(new CircleCollider(this, this.width/2, this.height/2, this.width, this.height));
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
		//this.display.rect(this.x+2, this.y+2, this.width-4, this.height-4, 'blue');
	}
	collision(sprite){
		this.color = "red";
	}
}


let engine = new Engine('canvas');
engine.add(new TestSprite1(engine, engine.display.width/2-150, engine.display.height/2-150, 300, 300));
engine.add(new TestSprite2(engine, 100, 140, 25, 25));
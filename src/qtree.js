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
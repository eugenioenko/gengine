/**
 * Example of a game, this module is used for testing the engine.
 */

var e;

function Preload(engine){
	e = engine;
	engine.resources.add({ url: 'resources/images/mario.png', type: 'img', name: "marioworld" });

}

function Game(engine){
	var map = [
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,24,25,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6,24,25,26, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1,
		3, 0, 0, 0, 0, 0, 4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,24,25,26,24,25,26, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2,
		3, 0, 0, 0, 0, 0,24,25,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,24,25,26,24,25,26, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2,
		3, 0, 0, 0, 0, 0,24,25,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,24,25,26,24,25,26, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2,
		3, 0, 0, 0, 0, 0,24,25,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
		3, 0, 0, 0, 0, 0,24,25,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1,
		3, 0, 0, 0, 0, 0,24,25,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		3, 0, 0, 0, 0, 0,24,25,26, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		3, 0, 0,41,42,43,24,25,26, 0, 0, 0, 0, 1, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2,
		3, 0, 0,61,62,63,24,25,26, 0, 0, 0, 1, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		3, 0, 0,61,62,63,24,25,26, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 2, 3,61,62,63,24,25,26, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2,
		1,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,
		1,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,
	    3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,
		2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1

	];
	let sheet = new SpriteSheet({
		image: engine.resources.get("marioworld"),
		width: 16,
		height: 16,
		offsetX: 2,
		offsetY: 1,
		padding: 1
	});
	let tiles = [
		{ color: '#eee', solid: false, angle: 0, friction: 0.0 },
		{ color: '#333', solid: true, angle: 45, friction: 0.4 },
		{ color: '#333', solid: true, angle: 135, friction: 0.4 },
		{ color: '#333', solid: true, angle: 0, friction: 0.4 },
		{ color: 'red', solid: true, angle: 0, friction: 0.8 },
		{ color: 'cyan', solid: true, angle: 0, friction: -0.1 },
		{ color: 'blue', solid: true, angle: 0, friction: 3.8 }
	];
	tiles[41] = tiles[2];
	tiles[42] = tiles[2];
	tiles[43] = tiles[2];


	let tilemap = new TileMap({
		x: 0,
		y: 0,
		width: 44,
		height: 28,
		twidth: 32,
		theight: 32,
		sheet: sheet,
		tiles: tiles
	});
	tilemap.load(map);
	engine.tilemap = tilemap;
	let player = new Player({
		x: 800,
		y: 460,
		width: 24,
		height: 28
	});

	engine.addComponent("PlatformController", PlatformController, {
		"tilemap": tilemap
	});
	engine.addSprite(tilemap);
	engine.addSprite(player);

	/*
	engine.addSprite(new Enemy({
		x: 1440,
		y: 520,
		width: 22,
		height: 22
	}));
	engine.addSprite(new Enemy({
		x: 440,
		y: 220,
		width: 22,
		height: 22
	}));
	engine.addSprite(new Enemy({
		x: 1940,
		y: 120,
		width: 22,
		height: 22
	}));
	engine.addSprite(new Enemy({
		x: 1240,
		y: 620,
		width: 22,
		height: 22
	}));*/

}

Engine.ready({
	canvas: 'canvas',
	width: 600,
	height: 400,
	preload: Preload,
	create: Game
});

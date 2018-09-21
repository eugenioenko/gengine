/**
 * Example of a game, this module is used for testing the engine.
 */

var e;

function Preloader(engine) {
	e = engine;
	engine.resources.add({ url: 'resources/images/mario.png', type: 'img', name: "marioworld" });
}

function Game(engine) {
	var map = [
  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  9,
  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 24, 25, 26, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 24, 25, 26, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  3,  0,  0,  0,  0,  0, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 24, 25, 26, 24, 25, 26,  0,  0,  0,  0,  0, 41, 42, 42, 42, 42, 42, 43,  0,  0,
  3,  0,  0,  0,  0,  0, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 41, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 43,  0, 61, 62, 62, 62, 62, 62, 63,  0,  0,
  3,  0,  0,  0,  0,  0, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 61, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 63,  0, 61, 62, 62, 62, 62, 62, 63,  0,  0,
  3,  0,  0,  0,  0,  0, 24, 25, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 61, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62,  1,  2,  2,  2,  2,  3, 62, 62, 62, 62, 63,  0,  0,
  3,  0,  0,  0,  0,  0, 24, 25, 26,  0,  0,  0,  0,  0,  1,  2,  3,  0,  0,  1,  2,  2,  2,  2,  2,  2,  2,  3, 62, 62, 62, 62, 62, 63,  0, 61, 62, 62, 62, 62, 62, 63,  0,  0,
  3,  0,  0, 41, 42, 43, 24, 25, 26,  0,  0,  0,  0,  1,  2,  2,  3,  0,  0,  0, 61, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 63,  0, 61, 62, 62,  1,  2,  2,  2,  2,  2,
  3,  0,  0, 61, 62, 63, 24, 25, 26,  0,  0,  0,  1,  2,  2,  2,  3,  0,  0,  0, 61, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 63,  0, 61, 62, 62, 62, 62, 62, 63,  0,  0,
  3,  0,  0, 61, 62, 63, 24, 25, 26,  0,  0,  1,  2,  2,  2,  2,  2,  3,  0,  0, 61, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 63,  0, 61, 62, 62, 62, 62, 62, 63,  0,  0,
  1,  2,  3, 61, 62, 63, 24, 25, 26,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  3,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  2,
  1, 24, 25, 61, 62, 63, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  1, 24, 25, 61, 62, 63, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  3,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  3, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,

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
		new Tile({ solid: { top: false, bottom: false, right: false, left: false}, angle: 0 }),
		new Tile({ solid: { top: true, bottom: true, right: true, left: true }, angle: 45 }),
		new Tile({ solid: { top: true, bottom: true, right: true, left: true }, angle: 45 }),
		new Tile({ solid: { top: true, bottom: true, right: true, left: true }, angle: 45 }),
		new Tile({ solid: { top: true, bottom: false, right: false, left: false }, angle: 45 }),
		new Tile({ solid: { top: true, bottom: false, right: false, left: false }, angle: 45 }),
		new Tile({ solid: { top: true, bottom: false, right: false, left: false }, angle: 45 }),
		new Tile({ solid: { top: true, bottom: true, right: false, left: false }, angle: 45 }), //7
		new Tile({ solid: { top: true, bottom: true, right: true, left: true }, angle: 45 }), //8
	];
	for (let i = 9; i < 300; ++i) {
		tiles[i] = tiles[0]
	}
	tiles[41] = tiles[4];
	tiles[42] = tiles[4];
	tiles[43] = tiles[4];

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
	engine.stage.scenes[0].addSprite(tilemap);
	engine.stage.scenes[0].addSprite(player);

}

Engine.create({
	canvas: 'canvas',
	width: 600,
	height: 400,
	preload: Preloader,
	game: Game
});

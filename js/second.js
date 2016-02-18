// Game
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });
// Colors
var red = "#f00", black = "#fff", blue = "#00f", green = "#0f0", white = "#000";
var colors = [red, blue, green, white];
// Vars
var board, block;

// crate function
function create() {
	game.stage.backgroundColor = '#505050';
    board = new Custom.Board(game, 100, 40, 5, 10);	
    // block = factory.pushBlock("Test");
    for(var k = 0; k < 40; k ++){
    	board.pushBlock(" ", colors[board.getRandom(4)-1]);
    }
    board.pullDown();
    // console.log(factory.canMoveRight(pushBlock4));
    //game.add.existing(mario);
}

// update function
function update(){
	
}
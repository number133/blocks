// Game
var game = new Phaser.Game(900, 450, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, 
	update: update, render: render });
// Colors
var red = "#f00", blue = "#00f", green = "#0f0", white = "#fff", yellow = "#ff0";
var colors = [red, blue, green, white, yellow, "#ffa500", "#f6546a"];
// Vars
var board;
function preload() {
    // game.load.audio('loser', 'sound/loser.mp3');
}

var words = [
	{
		w1: "arduous",
		w2: "трудный"
	},
	{
		w1: "austere",
		w2: "суровый"
	},
	{
		w1: "disabuse",
		w2: "разуверить"
	},
	{
		w1: "effrontery",
		w2: "наглость"
	},
	{
		w1: "ennui",
		w2: "тоска"
	},
	{
		w1: "fulminate",
		w2: "громить"
	},
	{
		w1: "irascible",
		w2: "вспыльчивый"
	},
	{
		w1: "mundane",
		w2: "обыденный"
	},
	{
		w1: "nebulous",
		w2: "смутный"
	},
	{
		w1: "perfidy",
		w2: "коварство"
	},
	{
		w1: "prattle",
		w2: "болтовня"
	}
];

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

// crate function
function create() {
	game.stage.backgroundColor = '#505050';
	
    board = new Custom.Board(game, 10, 10, 120, 40, 5, 5);
    game.time.events.loop(Phaser.Timer.SECOND, feedBlocks, this);

    var controls = new Custom.Controls(game, 500, 10, 120, 40);
    controls.addBlock(words[0].w1, green, null, 0);
    controls.addBlock(words[0].w1, green, null, 1);
    controls.addBlock(words[0].w1, green, null, 2);
}

var needFeed = true;
var block;
var feedColumn = 0;
function feedBlocks() {
	if(needFeed){		
		word = words.shift();
		if(word){
	    	block = board.addBlock(word.w1, colors[board.getRandom(4)-1], null, feedColumn, 0);
	    	needFeed = false;
	    	feedColumn++;
	    	if(feedColumn >= board.maxX) feedColumn = 0;
    	}
	} else {
		if(board.canMoveDown(block)){
			board.moveDown(block);
		} else {
			needFeed = true;
		}
	}
}

// update function
function update(){
	
}

function render() {

}
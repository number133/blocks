// Game
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, 
	update: update, render: render });
// Colors
var red = "#f00", blue = "#00f", green = "#0f0", white = "#fff", yellow = "#ff0";
var colors = [red, blue, green, white, yellow, "#ffa500", "#f6546a"];
// Vars
var board, block;
function preload() {
    game.load.audio('loser', 'sound/loser.mp3');
}

var words = [
	{
		en: "boy",
		kz: "bala"
	},
	{
		en: "girl",
		kz: "kyz"
	},
	{
		en: "moon",
		kz: "ai"
	},
	{
		en: "sun",
		kz: "kun"
	},
	{
		en: "blood",
		kz: "kan"
	},
	{
		en: "soul",
		kz: "zhan"
	},
	{
		en: "men",
		kz: "adam"
	},
	{
		en: "hand",
		kz: "kol"
	},
	{
		en: "head",
		kz: "bas"
	},
	{
		en: "dog",
		kz: "it"
	},
	{
		en: "cat",
		kz: "mysyk"
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
	
    board = new Custom.Board(game, 120, 40, 5, 10);	
    // block = factory.pushBlock("Test");
    // for(var k = 0; k < 40; k ++){
    // 	board.pushBlock("Test", colors[board.getRandom(4)-1]);
    // }
	for(var i = 0; i < words.length - 1; i++){
		var id = guid();
		board.pushBlock(words[i].en, colors[board.getRandom(colors.length)-1], {id: id});
    	board.pushBlock(words[i].kz, colors[board.getRandom(colors.length)-1], {id: id});
	}
	board.explode();
    // console.log(factory.canMoveRight(pushBlock4));
    //game.add.existing(mario);
}

// update function
function update(){
	
}

function render() {

}
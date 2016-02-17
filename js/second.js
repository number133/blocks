var Custom = Custom || {};

/* TextBlock */
Custom.TextBlock = function (game, indexX, indexY, width, height, text, style) {
    'use strict';
    Phaser.Text.call(this, game, width * indexX, height * indexY, text, style);
    this.width = width;
    this.height = height;
    this.indexX = indexX;
    this.indexY = indexY;
};
Custom.TextBlock.prototype = Object.create(Phaser.Text.prototype);
Custom.TextBlock.constructor = Custom.TextBlock;
Custom.TextBlock.prototype.init = function () {
    'use strict';
};

/* Board */
Custom.Board = function (game, blockWidth, blockHeight, maxX, maxY) {
    'use strict';    
    this.blocks = [];
    for (var x = 0; x < maxX; x++)
    {
        var a = [];

        for (var y = 0; y < maxY; y++)
        {
            a.push(null);
        }

        this.blocks.push(a);
    }

    this.game = game;
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.maxY = maxY;
    this.maxX = maxX;
};
Custom.Board.prototype.getBlock = function (text, indexX, indexY) {
	var style = { font: "14px Courier", fill: "#fff", backgroundColor: blue};
    var textblock = new Custom.TextBlock(
    	this.game, 
    	indexX, 
    	indexY,
    	this.blockWidth, 
    	this.blockHeight, 
    	text, 
    	style
    );
    this.blocks[indexX][indexY] = textblock;
    return textblock;
}

Custom.Board.prototype.addBlock = function (text, indexX, indexY) {
	var block = this.getBlock(text, indexX, indexY);
	this.game.add.existing(block);
	return block;
}

Custom.Board.prototype.moveRight = function (block) {
	if(this.canMoveRight(block)) {
		if(this.isFree(block.indexX + 1, block.indexY)){
			this.blocks[block.indexX][block.indexY] = null;
			this.blocks[block.indexX + 1][block.indexY] = block;
			block.indexX += 1;
			block.x += block.width;
		}
	} else {
		if(this.isFree(0, block.indexY)) {
			this.blocks[block.indexX][block.indexY] = null;
			this.blocks[0][block.indexY] = block;
			block.indexX = 0;
			block.x = 0;
		}
	}
}

Custom.Board.prototype.canMoveRight = function (block) {
	return this.maxX - 1 > block.indexX;
}

Custom.Board.prototype.isFree = function (x, y) {
	return this.blocks[x][y] === null;
}

// Game
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });
// Colors
var red = "#f00", black = "#fff", blue = "#00f", green = "#0f0", white = "#000";

// Vars
var factory, block;

// crate function
function create() {
	var style = { font: "20px Courier", fill: "#fff", tabs: 80 , backgroundColor: blue};
    // coords = game.add.text(0, 0, "Some text", style);
    // coords.width = 50;
    // mario = new Custom.TextBlock(game, 0, 0, "Test", style);
    factory = new Custom.Board(game, 100, 40, 4, 10);
    block = factory.addBlock("Test", 0, 0);
    var block2 = factory.addBlock("Test", 0, 1);
    factory.moveRight(block2);
    var block3 = factory.addBlock("Test", 1, 2);
    factory.moveRight(block3);
    var block4 = factory.addBlock("Test", 2, 3);
    factory.moveRight(block4);
    console.log(factory.canMoveRight(block4));
    //game.add.existing(mario);
}

// update function
function update(){	
	// if(factory.canMoveRight(block)){
		factory.moveRight(block);	
	// }
}
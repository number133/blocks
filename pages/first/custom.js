Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

Array.prototype.shuffle = function() {
  var j, x, i;
  for (i = this.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = this[i-1];
    this[i-1] = this[j];
    this[j] = x;
  }
}

var Custom = Custom || {};

/* TextBlock */
Custom.TextBlock = function (game, indexX, indexY, width, height, text, color) {
    'use strict';
    var style = { font: "14px Arial", fill: "#000", backgroundColor: color, align: "center"};
    Phaser.Text.call(this, game, width * indexX, height * indexY, text, style);
    this.width = width;
    this.height = height;
    this.indexX = indexX;
    this.indexY = indexY;
};
Custom.TextBlock.prototype = Object.create(Phaser.Text.prototype);
Custom.TextBlock.constructor = Custom.TextBlock;

/* Board */
Custom.Board = function (game, blockWidth, blockHeight, maxX, maxY) {
    'use strict';    
    this.blocks = [];
    this.selectedBlock = null;
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

// util
Custom.Board.prototype.getRandom = function (number) {
    return Math.floor((Math.random() * number) + 1);
};

Custom.Board.prototype.isFree = function (x, y) {
    return this.blocks[x][y] === null;
};

Custom.Board.prototype.selectBlock = function (block) {
    if(this.selectedBlock != null) {
        this.deselectBlock(this.selectedBlock);
    }
    this.selectedBlock = block;
    block.tint = "0x999999";
};

Custom.Board.prototype.deselectBlock = function (block) {
    this.selectedBlock = null;
    block.tint = "0xFFFFFF";
};

Custom.Board.prototype.isSelected = function (block) {
    return this.selectedBlock === block;
};

// create
Custom.Board.prototype.getBlock = function (text, color, data, indexX, indexY) {	
    var textblock = new Custom.TextBlock(
    	this.game, 
    	indexX, 
    	indexY,
    	this.blockWidth, 
    	this.blockHeight, 
    	text, 
    	color
    );
    this.blocks[indexX][indexY] = textblock;
    textblock.data = data;
    textblock.inputEnabled = true;
    textblock.events.onInputDown.add(function(block){        
        if(this.isSelected(block)){
            this.deselectBlock(block);
        } else {
            if(this.getNeibs(block).contains(this.selectedBlock)){
                this.swap(block, this.selectedBlock);
                this.deselectBlock(this.selectedBlock);
                this.explode();
                if(!this.hasSameBlocks()){
                    var style = { font: "40px Arial", fill: "#fff", align: "center" };
                    this.game.add.text(0, 0, "Game over!", style);
                }
            } else {
                this.selectBlock(block);
            }
        }
    }, this);
    return textblock;
}

Custom.Board.prototype.addBlock = function (text, color, data, indexX, indexY) {
	var block = this.getBlock(text, color, data, indexX, indexY);
	this.game.add.existing(block);
	return block;
}

Custom.Board.prototype.pushExistingBlock = function (block) {
    for (var y = 0; y < this.maxY; y++) {
        for (var x = 0; x < this.maxX; x++) {
            if(this.blocks[x][y] === null){
                block.x = x * this.blockWidth;
                block.y = y * this.blockHeight;    
                block.indexX = x;
                block.indexY = y;
                this.blocks[x][y] = block;
                return block;            
            }
        }
    }
    return block;
}

Custom.Board.prototype.pushBlock = function (text, color, data) {
    for (var y = 0; y < this.maxY; y++) {
        for (var x = 0; x < this.maxX; x++) {
            if(this.blocks[x][y] === null){
                return this.addBlock(text, color, data, x, y);            
            }
        }
    }
}

Custom.Board.prototype.getBlocks = function () {
    var list = [];
    for (var y = 0; y < this.maxY; y++) {
        for (var x = 0; x < this.maxX; x++) {
            if(this.blocks[x][y] != null){
                list.push(this.blocks[x][y]);            
            }
        }
    }
    return list;
}

Custom.Board.prototype.clearBlocks = function () {
    for (var y = 0; y < this.maxY; y++) {
        for (var x = 0; x < this.maxX; x++) {
            this.blocks[x][y] = null;
        }
    }
}

Custom.Board.prototype.shuffleBlocks = function () {
    while(this.hasReadyGroups()) {
        var blocks = this.getBlocks();
        blocks.shuffle();
        this.clearBlocks();
        for(var i=0; i<blocks.length; i++){
            this.pushExistingBlock(blocks[i]);
        }
        this.squeeze();
    }
}

// move
Custom.Board.prototype.canMoveRight = function (block) {
    return block.indexX < this.maxX - 1 && this.isFree(block.indexX + 1, block.indexY);
}
Custom.Board.prototype.moveRight = function (block) {
	if(this.canMoveRight(block)) {
		this.blocks[block.indexX][block.indexY] = null;
		this.blocks[block.indexX + 1][block.indexY] = block;
		block.indexX += 1;
		block.x += block.width;
	}
}
Custom.Board.prototype.canMoveLeft = function (block) {
    return block.indexX > 0 && this.isFree(block.indexX - 1, block.indexY);
}
Custom.Board.prototype.moveLeft = function (block) {
    if(this.canMoveLeft(block)) {
        this.blocks[block.indexX][block.indexY] = null;
        this.blocks[block.indexX - 1][block.indexY] = block;
        block.indexX -= 1;
        block.x -= block.width;
    }
}
Custom.Board.prototype.canMoveDown = function (block) {
    return block.indexY < this.maxY - 1 && this.isFree(block.indexX, block.indexY + 1);
}
Custom.Board.prototype.moveDown = function (block) {
    if(this.canMoveDown(block)) {
        this.blocks[block.indexX][block.indexY] = null;
        this.blocks[block.indexX][block.indexY + 1] = block;
        block.indexY += 1;
        block.y += block.height;
    }
}

Custom.Board.prototype.swap = function (b1, b2) {
    var bufX, bufY, bufIndexX, bufIndexY;
    bufX = b1.x;
    bufY = b1.y;
    bufIndexX = b1.indexX;
    bufIndexY = b1.indexY;
    
    b1.x = b2.x;
    b1.y = b2.y;
    b1.indexX = b2.indexX;
    b1.indexY = b2.indexY;
    this.blocks[b2.indexX][b2.indexY] = b1;

    b2.x = bufX;
    b2.y = bufY;
    b2.indexX = bufIndexX;
    b2.indexY = bufIndexY;
    this.blocks[bufIndexX][bufIndexY] = b2;
}

// squeeze
Custom.Board.prototype.squeeze = function () {
    this.pullDown();
    this.pullLeft();
}
Custom.Board.prototype.pullDown = function () {
    for(var x = 0; x < this.maxX; x++){
        this.pullDownColumn(x);
    }
}
Custom.Board.prototype.pullDownColumn = function (x) {
    // do n times 
    for(var n = this.maxY - 1; n >= 0; n--){
        for(var y = this.maxY - 1; y >= 0; y--){
            if(this.blocks[x][y] != null) {
                this.moveDown(this.blocks[x][y]);
            } 
        }
    }
}
Custom.Board.prototype.pullLeft = function () {
    var empties = this.getEmpties();
    while(empties.contains(true)){
        for(var i=0; i < empties.length; i++){
            if(empties[i] === true) {
                this.moveColumnLeft(i+1);
            }
        }
        empties = this.getEmpties();
    }
}
Custom.Board.prototype.getEmpties = function () {
    var empties = [];
    for(var x = 0; x < this.maxX; x++){
        var isEmpty = true;
        for(var y = 0; y < this.maxY; y++){
            if(this.blocks[x][y] != null){
                isEmpty = false;
            }
        }
        empties.push(isEmpty);
    }
    while(empties[empties.length - 1] === true){
        empties.splice(empties.length - 1, 1);
    }    
    return empties;
}
Custom.Board.prototype.moveColumnLeft = function (x) {
    // do n times 
        for(var y = 0; y < this.maxY; y++){
            if(this.blocks[x][y] != null) {
                this.moveLeft(this.blocks[x][y]);
            }
        }
}

Custom.Board.prototype.getNeibs = function (block) {
    var x = block.indexX, 
        y = block.indexY, 
        neibs = [];
    // right
    if(x + 1 < this.maxX && this.blocks[x+1][y] != null){
        neibs.push(this.blocks[x+1][y]);
    }
    // left
    if(x - 1 >= 0 && this.blocks[x-1][y] != null){
        neibs.push(this.blocks[x-1][y]);
    }
    // up
    if(y - 1 >= 0 && this.blocks[x][y-1] != null){
        neibs.push(this.blocks[x][y-1]);
    }
    // down
    if(y + 1 < this.maxY && this.blocks[x][y+1] != null){
        neibs.push(this.blocks[x][y+1]);
    }
    return neibs;
}

// explosion
Custom.Board.prototype.explode = function () {
    var toDelete = [];
    for(var y = 0; y < this.maxY; y++) {
        for (var x = 0; x < this.maxX; x++) {
            if(this.blocks[x][y] != null){
                this.collectBlocks(this.blocks[x][y], toDelete);
            }
        }
    }
    toDelete = toDelete.unique();
    this.destroyBlocks(toDelete);
    if(toDelete.length > 0){
        this.squeeze();
        this.explode();
    }
}

Custom.Board.prototype.explodeFrom = function (block) {
    var toDelete = [];
    this.collectBlocks(block, toDelete);
    
    toDelete = toDelete.unique();
    this.destroyBlocks(toDelete);
    if(toDelete.length > 0){
        this.squeeze();
    }
}

Custom.Board.prototype.hasReadyGroups = function () {
    var toDelete = [];
    for(var y = 0; y < this.maxY; y++) {
        for (var x = 0; x < this.maxX; x++) {
            if(this.blocks[x][y] != null){
                this.collectBlocks(this.blocks[x][y], toDelete);
            }
        }
    }
    toDelete = toDelete.unique();
    return toDelete.length > 0;
}

Custom.Board.prototype.hasSameBlocks = function () {
    var unique = [];
    for(var y = 0; y < this.maxY; y++) {
        for (var x = 0; x < this.maxX; x++) {
            if(this.blocks[x][y] != null){
                if(unique.contains(this.blocks[x][y].data.id)){
                    return true;
                } else {
                    unique.push(this.blocks[x][y].data.id);
                }
            }
        }
    }
    return false;
}

Custom.Board.prototype.collectBlocks = function (block, toDelete) {
    var neibs = this.getNeibs(block);
    for(var i=0; i < neibs.length; i++){
        if(block.data.id === neibs[i].data.id){
            toDelete.push(block);
            toDelete.push(neibs[i]);
            block.collected = true;
            if(!neibs[i].collected){
                this.collectBlocks(neibs[i], toDelete);
            }
        }
    }
}

Custom.Board.prototype.destroyBlocks = function (toDelete) {
    for(var i=0; i < toDelete.length; i++){
        this.blocks[toDelete[i].indexX][toDelete[i].indexY] = null;
        toDelete[i].destroy();
    }
}
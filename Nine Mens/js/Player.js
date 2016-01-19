// Javascript Document
// Player Class

var Player = function() {
	this.color = new Color(Player.colors[Player.colorSelector++%2]);
	this.AI = false;
	this.pieces = [];
	this.nonActivePieces = [];
	this.activePieces = [];
	for(var i = 0; i < 9; i++) {
		this.pieces[i] = new Piece(this);
		this.nonActivePieces.push(this.pieces[i]);
	}
};

Player.colorSelector = 0;
Player.colors = ["#512C61", "#5F7EAB"];

Player.prototype.setAI = function(boolAI) {
	this.AI = boolAI;
};

Player.prototype.getAssociatedLines = function() {
	var myLines = [];
	for(var i = 0; i < this.activePieces.length; i++) {
		var currPiece = this.activePieces[i];
		var currPoint = currPiece.point;
		for(var j = 0; j < currPoint.myLines.length; j++) {
			if(myLines.indexOf(currPoint.myLines[j]) == -1) {
				myLines.push(currPoint.myLines[j]);
			}
		}
	}
	
	return myLines;
};

Player.prototype.takeAction = function() {
	if(this.AI) {
		AI.AIexecute();
	}
};

Player.prototype.addActivePiece = function( piece ) {
	var i = this.nonActivePieces.indexOf(piece);
	if(i != -1) {
		this.nonActivePieces.splice(i, 1);
	}
	
	this.activePieces.push( piece );
};

Player.prototype.allPiecesInMills = function () {
	for ( var i = 0; i < this.activePieces.length; i++ ) {
		var piece = this.activePieces[i];

		if ( !piece.isPartOfMill() ) {
			return false;
		}
	}

	return true;
};

Player.prototype.isFlying = function () {
	return this.activePieces.length < 4;
};

Player.prototype.hasLost = function() {
	return this.activePieces.length < 3;
};

Player.prototype.removeActivePiece = function( piece ) {
	var i = this.activePieces.indexOf(piece);
	if(i != -1) {
		this.activePieces.splice(i, 1);
	}
};

Player.prototype.killPiece = function( pieceToKill ) {
	this.activePieces.splice(this.activePieces.indexOf(pieceToKill), 1);
	pieceToKill.setDead(true);
};

Player.prototype.getActivePieces = function() {
	return this.activePieces;
};

Player.prototype.getColor = function() {
	return this.color.getHex();
};

Player.prototype.setColor = function(newColor) {
	this.color = newColor;
};
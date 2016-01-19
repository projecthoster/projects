// Javascript Document
// Point Class

var Point = function() {
	this.domRef = null; // Set by GameView
	this.piece = null;
	this.myLines = [];
	this.myAdjacents = [];
};

Point.prototype.setLines = function( line0, line1 ) {
	this.myLines.push(line0);
	this.myLines.push(line1);
};

Point.prototype.setAdjacents = function( point0, point1, point2, point3 ) {
	this.myAdjacents.push(point0);
	this.myAdjacents.push(point1);
	if(point2) {
		this.myAdjacents.push(point2);
	}
	if(point3) {
		this.myAdjacents.push(point3);
	}
};

Point.prototype.findAdjacentPlayerPiecesNotInLine = function(line, player) {
	var pieces = [];
	var adjacents = this.findAdjacentsNotInLine(line);
	for(var i = 0; i < adjacents.length; i++) {
		var currPoint = adjacents[i];
		if(currPoint.piece && currPoint.piece.player === player) {
			pieces.push(currPoint.piece);
		}
	}
	return pieces;
};

Point.prototype.findAdjacentsNotInLine = function(line) {
	var adjacents = [];
	for(var i = 0; i < this.myAdjacents.length; i++) {
		if(!line.containsPoint(this.myAdjacents[i])) {
			adjacents.push(this.myAdjacents[i]);
		}
	}
	return adjacents;
};

Point.prototype.findAdjacentPiecesOfPlayer = function(player) {
	var piecesArray = [];
	for(var i = 0; i < this.myAdjacents.length; i++) {
		
	}
};

Point.prototype.isAdjacent = function( pointObj ) {
	return this.myAdjacents.indexOf(pointObj) > -1	;
};

Point.prototype.setPiece = function( piece ) {
	this.piece = piece;
};

Point.prototype.getPiece = function() {
	return this.piece;
};

Point.prototype.setDomRef = function ( newDomRef ) {
	this.domRef = newDomRef;
};

Point.prototype.getDomRef = function () {
	return this.domRef;
};
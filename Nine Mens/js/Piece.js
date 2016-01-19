// Javascript Document
// Piece Class

var Piece = function(player) {
	this.player = player;
	this.point = null;
	this.onBoard = false;
	this.domRef = null; // Set by GameView
	this.dead = false;
};

Piece.prototype.getPlayer = function() {
	return this.player;
};

Piece.prototype.getColor = function() {
	return this.player.getColor();
};

Piece.prototype.setDomRef = function ( newDomRef ) {
	this.domRef = newDomRef;
};

Piece.prototype.getDomRef = function () {
	return this.domRef;
};

Piece.prototype.setPoint = function ( newLocation ) {
	this.point = newLocation;
	this.point.setPiece(this);
	this.getDomRef().attr(
		{
			cx: this.getPoint().getDomRef().attr("cx"),
			cy: this.getPoint().getDomRef().attr("cy")
		}
	);
	this.onBoard = true;
};

Piece.prototype.canBeRemoved = function () {
	return this.player.allPiecesInMills() || !this.isPartOfMill();
};

Piece.prototype.isPartOfMill = function () {
	var lines = this.point.myLines;
	return lines[0].isDone() || lines[1].isDone();
};

Piece.prototype.getPoint = function () {
	return this.point;
};

Piece.prototype.getOnBoard = function() {
	return this.onBoard;
};

Piece.prototype.setHighlighted = function ( highlighted ) {
	var strokeColor = highlighted ? "#ffffff" : "#000000";
	this.getDomRef().attr("stroke", strokeColor);
};

Piece.prototype.getDead = function() {
	return this.dead;
};

Piece.prototype.setDead = function( bool ) {
	this.point.setPiece(null);
	this.point = null;
	this.onBoard = !bool;
	this.dead = bool;
};
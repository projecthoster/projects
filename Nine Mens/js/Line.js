
var Line = function() {
	this.points = [];
};

Line.prototype.setPoints = function( point0, point1, point2 ) {
	this.points[0] = point0;
	this.points[1] = point1;
	this.points[2] = point2;
};

Line.prototype.isAlmostMill = function ( player ) {
	var playerPieceCount = 0;

	for ( var i = 0; i < 3; i++ ) {
		var piece = this.points[i].getPiece();
		if ( piece && piece.player === player ) {
			playerPieceCount++;
		}
	}

	return playerPieceCount === 2;
};

Line.prototype.isDone = function() {
	var playerColor = null;
	for(var i = 0; i < 3; i++) {
		if(this.points[i].getPiece()) {
			var currColor = this.points[i].getPiece().getColor();
			if(playerColor) {
				if(currColor != playerColor) {
					return false;
				}
			} else {
				playerColor = currColor;
			}
		} else {
			return false;
		}
	}
	return true;
};

Line.prototype.containsPlayerPieces = function(playerToCheck) {
	for(var i = 0; i < 3; i++) {
		if(this.points[i].piece && this.points[i].piece.player === playerToCheck) {
			return true;
		}
	}
	return false;
};

Line.prototype.isFull = function() {
	for(var i = 0; i < 3; i++) {
		if( !this.points[i].getPiece() ) {
			return false;
		}
	}
	return true;
};

Line.prototype.getEmptyPoints = function() {
	var emptyPoints = [];
	for(var i = 0; i < this.points.length; i++) {
		if(!this.points[i].piece) {
			emptyPoints.push(this.points[i]);
		}
	}
	
	return emptyPoints;
};

Line.prototype.containsPoint = function(point) {
	return this.points.indexOf(point) > -1;
};

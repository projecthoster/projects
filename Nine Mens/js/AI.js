// AI Class

var AI = function(gameObj, viewObj) {
	AI.game = gameObj;
	AI.gView = viewObj;
	AI.self = AI.game.player2;
	AI.enemy = AI.game.player1;
	AI.nextPiece = null;
	AI.nextPoint = null;
};

AI.setBeforeMoveCallBack = function( callback ) {
	this.beforeMoveCallback = callback;
};

AI.callbackBeforeMove = function () {
	if ( this.beforeMoveCallback ) {
		this.beforeMoveCallback();
	}
};

AI.AIexecute = function() {
	console.log("now executing AI...");
	AI.callbackBeforeMove();

	if ( AI.gView.removingPiece ) {
		AI.clickOnObject( AI.findEnemyPiece() );
	} else {
		if ( AI.game.phase === Game.PHASE_1 ) { // PHASE 1

			// try to find a line that AI is a part of.
			var associatedLines = AI.findAssociatedLines();

			// check each line
			var nextMoveLines = AI.findNonEnemyOccupiedLinesFromSet( associatedLines );

			var nextMovePoint;

			if ( nextMoveLines.length > 0 ) {
				var almostMills = AI.findAlmostMillsFromSet( nextMoveLines );
				if ( almostMills.length > 0 ) {
					nextMovePoint = almostMills[0].getEmptyPoints()[0];
				} else {
					nextMovePoint = nextMoveLines[0].getEmptyPoints()[0];
				}
			} else {
				var nextMoveLine = AI.findNonEnemyOccupiedLine();
				if(!nextMoveLine) {
					// now using associatedLines
					for(var i = 0; i < associatedLines.length; i++) {
						nextMovePoint = AI.getFirstEmptyPointInLine( associatedLines[i] );
						if(nextMovePoint) {
							break;
						}
					}
				} else {
					nextMovePoint = AI.getFirstEmptyPointInLine( nextMoveLine );
				}
			}

			AI.clickOnObject( nextMovePoint );
		} else { // PHASE 2
			
			// find lines AI is a part of
			var AIlines = AI.self.getAssociatedLines();
			
			// find any empty points in line
			// if so try to move nearby piece into point
			if(!AI.findMoveThatMakesMillProgress(AIlines)) {
				if ( AI.self.activePieces.length === 3 ) {
					AI.findAnyMove(); // find move when stuck and flying
				} else {
					AI.nextPiece = AI.findFirstPieceWithEmptyNeighbor();
					AI.nextPoint = AI.findFirstEmptyNeighborOfPiece(AI.nextPiece);
				}
			}
			
			// time to move an active piece around.
			AI.clickOnObject( AI.nextPiece );
			AI.clickOnObject( AI.nextPoint );
		}
	}
};

AI.findAnyMove = function() {
	AI.nextPiece = AI.self.activePieces[0];
	var line = AI.findNonEnemyOccupiedLine();
	if(line) {
		for(var i = 0; i < line.points.length; i++) {
			var point = line.points[i];
			if(!point.piece) {
				AI.nextPoint = point;
				return;
			}
		}
	}
	
	for(var i = 0; AI.game.board.points.length; i++) {
		var point = AI.game.board.points[i];
		if(!point.piece) {
			AI.nextPoint = point;
			return;
		}
	}
};

AI.findPlayerPiecesNotInLine = function ( line ) {
	for ( var i = 0; i < AI.self.activePieces.length; i++ ) {
		var piece = AI.self.activePieces[i];
		if ( !line.containsPoint(piece.point) ) {
			return [piece];
		}
	}
};

AI.findMoveThatMakesMillProgress = function(AIlines) {
	for(var i = 0; i < AIlines.length; i++) {
		if(!AIlines[i].isFull()) {
			var currLine = AIlines[i];
			if(!currLine.containsPlayerPieces(AI.enemy)) {
				var emptyPoints = currLine.getEmptyPoints();
				
				if ( emptyPoints.length === 1 ) {
					var pieces;
					if ( AI.self.activePieces.length === 3 ) {
						pieces = AI.findPlayerPiecesNotInLine(currLine);
					} else {
						pieces = emptyPoints[0].findAdjacentPlayerPiecesNotInLine(currLine, AI.self);
					}
					if (pieces.length > 0) {
						AI.nextPiece = pieces[0];
						AI.nextPoint = emptyPoints[0];
						return true;
					}
				}
					
			}
		}
	}
	
	for(var i = 0; i < AIlines.length; i++) {
		if(!AIlines[i].isFull()) {
			var currLine = AIlines[i];
			if(!currLine.containsPlayerPieces(AI.enemy)) {
				var emptyPoints = currLine.getEmptyPoints();
				for (var j = 0; j < emptyPoints.length; j++) {
					var pieces;
					if ( AI.self.activePieces.length === 3 ) {
						pieces = AI.findPlayerPiecesNotInLine(currLine);
					} else {
						pieces = emptyPoints[0].findAdjacentPlayerPiecesNotInLine(currLine, AI.self);
					}
					if (pieces.length > 0) {
						AI.nextPiece = pieces[0];
						AI.nextPoint = emptyPoints[0];
						return true;
					}
				}
			}
		}
	}
	
	return false;
};

AI.findFirstPieceWithEmptyNeighbor = function () {
	var possibles = [];
	
	for ( var i = 0; i < AI.game.player2.activePieces.length; i++ ) {
		var piece = AI.game.player2.activePieces[i];
		if( AI.findFirstEmptyNeighborOfPiece( piece ) ) {
			possibles.push(piece);
		}
	}
	
	if ( possibles.length > 0 ) {
		var rand = Math.floor(Math.random() * 100) % possibles.length;
		return possibles[rand];
	}
};

AI.findFirstEmptyNeighborOfPiece = function ( piece ) {
	var point = piece.point;
	for ( var i = 0; i < point.myAdjacents.length; i++ ) {
		var adjacentPoint = point.myAdjacents[i];
		if ( !adjacentPoint.piece ) {
			return adjacentPoint;
		}
	}
};

AI.findEnemyPiece = function() {
	// Get all almost mills.
	var almostMills = [];
	for ( var j = 0; j < AI.game.board.lines.length; j++ ) {
		var line = AI.game.board.lines[j];
		if ( line.isAlmostMill( AI.enemy ) && almostMills.indexOf(line) === -1 ) {
        	almostMills.push(line);
		}
	}

	for ( var k = 0; k < almostMills.length; k++ ) {
		var almostMillLine = almostMills[k];

		for ( var l = 0; l < almostMillLine.points.length; l++ ) {
			var piece = almostMillLine.points[l].getPiece();
			if ( piece && (piece.player === AI.enemy) && piece.canBeRemoved() ) {
				return piece;
			}
		}
	}

	for ( var i = 0; i < 24; i++ ) {
		var point = AI.game.board.points[i];
		var piece = point.piece;
		if ( piece && (piece.player === AI.enemy) && piece.canBeRemoved() ) {
			return piece;
		}
	}
};

AI.clickOnObject = function ( pieceOrPoint ) {
	if ( pieceOrPoint ) {
		AI.gView.inputReceived( pieceOrPoint.domRef );
	}
};

AI.findNonEnemyOccupiedLine = function() {
	var lineSet = AI.game.board.lines;
	for(var i = 0; i < lineSet.length; i++) {
		var line = lineSet[i];
		if( !line.isFull() && !line.containsPlayerPieces(AI.enemy) ) {
			return lineSet[i];
		}
	}
	
	return null;
};

AI.findNonEnemyOccupiedLinesFromSet = function( lineSet ) {
	var returnLines = [];

	for(var i = 0; i < lineSet.length; i++) {
		var line = lineSet[i];
		if( !line.isFull() && !line.containsPlayerPieces(AI.enemy) ) {
			if ( returnLines.indexOf( line ) === -1 ) {
				returnLines.push( line );
			}
		}
	}

	return returnLines;
};

AI.getFirstEmptyPointInLine = function(line) {
	return line.getEmptyPoints()[0];
};

AI.findAssociatedLines = function() {
	var lines = [];

	for ( var i = 0; i < AI.self.activePieces.length; i++ ) {
		var point = AI.self.activePieces[i].point;
		if ( lines.indexOf(point.myLines[0]) === -1 ) {
			lines.push(point.myLines[0]);
		}
		if ( lines.indexOf(point.myLines[1]) === -1 ) {
			lines.push(point.myLines[1]);
		}
	}

	return lines;
};

AI.findAlmostMillsFromSet = function ( lineSet ) {
	var lines = [];

	for(var i = 0; i < lineSet.length; i++) {
		var line = lineSet[i];
		if ( line.isAlmostMill( AI.self ) ) {
			if ( lines.indexOf( line ) === -1 ) {
				lines.push( line );
			}
		}
	}

	return lines;
};
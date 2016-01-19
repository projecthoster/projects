// Javascript Document
// GameView Class

var GameView = function(gameObj) {
	this.game = gameObj;
	$('#screenStart').hide();
	$('#gameOver').show();
	$('#menuCont').hide();  
	this.removingPiece = false;
	
	// start screen
	
	
	this.generateUIElements();
	
	this.graveyards = {
		1: {
			x: GameView.PIECE_AREA_WIDTH/2,
			y: 638,
			count: 0
		},
		2: {
			x: GameView.BOARD_WIDTH+GameView.PIECE_AREA_WIDTH+GameView.PIECE_AREA_WIDTH/2,
			y: 638,
			count: 0
		}
	};

	this.game.setTurnCallback( this, this.refresh ); // Method to call with each game turn.

	this.refresh();
};

GameView.POINT_COLOR = "#000";
GameView.PIECE_AREA_WIDTH = 140;
GameView.BOARD_WIDTH = 600;
GameView.BOARD_HEIGHT = 700;
GameView.PIECE_RADIUS = 25;
GameView.POINT_RADIUS = 18;
GameView.POINT_STROKE = 3;
GameView.OPACITY = 0.45;

GameView.prototype.generateUIElements = function () {
	var boardDiv = $("#board");
	this.boardPaper = Raphael(
							boardDiv.offset().left - GameView.PIECE_AREA_WIDTH,
							boardDiv.offset().top,
							GameView.BOARD_WIDTH + (GameView.PIECE_AREA_WIDTH * 2),
		 					GameView.BOARD_HEIGHT);
	
	$("#holderThingy").css({
		position: "absolute",
		top: 0,
		left: boardDiv.offset().left - GameView.PIECE_AREA_WIDTH
	});

	this.createCoords();
	this.createLines();
	this.createPoints();
	this.createPieces();
};

GameView.prototype.createPoints  = function() {
	var that = this;
	for (var i = 0; i < this.game.board.points.length; i++) {
		var point = this.game.board.points[i];

		point.coord = this.coords[i];

		point.setDomRef( this.boardPaper.circle(point.coord.x, point.coord.y, GameView.POINT_RADIUS) );
		point.getDomRef().point = point;
		point.getDomRef().attr("fill", GameView.POINT_COLOR);
		point.getDomRef().attr("fill-opacity", GameView.OPACITY);
		point.getDomRef().attr("stroke-width", GameView.POINT_STROKE);
		point.getDomRef().attr("stroke", "#fff");
		point.getDomRef().attr("stroke-opacity", GameView.OPACITY);
		point.getDomRef().mousedown(
			function () {
				that.inputReceived( this );
			}
		);
	}
};

GameView.prototype.inputReceived = function ( clickedElement ) {
	if ( clickedElement.point ) {
		if ( this.removingPiece ) {
			return; // Point clicked while waiting for Piece to be clicked. Disregard;
		}
		
		if ( this.game.phase === Game.PHASE_1 ) {
			var valid = this.game.moveActivePieceToPoint( clickedElement.point );

			if ( valid ) {
				if(this.game.board.checkLines( clickedElement.point )) {  // successful line by active player
					this.removingPiece = true;
					this.game.activePlayer.takeAction();
				} else {
					this.game.nextTurn();
				}
			}
		} else if ( this.game.phase === Game.PHASE_2 ) {
			var valid = this.game.moveActivePieceToPoint( clickedElement.point );
			console.log(this.game.board.points.indexOf(clickedElement.point));
			
			if ( valid ) {
				if(this.game.board.checkLines( clickedElement.point )) {  // successful line by active player
					this.removingPiece = true;
					this.game.activePlayer.takeAction();
				} else {
					this.game.nextTurn();
				}
			}
		} else {
			console.log( 'Unheard-of phase. You broke my game.' );
		}
	} else if ( clickedElement.piece ) {
		if(this.removingPiece) {
			if(clickedElement.piece.getColor() != this.game.activePlayer.getColor() && clickedElement.piece.getOnBoard()) {
				// kill piece
				this.game.getNotActivePlayer().killPiece( clickedElement.piece );
				
				var oneColor = this.game.player1.getColor();
				var twoColor = this.game.player2.getColor();
				
				var pieceOffset = GameView.PIECE_RADIUS - 5;
				
				clickedElement.piece.getColor() === oneColor ? 
					clickedElement.attr({cx:this.graveyards[2].x - this.graveyards[2].count++*pieceOffset,
										 cy:this.graveyards[2].y}) :
					clickedElement.attr({cx:this.graveyards[1].x + this.graveyards[1].count++*pieceOffset,
										 cy:this.graveyards[1].y});
				
				clickedElement.toBack();
				
				this.removingPiece = false;
				
				this.game.nextTurn();
				return;
			}
		}

		if ( this.game.phase === Game.PHASE_1 ) {
			
		} else if ( this.game.phase === Game.PHASE_2 ) {
			// make piece active if match active player
			if(clickedElement.piece.getPlayer() == this.game.activePlayer && !clickedElement.piece.dead) {
				this.game.setActivePiece(clickedElement.piece);
				console.log(clickedElement.piece.player.activePieces.indexOf(clickedElement.piece));
			}
		} else {
			console.log( 'Unheard-of phase. You broke my game.' );
		}
	}
};

GameView.prototype.createLines = function() {
	var that = this;
	var totalPointRadius = GameView.POINT_RADIUS + GameView.POINT_STROKE;
	var drawRect = function(point1, point2) {
		var xyOffset = 2;
		var horzHeight = 4;
		var vertWidth = 4;
		if(point1.x == point2.x) {  // vertical line
			return that.boardPaper.rect(
				point1.x-xyOffset,
				point1.y-xyOffset + totalPointRadius,
				vertWidth,
				(point2.y + xyOffset) - (point1.y - xyOffset) - 2*totalPointRadius );
		} else {  // horizontal line
			return that.boardPaper.rect(
				point1.x-xyOffset + totalPointRadius,
				point1.y-xyOffset,
				(point2.x + xyOffset) - (point1.x - xyOffset) - 2*totalPointRadius,
				horzHeight );
		}
	};
	
	this.lines = [];
	// horizontal lines
	this.lines[0]  = drawRect(this.coords[0],  this.coords[1]);
	this.lines[1]  = drawRect(this.coords[1],  this.coords[2]);
	this.lines[2]  = drawRect(this.coords[3],  this.coords[4]);
	this.lines[3]  = drawRect(this.coords[4],  this.coords[5]);
	this.lines[4]  = drawRect(this.coords[6],  this.coords[7]);
	this.lines[5]  = drawRect(this.coords[7],  this.coords[8]);
	this.lines[6]  = drawRect(this.coords[9],  this.coords[10]);
	this.lines[7]  = drawRect(this.coords[10], this.coords[11]);
	this.lines[8]  = drawRect(this.coords[12], this.coords[13]);
	this.lines[9]  = drawRect(this.coords[13], this.coords[14]);
	this.lines[10] = drawRect(this.coords[15], this.coords[16]);
	this.lines[11] = drawRect(this.coords[16], this.coords[17]);
	this.lines[12] = drawRect(this.coords[18], this.coords[19]);
	this.lines[13] = drawRect(this.coords[19], this.coords[20]);
	this.lines[14] = drawRect(this.coords[21], this.coords[22]);
	this.lines[15] = drawRect(this.coords[22], this.coords[23]);

	// vertical lines
	this.lines[16] = drawRect(this.coords[0],  this.coords[9]);
	this.lines[17] = drawRect(this.coords[9],  this.coords[21]);
	this.lines[18] = drawRect(this.coords[3],  this.coords[10]);
	this.lines[19] = drawRect(this.coords[10], this.coords[18]);
	this.lines[20] = drawRect(this.coords[6],  this.coords[11]);
	this.lines[21] = drawRect(this.coords[11], this.coords[15]);
	this.lines[22] = drawRect(this.coords[1],  this.coords[4]);
	this.lines[23] = drawRect(this.coords[4],  this.coords[7]);
	this.lines[24] = drawRect(this.coords[16], this.coords[19]);
	this.lines[25] = drawRect(this.coords[19], this.coords[22]);
	this.lines[26] = drawRect(this.coords[8],  this.coords[12]);
	this.lines[27] = drawRect(this.coords[12], this.coords[17]);
	this.lines[28] = drawRect(this.coords[5],  this.coords[13]);
	this.lines[29] = drawRect(this.coords[13], this.coords[20]);
	this.lines[30] = drawRect(this.coords[2],  this.coords[14]);
	this.lines[31] = drawRect(this.coords[14], this.coords[23]);

	
	for (var i = 0; i < this.lines.length; i++) {
		this.lines[i].attr("fill", "#ffffff");
		this.lines[i].attr("stroke-width", 0);
	}
};

GameView.prototype.createCoords = function() {
	var margin = 60;
	var bUnit = (GameView.BOARD_WIDTH - 2*margin)/6;
	var startX = GameView.PIECE_AREA_WIDTH;
	
	this.coords = [];
	this.coords[0]  = { x: startX + margin + bUnit*0, y: margin + bUnit*0 };
	this.coords[1]  = { x: startX + margin + bUnit*3, y: margin + bUnit*0 };
	this.coords[2]  = { x: startX + margin + bUnit*6, y: margin + bUnit*0 };
	this.coords[3]  = { x: startX + margin + bUnit*1, y: margin + bUnit*1 };
	this.coords[4]  = { x: startX + margin + bUnit*3, y: margin + bUnit*1 };
	this.coords[5]  = { x: startX + margin + bUnit*5, y: margin + bUnit*1 };
	this.coords[6]  = { x: startX + margin + bUnit*2, y: margin + bUnit*2 };
	this.coords[7]  = { x: startX + margin + bUnit*3, y: margin + bUnit*2 };
	this.coords[8]  = { x: startX + margin + bUnit*4, y: margin + bUnit*2 };
	this.coords[9]  = { x: startX + margin + bUnit*0, y: margin + bUnit*3 };
	this.coords[10] = { x: startX + margin + bUnit*1, y: margin + bUnit*3 };
	this.coords[11] = { x: startX + margin + bUnit*2, y: margin + bUnit*3 };
	this.coords[12] = { x: startX + margin + bUnit*4, y: margin + bUnit*3 };
	this.coords[13] = { x: startX + margin + bUnit*5, y: margin + bUnit*3 };
	this.coords[14] = { x: startX + margin + bUnit*6, y: margin + bUnit*3 };
	this.coords[15] = { x: startX + margin + bUnit*2, y: margin + bUnit*4 };
	this.coords[16] = { x: startX + margin + bUnit*3, y: margin + bUnit*4 };
	this.coords[17] = { x: startX + margin + bUnit*4, y: margin + bUnit*4 };
	this.coords[18] = { x: startX + margin + bUnit*1, y: margin + bUnit*5 };
	this.coords[19] = { x: startX + margin + bUnit*3, y: margin + bUnit*5 };
	this.coords[20] = { x: startX + margin + bUnit*5, y: margin + bUnit*5 };
	this.coords[21] = { x: startX + margin + bUnit*0, y: margin + bUnit*6 };
	this.coords[22] = { x: startX + margin + bUnit*3, y: margin + bUnit*6 };
	this.coords[23] = { x: startX + margin + bUnit*6, y: margin + bUnit*6 };
};

GameView.prototype.createPieces = function() {
	var that = this;
	var players = [this.game.player1, this.game.player2];
	for(var i = 0; i < players.length; i++) {
		var fromTop = 50;

		var center = GameView.PIECE_AREA_WIDTH/2;
		if ( i === 1 ) {
			// Adjust center to second playerPieceArea.
			center += GameView.BOARD_WIDTH + GameView.PIECE_AREA_WIDTH;
		}

		var player = players[i];
		for(var j in player.pieces) {
			var piece = player.pieces[j];

			piece.setDomRef( this.boardPaper.circle(center, fromTop, GameView.PIECE_RADIUS) );
			piece.getDomRef().piece = piece;
			piece.getDomRef().attr( "fill", player.getColor() );
			piece.getDomRef().attr( "stroke-width", 2 );
			piece.getDomRef().mousedown(
				function () {
					that.inputReceived( this );
				}
			);

			fromTop += GameView.PIECE_RADIUS + 5;
		}
	}	
};

GameView.prototype.refresh = function () {
	
	if(this.game.phase == Game.PHASE_2 && this.game.gameOver()) {
		this.gameOver();
	}

	var players = [this.game.player1, this.game.player2];
	for(var i in players) {
		var player = players[i];
		for(var j in player.pieces) {
			var piece = player.pieces[j];
			piece.setHighlighted(false);
		}
	}

	if ( this.game.activePiece ) {
		this.game.activePiece.setHighlighted(true);
	}
	
	this.updateUI();
	
};

GameView.prototype.updateUI = function() {
	$("#playerOneInfo > .remainingPieces > label").html( this.game.player1.activePieces.length );
	$("#playerTwoInfo > .remainingPieces > label").html( this.game.player2.activePieces.length );
	
	
	var currentPlayer = this.game.activePlayer === this.game.player1 ? "Player 1" : "Player 2";
	if(currentPlayer === "Player 2" && gameMode === 1) {
		currentPlayer = "Computer";
	}
	$("#currentPlayer").html("Current - " + currentPlayer);
	
	if(this.game.phase === Game.PHASE_2) {
		if(this.game.activePlayer.activePieces.length === 3) {
			$("#flying").html("Fly!");
		} else {
			$("#flying").html("");
		}
	}
	
};

GameView.prototype.gameOver = function() {
	this.boardPaper.remove();
	$('#menuCont').show();
	// display "GAME OVER"
	// display winner ("Player 1" or "Player 2")
	// unhide restart button
};

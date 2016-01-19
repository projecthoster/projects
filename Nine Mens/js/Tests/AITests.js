console.log("running AI tests...");

var AIgame;
var gameMode = 1;
var testing = true;
var previousBoard;
var testNum = 0;

$("#menuCont").css("display: none");

function preTestSetup() {
	if(testNum === 4) {
		previousBoard = $.extend(AIgame.board);
	}
}

AI.setBeforeMoveCallBack(preTestSetup);

QUnit.test("Test 1: AI can place a piece", function(assert) {
	testNum = 1;
	AIgame = new Game();
	AIgame.view.inputReceived(AIgame.board.points[0].domRef);
	
	assert.equal(foundAIPieceOnBoard(), true);

	AIgame.view.boardPaper.remove();
});

QUnit.test("Test 2: AI will place piece into non-enemy occupied line", function(assert) {
	testNum = 2;
	AIgame = new Game();
	AIgame.view.inputReceived(AIgame.board.points[0].domRef);

	assert.equal(foundAIPieceInMillWithoutEnemyPiece(), true);

	AIgame.view.boardPaper.remove();
});

QUnit.test("Test 3: AI mill formed remove enemy piece", function(assert) {
	testNum = 3;
	AIgame = new Game();

	AIgame.view.inputReceived(AIgame.board.points[0].domRef);
	AIgame.view.inputReceived(AIgame.board.points[1].domRef);
	AIgame.view.inputReceived(AIgame.board.points[9].domRef);

	var expectedActiveEnemyPieceCount = 2;
	var actualActiveEnemyPieceCount = AIgame.player1.activePieces.length;

	assert.equal(actualActiveEnemyPieceCount, expectedActiveEnemyPieceCount);

	AIgame.view.boardPaper.remove();
});

QUnit.test("Test 4: AI can move piece in phase 2", function(assert) {
	testNum = 4;
	AIgame = new Game();

	AIgame.view.inputReceived(AIgame.board.points[0].domRef);
	AIgame.view.inputReceived(AIgame.board.points[1].domRef);
	AIgame.view.inputReceived(AIgame.board.points[8].domRef);
	AIgame.view.inputReceived(AIgame.board.points[9].domRef);
	AIgame.view.inputReceived(AIgame.board.points[10].domRef);
	AIgame.view.inputReceived(AIgame.board.points[23].domRef);
	AIgame.view.inputReceived(AIgame.board.points[0].domRef);
	AIgame.view.inputReceived(AIgame.board.points[21].domRef);
	AIgame.view.inputReceived(AIgame.board.points[20].domRef);

	AIgame.view.inputReceived(AIgame.player1.activePieces[0].domRef);
	AIgame.view.inputReceived(AIgame.board.points[0].domRef);

	// ensure that board point 1 has AI piece 1
	var newBoard = AIgame.board;
	assert.equal(newBoard !== previousBoard, true);

	AIgame.view.boardPaper.remove();
});

QUnit.test("Test 5: AI can create mill and remove piece in phase 2", function(assert) {
	testNum = 5;
	AIgame = new Game();

	AIgame.view.inputReceived(AIgame.board.points[0].domRef);
	AIgame.view.inputReceived(AIgame.board.points[1].domRef);
	AIgame.view.inputReceived(AIgame.board.points[8].domRef);
	AIgame.view.inputReceived(AIgame.board.points[9].domRef);
	AIgame.view.inputReceived(AIgame.board.points[10].domRef);
	AIgame.view.inputReceived(AIgame.board.points[23].domRef);
	AIgame.view.inputReceived(AIgame.board.points[0].domRef);
	AIgame.view.inputReceived(AIgame.board.points[22].domRef);
	AIgame.view.inputReceived(AIgame.board.points[17].domRef);

	// Now in phase 2
	AIgame.view.inputReceived(AIgame.player1.activePieces[0].domRef);
	AIgame.view.inputReceived(AIgame.board.points[2].domRef);
	AIgame.view.inputReceived(AIgame.player1.activePieces[5].domRef);
	AIgame.view.inputReceived(AIgame.board.points[21].domRef);

	var expectedActiveEnemyPieceCount = 6;
	var actualActiveEnemyPieceCount = AIgame.player1.activePieces.length;

	// ensure that enemy active pieces decreased to 6
	assert.equal(actualActiveEnemyPieceCount, expectedActiveEnemyPieceCount);

	AIgame.view.boardPaper.remove();
});

QUnit.test("Test 6: AI will attempt to complete almost mills in phase 2", function(assert) {
	testNum = 6;
	AIgame = new Game();
	AIgame.view.inputReceived(AIgame.board.points[3].domRef);
	AIgame.view.inputReceived(AIgame.board.points[1].domRef);
	AIgame.view.inputReceived(AIgame.board.points[21].domRef);
	AIgame.view.inputReceived(AIgame.board.points[8].domRef);
	AIgame.view.inputReceived(AIgame.board.points[1].domRef);
	AIgame.view.inputReceived(AIgame.board.points[15].domRef);
	AIgame.view.inputReceived(AIgame.board.points[5].domRef);
	AIgame.view.inputReceived(AIgame.board.points[14].domRef);
	AIgame.view.inputReceived(AIgame.board.points[20].domRef);

	// Now in phase 2
	AIgame.view.inputReceived(AIgame.player1.activePieces[3].domRef);
	AIgame.view.inputReceived(AIgame.board.points[4].domRef);
	AIgame.view.inputReceived(AIgame.player2.activePieces[1].domRef);

	var expectedActiveEnemyPieceCount = 7;
	var actualActiveEnemyPieceCount = AIgame.player1.activePieces.length;

	// ensure that enemy active pieces decreased to 7
	assert.equal(actualActiveEnemyPieceCount, expectedActiveEnemyPieceCount);

	AIgame.view.boardPaper.remove();
});

QUnit.test("Test 7: AI will attempt to remove from almost mill before lonely piece.", function(assert) {
	testNum = 7;
	AIgame = new Game();
	AIgame.view.inputReceived(AIgame.board.points[21].domRef);
	AIgame.view.inputReceived(AIgame.board.points[22].domRef);
	AIgame.view.inputReceived(AIgame.board.points[3].domRef);

	var playerPieces = AIgame.player1.activePieces;

	var piece1 = playerPieces[0];
	var piece2 = playerPieces[1];

	var lines = [];
	lines.push( piece1.point.myLines[0] );
	lines.push( piece1.point.myLines[1] );

	if ( lines.indexOf( piece2.point.myLines[0] ) === -1 ) {
		lines.push( piece2.point.myLines[0] );
	}

	if ( lines.indexOf( piece2.point.myLines[1] ) === -1 ) {
		lines.push( piece2.point.myLines[1] );
	}

	assert.equal(lines.length, 4);

	AIgame.view.boardPaper.remove();
});

QUnit.test("Test 8: AI will place piece in line it is a part of in PH1.", function(assert) {
	testNum = 8;
	AIgame = new Game();
	AIgame.view.inputReceived(AIgame.board.points[3].domRef);
	AIgame.view.inputReceived(AIgame.board.points[4].domRef);
	AIgame.view.inputReceived(AIgame.board.points[12].domRef);
	AIgame.view.inputReceived(AIgame.board.points[23].domRef);

	assert.equal(AIgame.board.points[9].piece.player.AI, true);

	AIgame.view.boardPaper.remove();
});

function foundAIPieceOnBoard() {
	for(var i = 0; i < 24; i++) {
		if(AIgame.board.points[i].piece && AIgame.board.points[i].piece.player == AIgame.player2) {
			return true;
		}
	}
	
	return false;
}

function foundAIPieceInMillWithoutEnemyPiece() {
	var nonActivePlayer = (AIgame.activePlayer === AIgame.player1) ? AIgame.player2 : AIgame.player1;
	var lastActivePiece = nonActivePlayer.activePieces[nonActivePlayer.activePieces.length-1];
	var lastActivePiecesPoint = lastActivePiece.point;
	for(var i = 0; i < lastActivePiecesPoint.myLines.length; i++) {
		var currLine = lastActivePiecesPoint.myLines[i];
		if(!currLine.containsPlayerPieces(AIgame.activePlayer)) {
			return true;
		}
	}
	
	return false;
}

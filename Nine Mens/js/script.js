// Javascript Document

var game;
var testing = false;

function startGame() {
	if(gameMode === 1) {
		$("#playerTwoInfo > .playerLabel").html("Computer");
	}
	game = new Game();
}

var gameMode = 0;
function changeGameMode() {
	if(gameMode === 0) {
		$("#gameModeText").html("Player vs. Computer");
		
		gameMode = 1;
	} else {
		$("#gameModeText").html("Player vs. Player");
		gameMode = 0;
	}
}

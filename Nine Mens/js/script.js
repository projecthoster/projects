import Game from './game';

var game;
var mode = 0;
var testing = false;

$(function () {
    $("#startGame").on('click', function () {
        startGame();
    });

    $("#restartButton").on('click', function () {
        location.reload();
    });

    $("#checkAI").on('change', function () {
        changeGameMode();
    });
});


function startGame() {
    if (mode === 1) {
        $("#playerTwoInfo .playerLabel").html("Computer");
    }
    game = new Game(mode);
}

function changeGameMode() {
    if (mode === 0) {
        $("#gameModeText").html("Player vs. Computer");

        mode = 1;
    } else {
        $("#gameModeText").html("Player vs. Player");
        mode = 0;
    }
}

import Game from './game';

$(function () {
    $("#startGame").on('click', function () {
        startGame();
    });

    $("#restart-button").on('click', function () {
        location.reload();
    });

    $("#checkAI").on('change', function () {
        changeGameMode();
    });
});

var game;
var mode = 0;

function startGame() {
    if (mode === 1) {
        $("#player-info-two .player-label").html("Computer");
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

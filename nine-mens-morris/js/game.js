import AI from './ai';
import Board from './board';
import GameView from './game-view';
import Player from './player';

export default class Game {
    constructor(mode) {
        this.board = new Board();
        this.player1 = new Player();
        this.player2 = new Player();
        this.activePlayer = this.player1;
        this.turnCallback = null;

        this.mode = mode;

        this.activePiece = this.activePlayer.nonActivePieces.pop();

        this.view = new GameView(this);
        if ($("#checkAI").prop("checked")) {
            this.player2.setAI(true);
            new AI(this, this.view);
        }
        this.phase = Game.PHASE_1;
        console.log('Entering phase I');
    }

    setTurnCallback(objToCallOn, callback) {
        this.turnCallbackObj = objToCallOn;
        this.turnCallback = callback;
    }

    nextTurn() {
        if (this.phase === Game.PHASE_1) {
            this.activePlayer.addActivePiece(this.activePiece);

            this.activePlayer = (this.activePlayer === this.player1) ? this.player2 : this.player1;
            this.activePiece = this.activePlayer.nonActivePieces.pop();

            if (!this.activePiece) {
                console.log('Entering phase II');
                this.phase = Game.PHASE_2;
            }
        } else if (this.phase === Game.PHASE_2) {
            this.activePlayer = (this.activePlayer === this.player1) ? this.player2 : this.player1;

            // TODO: check activePlayer's piece's for possible moves. GAME OVER - not active player wins
            this.activePiece = null;
        }

        this.turnCallback.call(this.turnCallbackObj);

        this.activePlayer.takeAction();
    }

    setActivePiece(pieceObject) {
        if (this.activePiece) {
            this.activePiece.setHighlighted(false);
        }
        this.activePiece = pieceObject;
        this.activePiece.setHighlighted(true);
    };

    moveActivePieceToPoint(point) {
        if (this.phase === Game.PHASE_2) {
            if (!this.activePiece) {
                return false;
            } else {
                if (!this.activePlayer.isFlying() && !this.activePiece.getPoint().isAdjacent(point)) {
                    return false;
                }
            }
        }

        this.board.movePieceToPoint(this.activePiece, point);
        return true;
    };

    getNotActivePlayer() {
        if (this.activePlayer === this.player1) {
            return this.player2;
        } else {
            return this.player1;
        }
    };

    gameOver() {
        return this.activePlayer.hasLost();
    };
}

// Kind of super redundant.
Game.PHASE_1 = 1; // Placing men on vacant points.
Game.PHASE_2 = 2; // Moving men to adjacent points, or potential to fly.

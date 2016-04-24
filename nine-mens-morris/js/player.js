import AI from './ai';
import Color from './color';
import Piece from './piece';

export default class Player {
    constructor() {
        this.color = new Color(Player.colors[Player.colorSelector++ % 2]);
        this.AI = false;
        this.pieces = [];
        this.nonActivePieces = [];
        this.activePieces = [];
        for (var i = 0; i < 9; i++) {
            this.pieces[i] = new Piece(this);
            this.nonActivePieces.push(this.pieces[i]);
        }
    }

    setAI(boolAI) {
        this.AI = boolAI;
    };

    getAssociatedLines() {
        var myLines = [];
        for (var i = 0; i < this.activePieces.length; i++) {
            var currPiece = this.activePieces[i];
            var currPoint = currPiece.point;
            for (var j = 0; j < currPoint.myLines.length; j++) {
                if (myLines.indexOf(currPoint.myLines[j]) == -1) {
                    myLines.push(currPoint.myLines[j]);
                }
            }
        }

        return myLines;
    };

    takeAction() {
        if (this.AI) {
            AI.AIexecute();
        }
    };

    addActivePiece(piece) {
        var i = this.nonActivePieces.indexOf(piece);
        if (i != -1) {
            this.nonActivePieces.splice(i, 1);
        }

        this.activePieces.push(piece);
    };

    allPiecesInMills() {
        for (var i = 0; i < this.activePieces.length; i++) {
            var piece = this.activePieces[i];

            if (!piece.isPartOfMill()) {
                return false;
            }
        }

        return true;
    };

    isFlying() {
        return this.activePieces.length < 4;
    };

    hasLost() {
        return this.activePieces.length < 3;
    };

    removeActivePiece(piece) {
        var i = this.activePieces.indexOf(piece);
        if (i != -1) {
            this.activePieces.splice(i, 1);
        }
    };

    killPiece(pieceToKill) {
        this.activePieces.splice(this.activePieces.indexOf(pieceToKill), 1);
        pieceToKill.setDead(true);
    };

    getActivePieces() {
        return this.activePieces;
    };

    getColor() {
        return this.color.getHex();
    };

    setColor(newColor) {
        this.color = newColor;
    };
}

Player.colorSelector = 0;
Player.colors = ["#512C61", "#5F7EAB"];

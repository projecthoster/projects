export default class Point {
    constructor() {
        this.domRef = null; // Set by GameView
        this.piece = null;
        this.myLines = [];
        this.myAdjacents = [];
    }

    setLines(line0, line1) {
        this.myLines.push(line0);
        this.myLines.push(line1);
    };

    setAdjacents(point0, point1, point2, point3) {
        this.myAdjacents.push(point0);
        this.myAdjacents.push(point1);
        if (point2) {
            this.myAdjacents.push(point2);
        }
        if (point3) {
            this.myAdjacents.push(point3);
        }
    };

    findAdjacentPlayerPiecesNotInLine(line, player) {
        var pieces = [];
        var adjacents = this.findAdjacentsNotInLine(line);
        for (var i = 0; i < adjacents.length; i++) {
            var currPoint = adjacents[i];
            if (currPoint.piece && currPoint.piece.player === player) {
                pieces.push(currPoint.piece);
            }
        }
        return pieces;
    };

    findAdjacentsNotInLine(line) {
        var adjacents = [];
        for (var i = 0; i < this.myAdjacents.length; i++) {
            if (!line.containsPoint(this.myAdjacents[i])) {
                adjacents.push(this.myAdjacents[i]);
            }
        }
        return adjacents;
    };

    findAdjacentPiecesOfPlayer(player) {
        var piecesArray = [];
        for (var i = 0; i < this.myAdjacents.length; i++) {

        }
    };

    isAdjacent(pointObj) {
        return this.myAdjacents.indexOf(pointObj) > -1;
    };

    setPiece(piece) {
        this.piece = piece;
    };

    getPiece() {
        return this.piece;
    };

    setDomRef(newDomRef) {
        this.domRef = newDomRef;
    };

    getDomRef() {
        return this.domRef;
    };
}

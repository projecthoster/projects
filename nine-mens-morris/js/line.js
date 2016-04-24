
export default class Line {
    constructor() {
        this.points = [];
    }

    setPoints(point0, point1, point2) {
        this.points[0] = point0;
        this.points[1] = point1;
        this.points[2] = point2;
    };

    isAlmostMill(player) {
        var playerPieceCount = 0;

        for (var i = 0; i < 3; i++) {
            var piece = this.points[i].getPiece();
            if (piece && piece.player === player) {
                playerPieceCount++;
            }
        }

        return playerPieceCount === 2;
    };

    isDone() {
        var playerColor = null;
        for (var i = 0; i < 3; i++) {
            if (this.points[i].getPiece()) {
                var currColor = this.points[i].getPiece().getColor();
                if (playerColor) {
                    if (currColor != playerColor) {
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

    containsPlayerPieces(playerToCheck) {
        for (var i = 0; i < 3; i++) {
            if (this.points[i].piece && this.points[i].piece.player === playerToCheck) {
                return true;
            }
        }
        return false;
    };

    isFull() {
        for (var i = 0; i < 3; i++) {
            if (!this.points[i].getPiece()) {
                return false;
            }
        }
        return true;
    };

    getEmptyPoints() {
        var emptyPoints = [];
        for (var i = 0; i < this.points.length; i++) {
            if (!this.points[i].piece) {
                emptyPoints.push(this.points[i]);
            }
        }

        return emptyPoints;
    };

    containsPoint(point) {
        return this.points.indexOf(point) > -1;
    };
}


// Javascript Document

import Point from './point';
import Line from './line';

export default class Board {
    constructor() {
        this.points = [];
        for (var i = 0; i < 24; i++) {
            this.points.push(new Point());
        }

        this.lines = [];
        this.setUpLines();

        this.setUpPoints();
    }

    getPoint(ind) {
        return this.points[ind];
    };

    getPoints() {
        return this.points;
    };

    movePieceToPoint(piece, point) {
        if (piece.getPoint()) {
            piece.getPoint().setPiece(null);
        }
        piece.setPoint(point);
    };

    checkLines(activePoint) {
        for (var i = 0; i < 2; i++) {
            if (activePoint.myLines[i].isDone()) {
                return true;
            }
        }
        return false;
    };

    setUpPoints() {
        // Set up Adjacents  (maybe adjacent-finder.js class?)
        this.points[0].setAdjacents(this.points[1], this.points[9]);
        this.points[1].setAdjacents(this.points[0], this.points[2], this.points[4]);
        this.points[2].setAdjacents(this.points[1], this.points[14]);
        this.points[3].setAdjacents(this.points[4], this.points[10]);
        this.points[4].setAdjacents(this.points[1], this.points[3], this.points[5], this.points[7]);
        this.points[5].setAdjacents(this.points[4], this.points[13]);
        this.points[6].setAdjacents(this.points[7], this.points[11]);
        this.points[7].setAdjacents(this.points[4], this.points[6], this.points[8]);
        this.points[8].setAdjacents(this.points[7], this.points[12]);
        this.points[9].setAdjacents(this.points[0], this.points[10], this.points[21]);
        this.points[10].setAdjacents(this.points[3], this.points[9], this.points[11], this.points[18]);
        this.points[11].setAdjacents(this.points[6], this.points[10], this.points[15]);
        this.points[12].setAdjacents(this.points[8], this.points[13], this.points[17]);
        this.points[13].setAdjacents(this.points[5], this.points[12], this.points[14], this.points[20]);
        this.points[14].setAdjacents(this.points[2], this.points[13], this.points[23]);
        this.points[15].setAdjacents(this.points[11], this.points[16]);
        this.points[16].setAdjacents(this.points[15], this.points[17], this.points[19]);
        this.points[17].setAdjacents(this.points[12], this.points[16]);
        this.points[18].setAdjacents(this.points[10], this.points[19]);
        this.points[19].setAdjacents(this.points[16], this.points[18], this.points[20], this.points[22]);
        this.points[20].setAdjacents(this.points[13], this.points[19]);
        this.points[21].setAdjacents(this.points[9], this.points[22]);
        this.points[22].setAdjacents(this.points[19], this.points[21], this.points[23]);
        this.points[23].setAdjacents(this.points[14], this.points[22]);

        // Set up Lines
        this.points[0].setLines(this.lines[0], this.lines[8]);
        this.points[1].setLines(this.lines[0], this.lines[11]);
        this.points[2].setLines(this.lines[0], this.lines[15]);
        this.points[3].setLines(this.lines[1], this.lines[9]);
        this.points[4].setLines(this.lines[1], this.lines[11]);
        this.points[5].setLines(this.lines[1], this.lines[14]);
        this.points[6].setLines(this.lines[2], this.lines[10]);
        this.points[7].setLines(this.lines[2], this.lines[11]);
        this.points[8].setLines(this.lines[2], this.lines[13]);
        this.points[9].setLines(this.lines[3], this.lines[8]);
        this.points[10].setLines(this.lines[3], this.lines[9]);
        this.points[11].setLines(this.lines[3], this.lines[10]);
        this.points[12].setLines(this.lines[4], this.lines[13]);
        this.points[13].setLines(this.lines[4], this.lines[14]);
        this.points[14].setLines(this.lines[4], this.lines[15]);
        this.points[15].setLines(this.lines[5], this.lines[10]);
        this.points[16].setLines(this.lines[5], this.lines[12]);
        this.points[17].setLines(this.lines[5], this.lines[13]);
        this.points[18].setLines(this.lines[6], this.lines[9]);
        this.points[19].setLines(this.lines[6], this.lines[12]);
        this.points[20].setLines(this.lines[6], this.lines[14]);
        this.points[21].setLines(this.lines[7], this.lines[8]);
        this.points[22].setLines(this.lines[7], this.lines[12]);
        this.points[23].setLines(this.lines[7], this.lines[15]);

    };

    setUpLines() {
        for (var i = 0; i < 16; i++) {
            this.lines.push(new Line());
        }

        // horizontal lines
        this.lines[0].setPoints(this.points[0], this.points[1], this.points[2]);
        this.lines[1].setPoints(this.points[3], this.points[4], this.points[5]);
        this.lines[2].setPoints(this.points[6], this.points[7], this.points[8]);
        this.lines[3].setPoints(this.points[9], this.points[10], this.points[11]);
        this.lines[4].setPoints(this.points[12], this.points[13], this.points[14]);
        this.lines[5].setPoints(this.points[15], this.points[16], this.points[17]);
        this.lines[6].setPoints(this.points[18], this.points[19], this.points[20]);
        this.lines[7].setPoints(this.points[21], this.points[22], this.points[23]);

        // vertical lines
        this.lines[8].setPoints(this.points[0], this.points[9], this.points[21]);
        this.lines[9].setPoints(this.points[3], this.points[10], this.points[18]);
        this.lines[10].setPoints(this.points[6], this.points[11], this.points[15]);
        this.lines[11].setPoints(this.points[1], this.points[4], this.points[7]);
        this.lines[12].setPoints(this.points[16], this.points[19], this.points[22]);
        this.lines[13].setPoints(this.points[8], this.points[12], this.points[17]);
        this.lines[14].setPoints(this.points[5], this.points[13], this.points[20]);
        this.lines[15].setPoints(this.points[2], this.points[14], this.points[23]);
    };
}
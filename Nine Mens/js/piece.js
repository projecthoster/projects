// Javascript Document

export default class Piece {
    constructor(player) {
        this.player = player;
        this.point = null;
        this.onBoard = false;
        this.domRef = null; // Set by GameView
        this.dead = false;
    }

    getPlayer() {
        return this.player;
    };

    getColor() {
        return this.player.getColor();
    };

    setDomRef(newDomRef) {
        this.domRef = newDomRef;
    };

    getDomRef() {
        return this.domRef;
    };

    setPoint(newLocation) {
        this.point = newLocation;
        this.point.setPiece(this);
        this.getDomRef().attr(
            {
                cx: this.getPoint().getDomRef().attr("cx"),
                cy: this.getPoint().getDomRef().attr("cy")
            }
        );
        this.onBoard = true;
    };

    canBeRemoved() {
        return this.player.allPiecesInMills() || !this.isPartOfMill();
    };

    isPartOfMill() {
        var lines = this.point.myLines;
        return lines[0].isDone() || lines[1].isDone();
    };

    getPoint() {
        return this.point;
    };

    getOnBoard() {
        return this.onBoard;
    };

    setHighlighted(highlighted) {
        var strokeColor = highlighted ? "#ffffff" : "#000000";
        this.getDomRef().attr("stroke", strokeColor);
    };

    getDead() {
        return this.dead;
    };

    setDead(bool) {
        this.point.setPiece(null);
        this.point = null;
        this.onBoard = !bool;
        this.dead = bool;
    };
}

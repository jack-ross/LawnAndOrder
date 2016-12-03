"use strict";

class Coordinate {

    /**
    * @param {Number} x x-coordinate
    * @param {Number} y y-coordinate
    * @param {Coordinate} relativePoint a point this coordinate should be relative to
    */
    constructor(x, y, relativePoint = null) {
        this.relativePoint = relativePoint;
        this.x = x;
        this.y = y;

        this.relativeX = relativePoint ? this.x - this.relativePoint.x : null;
        this.relativeY = relativePoint ? this.y - this.relativePoint.y : null;

        this.absoluteCoordinates = { x: this.x, y: this.y };
        this.relativeCoordinates = relativePoint ? { x: this.relativeX, y: this.relativeY } : null;
    }

    /**
    * @param {Coordinate} a a point to be compared
    * @param {Coordinate} b the other point to be compared 
    */
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    toString() {
        if (this.relativePoint) {
            return '"' + {
                relative: true,
                x: this.relativeX,
                y: this.relativeY
            } + '"';
        };
        return '"' + {
            relative: false,
            x: this.x,
            y: this.y
        } + '"';
    }

}

module.exports = Coordinate;

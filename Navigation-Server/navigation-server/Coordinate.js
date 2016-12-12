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

        this.relativeX = relativePoint ? this.x - this.relativePoint.x : this.x;
        this.relativeY = relativePoint ? this.y - this.relativePoint.y : this.y;

        this.absoluteCoordinates = { x: this.x, y: this.y };
        this.relativeCoordinates = { x: this.relativeX, y: this.relativeY };
    }

    /**
    * @param {Coordinate} a a point to be compared
    * @param {Coordinate} b the other point to be compared 
    */
    static distance(a, b) {
        const dx = a.relativeX - b.relativeX;
        const dy = a.relativeY - b.relativeY;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
    * @param {Coordinate} a a point to be compared (robot)
    * @param {Coordinate} b the other point to be compared (goal) 
    */
    static angle(a, b) {

        var diffY = b.relativeY- a.relativeY;
        var diffX = b.relativeX- a.relativeX;

        return Math.atan2(diffY, diffX) * 180 / Math.PI;

        // robot is to right and above
        if (diffX < 0 && diffY < 0){
            return Math.atan(diffY, diffX) * 180 / Math.PI;
        } // else to right and below
        else if (diffX < 0 && diffY > 0 ) {
            return Math.atan(diffY, diffX) * 180 / Math.PI + 180;
        } // else left and above
        else if (diffX > 0 && diffY < 0 ) {
            return Math.atan(diffY, diffX) * 180 / Math.PI + 180;
        } // else to left and below
        else if (diffX > 0 && diffY > 0 ) {
            return Math.atan(diffY, diffX) * 180 / Math.PI;
        }

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

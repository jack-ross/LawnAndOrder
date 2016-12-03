"use strict";

class Coordinate {
    constructor(x, y, relativePoint = null) {
        this.relativePoint = relativePoint;
        this.x = x;
        this.y = y;

        this.relativeX = relativePoint ? this.x - this.relativePoint.x : null;
        this.relativeY = relativePoint ? this.y - this.relativePoint.y : null;

        this.absoluteCoordinates = {x: this.x, y: this.y};
        this.relativeCoordinates = relativePoint ? {x: this.relativeX, y: this.relativeY} : null;
    }
}

module.exports = Coordinate;

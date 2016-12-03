"use strict";

const Coordinate = require("./Coordinate.js");
const Constants = require("./Constants.js");

//
//  About
//
//  There will be one aruco fiducial marker (MapFidicual)
//  MapFidicual will dictate the orientation and location of the image
//  All boundaries will be relative to the MapFidicual
//  Map Coordinates will be given by the four corners of the rectangular work area
// 

class Boundary {

    constructor(boundaryJsonObject) {
        var mapFidicual = boundaryJsonObject.mapFidicual
        this.mapFidicual = new Coordinate(mapFidicual.x, mapFidicual.y);

        var corners = boundaryJsonObject.corners;
        this.corners = {
            topLeft: new Coordinate(corners.topLeft.x, corners.topLeft.y, this.mapFidicual),
            bottomLeft: new Coordinate(corners.bottomLeft.x, corners.bottomLeft.y, this.mapFidicual),
            topRight: new Coordinate(corners.topRight.x, corners.topRight.y, this.mapFidicual),
            bottomRight: new Coordinate(corners.bottomRight.x, corners.bottomRight.y, this.mapFidicual)
        };

        this.relativeCorners = {
            topLeft: this.corners.topLeft.relativeCoordinates,
            bottomLeft: this.corners.bottomLeft.relativeCoordinates,
            topRight: this.corners.topRight.relativeCoordinates,
            bottomRight: this.corners.bottomRight.relativeCoordinates
        };

        this.dimensions = {
            width: this.corners.bottomRight.x - this.corners.bottomLeft.x,
            height: this.corners.topRight.y - this.corners.bottomRight.y
        };
    };

}

module.exports = Boundary;
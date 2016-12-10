"use strict";
const Coordinate = require("./Coordinate.js");
const Constants = require("./Constants.js");

class Robot {

    constructor(uid) {
        this.uid = uid || -1;

        this.location = new Coordinate(-1, -1);
        this.startingLocation = new Coordinate(-1, -1);
        this.startingAlley = 0;
        this.currentAlley = 0;
        this.endingAlley = -1;

        this.goalCoordinate = new Coordinate(-1, -1);

        this.pointsTraveled = [];

        this.redisClient = null;
    }
    
    /**
    * @param {Coordinate}   coordinate the most recent point as returned  
    *                       by the open-cv server
    * @return {Boolean}     true if point added, false if not  
    */
    addPointTraveled(coordinate) {
        if (this.pointsTraveled.length == 0) { 
            this.pointsTraveled.push(coordinate);
            return true;
        }

        const lastPoint = this.pointsTraveled[this.pointsTraveled.length-1];
        const distancePixels = Coordinate.distance(lastPoint, coordinate);
        const distanceCms = distancePixels/Constants.PixelsPerCentimeter;

        if (distanceCms > Constants.RobotDimensions.height/2) { 
            this.pointsTraveled.push(coordinate);
            return true;
        }
        return false;        
    }

    get DistanceToGoal() {
        return  Coordinate.distance(this.location, this.goalCoordinate);
    };

    get AngleToGoal() {
        var angleToGoal = Coordinate.angle(this.location, this.goalCoordinate);
        if (angleToGoal < 0) angleToGoal +=360;
        return angleToGoal
    };
};

module.exports = Robot;

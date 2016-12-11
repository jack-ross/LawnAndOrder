"use strict";
const Coordinate = require("./Coordinate.js");
const Constants = require("./Constants.js");

class Robot {

    constructor(uid, navigationController) {
        this.uid = uid || -1;
        this.navigationController = navigationController;

        this.location = new Coordinate(-1, -1);
        this.startingLocation = new Coordinate(-1, -1);
        this.startingAlley = 0;
        this.currentAlley = 0;
        this.startedAtBottom = false;
        this.changingAlleys = false;
        this.isInitializing = true;
        this.endingAlley = -1;

        this.goalCoordinate = new Coordinate(-1, -1);

        this.pointsTraveled = [];

        this.redisClient = null;
    }

    /**
    * @param {Coordinate}   currentLocation the most recent point as returned  
    *                       by the open-cv server
    */
    updateLocation(currentLocation) {
        this.location = currentLocation;
        this.addPointTraveled(currentLocation);

        // check if robot is at Goal location and update
        if (this.DistanceToGoalCms < Constants.AllowedDistanceErrorCms) {

            // if was not changing alleys, it has reached end of alley and
            // must set next alley as goal
            if (!this.changingAlleys) {
                const nextAlleyId = this.currentAlley + 1;
                var nextAlley = this.navigationController.alleys[nextAlleyId];
                this.currentAlley = nextAlley;

                // if finished at the top (end) of an alley, must start at
                // the top (end) of the nextAlley
                if (this.startedAtBottom) {
                    this.goalCoordinate = nextAlley.end;
                    this.startedAtBottom = false;
                } else {
                    this.goalCoordinate = nextAlley.start;
                    this.startedAtBottom = true;
                }
            } 
            // else robot just reached the start of its alley, goal is the end
            else {
                if (this.startedAtBottom) {
                    this.goalCoordinate = this.currentAlley.end;
                } else {
                    this.goalCoordinate = this.currentAlley.start;
                }
            }
        }
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

        const lastPoint = this.pointsTraveled[this.pointsTraveled.length - 1];
        const distancePixels = Coordinate.distance(lastPoint, coordinate);
        const distanceCms = distancePixels / Constants.PixelsPerCentimeter;

        if (distanceCms > Constants.RobotDimensions.height / 2) {
            this.pointsTraveled.push(coordinate);
            return true;
        }
        return false;
    }

    /**
    * @return {Number}     distance to goal in pixels  
    */
    get DistanceToGoalPixels() {
        return Coordinate.distance(this.location, this.goalCoordinate);
    };

    /**
    * @return {Number}     distance to goal in centimeters  
    */
    get DistanceToGoalCms() {
        return Coordinate.distance(this.location, this.goalCoordinate) / Constants.PixelsPerCentimeter;
    };

    get AngleToGoal() {
        var angleToGoal = Coordinate.angle(this.location, this.goalCoordinate);
        if (angleToGoal < 0) angleToGoal += 360;
        return angleToGoal
    };
};

module.exports = Robot;

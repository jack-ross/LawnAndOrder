"use strict";

const Coordinate = require("./Coordinate.js");
const Alley = require("./Alley.js");
const Constants = require("./Constants.js");
const Robot = require("./Robot.js");

class NavigationController {
    constructor(boundary) {

        const robotWidthPixels = Constants.RobotDimensions.width * Constants.PixelsPerCentimeter;
        const robotHeightPixels = Constants.RobotDimensions.height * Constants.PixelsPerCentimeter;
        var numberOfAlleys = Math.floor(boundary.dimensions.width / robotWidthPixels);
        this.alleys = [];
        // start alley
        var start = new Coordinate(robotWidthPixels / 2, robotHeightPixels / 2, boundary.mapFidicual);
        var end = new Coordinate(robotWidthPixels / 2, boundary.dimensions.height - (robotHeightPixels / 2), boundary.mapFidicual);
        var alley = new Alley(0, start, end);
        this.alleys.push(alley);

        // middle alleys
        for (var i = 1; i < numberOfAlleys; i++) {
            start = new Coordinate(robotWidthPixels / 2 + robotWidthPixels * i, robotHeightPixels / 2, boundary.mapFidicual);
            end = new Coordinate(robotWidthPixels / 2 + robotWidthPixels * i, boundary.dimensions.height - (robotHeightPixels / 2), boundary.mapFidicual);
            alley = new Alley(i, start, end);
            this.alleys.push(alley);
        }

        // end alley
        start = new Coordinate(boundary.dimensions.width - robotWidthPixels / 2, robotHeightPixels / 2, boundary.mapFidicual);
        end = new Coordinate(boundary.dimensions.width - robotWidthPixels / 2, boundary.dimensions.height - (robotHeightPixels / 2), boundary.mapFidicual);
        alley = new Alley(numberOfAlleys, start, end);
        this.alleys.push(alley);

        this.robots = [];
    };


    /**
    * @param {Robot}   robot a robot working in the field  
    * @return {Number}   the number of robots in the array  
    */
    addRobot(robot) {
        this.robots.push(robot);
    };

    /**
    * @param {Robot}    robot   the robot to be configured 
    * @param {Number}   index   the relative index of the robot 
    *                           (i.e bot one will work most left section, etc)  
    * @param {Number}   robotCount   the total number of robots in the field 
    * @return {Coordinate}   the starting Coordinate of the robot  
    */
    configureRobot(robot, index, robotCount) {
        // index--; //decriment index because it starts at 1;
        const numAlleys = this.alleys.length;
        robot.startingAlley = Math.ceil(numAlleys * index / robotCount);
        robot.endingAlley = (index + 1 == robotCount) ? this.alleys.length - 1 : Math.floor(numAlleys * (index + 1 / robotCount));
    };
    
    /**
    * @param {Number}   uid   unique identifier for robot 
    * @return {Robot}   the found robot  
    */
    getRobotForUID(uid) {
        for (var i = 0; i < this.robots.length; i++) {
            if (this.robots[i].uid == uid) return this.robots[i];
        }
        return null;
    };

}

module.exports = NavigationController;
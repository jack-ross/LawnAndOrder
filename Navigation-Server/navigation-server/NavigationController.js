"use strict";

const Coordinate = require("./Coordinate.js");
const Constants = require("./Constants.js");

class NavigationController {
    constructor(boundary) {

        const robotWidthPixels = Constants.RobotDimensions.width * Constants.PixelsPerCentimeter;
        const robotHeightPixels = Constants.RobotDimensions.height * Constants.PixelsPerCentimeter;
        var numberOfAlleys = Math.floor(boundary.dimensions.width / robotWidthPixels);
        var alleys = [];
        // start alley
        var alley = {
            start: new Coordinate(robotWidthPixels / 2, robotHeightPixels / 2),
            end: new Coordinate(robotWidthPixels / 2, boundary.dimensions.height - (robotHeightPixels / 2))
        };
        alleys.push(alley);

        // middle alleys
        for (var i = 1; i < numberOfAlleys; i++) {
            alley = {
                start: new Coordinate(robotWidthPixels / 2 + robotWidthPixels * i, robotHeightPixels / 2),
                end: new Coordinate(robotWidthPixels / 2 + robotWidthPixels * i, boundary.dimensions.height - (robotHeightPixels / 2))
            };
            alleys.push(alley);
        }

        // end alley
        alley = {
            start: new Coordinate(boundary.dimensions.width - robotWidthPixels / 2, robotHeightPixels / 2),
            end: new Coordinate(boundary.dimensions.width - robotWidthPixels / 2, boundary.dimensions.height - (robotHeightPixels / 2))
        };
        alleys.push(alley);

        this.alleys = alleys;
    }
}

module.exports = NavigationController;
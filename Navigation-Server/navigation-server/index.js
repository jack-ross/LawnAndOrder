"use strict";

const Boundary = require("./Boundary.js");
const Coordinate = require("./Coordinate.js");
const DummyData = require("./DummyData.js");
const Constants = require("./Constants.js");
const redis = require("redis")
    , redisClient = redis.createClient(Constants.RedisConfig);

// PubSub Subcription for OpenCvChannel
redisClient.on("message", function(channel, message) {
    console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
});
redisClient.subscribe(Constants.OpenCvChannel);

const boundary = new Boundary(DummyData.BoundaryJsonObject);
console.log(boundary.dimensions);

// array of alleys (paths robots travel)
// starts at    x: relative bottom left + width/2
//              y: relative bottom left + height/2
// add point at i+robotWidth until at right side;
// ends at  x: relative bottom right - width/2
//          y: relative bottom right + height/2 (if odd numberOfAlleys)
//          y: relative top right - height/2 (if even numberOfAlleys)
var alleys = [];
const robotWidthPixels = Constants.RobotDimensions.width * Constants.PixelsPerCentimeter;
const robotHeightPixels = Constants.RobotDimensions.height * Constants.PixelsPerCentimeter;
var numberOfAlleys = Math.floor(boundary.dimensions.width / robotWidthPixels);

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

console.log(alleys);




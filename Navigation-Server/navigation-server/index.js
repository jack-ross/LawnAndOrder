"use strict";

const Boundary = require("./Boundary.js");
const DummyData = require("./DummyData.js");
const Constants = require("./Constants.js");
const redis = require("redis")
    , redisClient = redis.createClient(Constants.RedisConfig);

// PubSub Subcription for OpenCvChannel
redisClient.on("message", function (channel, message) {
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
//          y: relative bottom right + height/2 (if odd numberOfBottomPoints)
//          y: relative top right - height/2 (if even numberOfBottomPoints)
var bottomPoints = [];
const robotWidthPixels = Constants.RobotDimensions.width * Constants.PixelsPerCentimeter;
var numberOfBottomPoints = Math.floor(boundary.dimensions.width / robotWidthPixels);
bottomPoints.push(robotWidthPixels / 2);
for (var i = 1; i < numberOfBottomPoints; i++) {
    bottomPoints.push(robotWidthPixels / 2 + robotWidthPixels*i);
}
bottomPoints.push(boundary.dimensions.width - robotWidthPixels / 2);

console.log(bottomPoints);




"use strict";

const Boundary = require("./Boundary.js");
const NavigationController = require("./NavigationController.js");
const DummyData = require("./DummyData.js");
const Constants = require("./Constants.js");
const Robot = require("./Robot.js");

// launch mqtt server
// $ /usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf
const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost');

client.on('connect', function () {
  client.subscribe('cv-channel')
  client.publish('cv-channel', 'Hello Matt!')
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
});

const boundary = new Boundary(DummyData.BoundaryJsonObject);
// console.log(boundary.dimensions);

// array of alleys (paths robots travel)
// starts at    x: relative bottom left + width/2
//              y: relative bottom left + height/2
// add point at i+robotWidth until at right side;
// ends at  x: relative bottom right - width/2
//          y: relative bottom right + height/2 (if odd numberOfAlleys)
//          y: relative top right - height/2 (if even numberOfAlleys)
var navigationController = new NavigationController(boundary);
// init

var numberOfRobots = DummyData.NumberOfBots;

for (var i = 0; i < numberOfRobots; i++){
    var robot = new Robot(i);
    navigationController.configureRobotStart(robot, 0, 1);
    navigationController.addRobot(robot);
}

// console.log(navigationController.robots);




"use strict";

const Boundary = require("./Boundary.js");
const NavigationController = require("./NavigationController.js");
const Constants = require("./Constants.js");
const Coordinate = require("./Coordinate.js");
const Robot = require("./Robot.js");

// launch mqtt server
// $ /usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost', { clientId: Constants.ClientId });

console.log("Starting Navigation Server");

client.on('connect', function () {
    console.log("Connected to MQTT server as: " + Constants.ClientId);
    client.subscribe('cv-channel');
    // client.subscribe('robot-1');
});

client.on('message', function (topic, message) {
    // message is a Buffer array 
    console.log('\n');
    console.log("received message for topic: " + topic);
    console.log(message.toString());
    console.log('\n');
    
    if (topic.toString() == Constants.OpenCvChannel) 
        handleOpenCV(message.toString());
});

const boundary = new Boundary(Constants.BoundaryJsonObject);
// console.log(boundary.dimensions);

// array of alleys (paths robots travel)
// starts at    x: relative bottom left + width/2
//              y: relative bottom left + height/2
// add point at i+robotWidth until at right side;
// ends at  x: relative bottom right - width/2
//          y: relative bottom right + height/2 (if odd numberOfAlleys)
//          y: relative top right - height/2 (if even numberOfAlleys)
var navigationController = new NavigationController(boundary);
var numberOfRobots = Constants.NumberOfBots;

// configure robots for starting
for (var i = 1; i <= numberOfRobots; i++) {
    var robot = new Robot(i, navigationController);
    /* the robot to be configured. 
    *  the relative index of the robot (i.e bot one will work most left section, etc) 
    *  the total number of robots in the field */ 
    navigationController.configureRobot(robot, i-1, numberOfRobots);
    navigationController.addRobot(robot);
    robot.start();
}

function handleOpenCV(payload) {
    
    // if it hasn't been initialized, try again in 1000ms
    if (navigationController.robots.length < 1) {
        setTimeout(handleOpenCV, 1000);
    }

    var regex = new RegExp("'", 'g');
    payload = payload.replace(regex, '"');
    var msg = JSON.parse(payload) || {
        'message':
        {
            'objects':
            [
                { 'position': { 'y': 40, 'x': 39 }, 'angle': 0, 'uid': 0 }, // fiducial is 0
                { 'position': { 'y': 40, 'x': 39 }, 'angle': 180, 'uid': 1 },
            ]
        },
        'sender': 'cv-server',
        'time': 1481314686.723629
    };

    var objects = msg.message.objects;


    var robotObjects = [];
    var fiducial; // coordiante
    // parse objects to robots and the single fidicual
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (object.uid == 0) {
            fiducial = new Coordinate(object.position.x, object.position.y);
        } else {
            robotObjects.push(object);
        }
    }

    // calculate robot positions relative to fidicual
    for (var i = 0; i < robotObjects.length; i++) {
        var robotInField = robotObjects[i];
        var robotCurrentCoordinate = new Coordinate(robotInField.position.x, robotInField.position.y, fiducial);
        var robotInSytem = navigationController.getRobotForUID(robotInField.uid);

        // add this current point to robots paths
        robotInSytem.updateLocation(robotCurrentCoordinate);
        if (robotInSytem.jobComplete) return;

        // calculate correction
        var distanceToGoal = robotInSytem.DistanceToGoalCms;
        var angleToGoal = robotInSytem.AngleToGoal; // zero - 360 degrees

        console.log("robotInSytem.location.relativeCoordinates");
        console.log(robotInSytem.location.relativeCoordinates);

        console.log("this.goalCoordinate.relativeCoordinates");
        console.log(robotInSytem.goalCoordinate.relativeCoordinates);

        console.log("angleToGoal");
        console.log(angleToGoal);

        // positive angle, robot goes right
        // negative angle, robot goes left
        var robotFieldAngleAdjusted = (-robotInField.angle + 90) 


        var robotRelativeAngleToGoal =  angleToGoal - robotFieldAngleAdjusted;

        if (robotRelativeAngleToGoal < -180) robotRelativeAngleToGoal += 360;
        if (robotRelativeAngleToGoal > 180) robotRelativeAngleToGoal -= 360;


        console.log("robotInField.angle");
        console.log(robotInField.angle);
        console.log("robotRelativeAngleToGoal");
        console.log(robotRelativeAngleToGoal);

        var messageToRobot = {
            "angleToGoal": robotRelativeAngleToGoal,
            "distanceToGoal": distanceToGoal,
            "permissionToMove": checkPermissionToMove(),
            "time": Date.now()
        }

        var robotChannel = "robot-" + robotInField.uid;
        console.log('\n');
        console.log("publishing to " + robotChannel);
        console.log(JSON.stringify(messageToRobot));
        var options = {
            retain: true
        }
        client.publish(robotChannel, JSON.stringify(messageToRobot), options);
    }
}

function checkPermissionToMove(){
    return true;
}
"use strict";
const Constants = require("../navigation-server/Constants.js");

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost', { clientId: "mock-cv-server" });

console.log("Starting Navigation Server");

client.on('connect', function () {
    console.log("Connected to MQTT server as: " + "mock-cv-server");
    // client.subscribe('robot-1');
    promptUser();
});

var prompt = require('prompt');



// basic message with fiducial
var msg = {
    'message':
    {
        'objects':
        [
            { 'position': { 'y': 0, 'x': 0 }, 'angle': 0, 'uid': 0 }, // fiducial is 0
            // { 'position': { 'y': 40, 'x': 39 }, 'angle': 180, 'uid': 1 },
        ]
    },
    'sender': 'cv-server',
    'time': Date.now()
};

function promptUser() {

    prompt.start();
    prompt.get(['x', 'y', 'angle'], function (err, result) {
        if (err) { return onErr(err); }

        var newObject = {
            position: {
                x: result.x,
                y: result.y
            },
            angle: result.angle,
            uid: 1
        }

        msg.message.objects.push(newObject);

        // update time 
        msg.time = Date.now();

        var channel = Constants.OpenCvChannel;
        console.log("publishing to " + channel);
        console.log(JSON.stringify(msg));
        var options = {
            retain: true
        }
        client.publish(channel, JSON.stringify(msg), options);
    });
}
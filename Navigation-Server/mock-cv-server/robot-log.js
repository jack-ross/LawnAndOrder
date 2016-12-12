"use strict";

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost', { clientId: "robot-log" });

console.log("Starting Navigation Server");

client.on('connect', function () {
    console.log("Connected to MQTT server as: " + "robot-log");
    client.subscribe('robot-1');
});


client.on('message', function (topic, message) {
    // message is a Buffer array 
    console.log('\n');
    console.log("received message for topic: " + topic);
    console.log(message.toString());
    console.log('\n');
    
});
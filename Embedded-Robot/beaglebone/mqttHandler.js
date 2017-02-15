"use strict";

const constants = require("./constants.js");
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.1.111:1883');

const ROBOT_TOPIC = "robot-1";
 
client.on('connect', function () {
  client.subscribe(ROBOT_TOPIC);
  client.publish('status', ROBOT_TOPIC + " connected!");
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  client.end();
})
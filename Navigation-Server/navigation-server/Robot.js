"use strict";
const Coordinate = require("./Coordinate.js");

class Robot {

    constructor(uid){
        this.uid = uid;

        this.location = new Coordinate(-1,-1);
        this.currentAlley = 0;
        this.goalCoordation = new Coordinate(-1,-1);

        this.pointsTraveled = [];

        this.redisClient = null;
    }

    /**
    * @param {Coordinate}   coordinate the most recent point as returned  
    *                       by the open-cv server
    */
    addPointTraveled(coordinate) {
        
    }

}

module.export = Robot;
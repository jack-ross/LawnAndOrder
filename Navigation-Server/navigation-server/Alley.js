"use strict";

const Coordinate = require("./Coordinate.js");

class Alley {

    /**
    * @param {Coordinate}   start the beginning of the alley  
    * @param {Coordinate}   end the end of the alley  
    */    
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
module.exports = Alley;

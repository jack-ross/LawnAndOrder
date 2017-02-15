var bone = require('octalbonescript');
const constants = require("./constants.js");

//initialize the pins
//Left Motor
bone.pinMode(constants.ECODER_AL, bone.INPUT);
bone.pinMode(constants.ECODER_BL, bone.INPUT);
bone.pinMode(constants.motorL_forward, bone.OUTPUT);
bone.pinMode(constants.motorL_reverse, bone.OUTPUT);

//Left Motor
bone.pinMode(constants.ECODER_AR, b.INPUT);
bone.pinMode(constants.ECODER_BR, b.INPUT);
bone.pinMode(constants.motorR_forward, bone.OUTPUT);
bone.pinMode(constants.motorR_reverse, bone.OUTPUT);

//true calls the handler every hit 
bone.attachInterrupt(constants.ECODER_AL, true, b.CHANGE, encoderL_ISR);
bone.attachInterrupt(constants.ECODER_BL, true, b.CHANGE, encoderL_ISR);
bone.attachInterrupt(constants.ECODER_AL, true, b.CHANGE, encoderR_ISR);
bone.attachInterrupt(constants.ECODER_BL, true, b.CHANGE, encoderR_ISR);

function encoderL_ISR(x) {
  ticksL++;
  console.log(JSON.stringify(x));
}

function encoderR_ISR(x) {
  ticksR++;
  console.log(JSON.stringify(x));
}


/* encoder and motor variables have been changed to the correct pins

// Generic variables
int i = 0;
int n = 8;
boolean objDetected = false;
int prev = 0;
// variables for sensor 1
//U2
const int anPin1 = 6; // Left Sensor
long distance1;
int sensorBuffer1[8];
float runningSum1;
float runningAverage1;
float inputValue1;
float var1 = 0; //variance
// variables for sensor 2
//U6
const int anPin2 = 24; // Right Sensor
long distance2;
int sensorBuffer2[8];
float runningSum2;
float runningAverage2;
float inputValue2;
float var2 = 0; //varience
*/


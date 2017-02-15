var ECODER_AR = "P8_8";
var ENCODER_BR = "P8_10";
var motorR_forward = "P9_33";
var motorR_reverse = "P9_35";

var ECODER_AL = "P8_12";
var ENCODER_BL = "P8_14";
var motorL_forward = "P9_37";
var motorL_reverse = "P9_39";



// encoder and motor variables have been changed to the correct pins

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

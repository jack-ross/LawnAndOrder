"use strict";

// variables for sensor 2
// const int anPin1 = 6; // Left Sensor
var distance1;
var sensorBuffer1[8];
var runningSum1;
var runningAverage1;
var inputValue1;
var var1 = 0; //variance

// variables for sensor 2
// const int anPin2 = 24; // Right Sensor
var distance2;
var sensorBuffer2[8];
var runningSum2;
var runningAverage2;
var inputValue2;
var var2 = 0; //varience

var bone = require('bonescript');

// public class Sensor extends Initialize {

bool read_sensors() {

  // Sonar Sensor 1 Data
  distance1 = bone.analogRead(anPin1) / 20; // Read Left Sensor Data

  // Circular Buffer
  inputValue1 = distance1;
  runningSum1 = runningSum1 - sensorBuffer1[i] + inputValue1; // Calculate the sum of variables in the buffer
  sensorBuffer1[i] = inputValue1; // update buffer value
  runningAverage1 = (runningSum1 / 8);
  var1 = var1 + Math.pow((inputValue1 - runningAverage1), 2); // Calculate variance of buffer
  var1 = var1 / (n - 1);
    // where is var1 being declared

  // Sonar Sensor 2 Data
  distance2 = bone.analogRead(anPin2) / 20; // Read Right Sensor Data

  inputValue2 = distance2;
  runningSum2 = runningSum2 - sensorBuffer2[i] + inputValue2; // Calculate the sum of variables in the buffer
  sensorBuffer2[i] = inputValue2; // update buffer value
  runningAverage2 = (runningSum2 / 8);
  var2 = var2 + Math.pow((inputValue2 - runningAverage2), 2); // Calculate variance of buffer
  var2 = var2 / (n - 1);
    // where is var2 being declared

    
    
  // Circular buffer loop
  i++;
  if (i == 8) {
    i = 0;
  }

  // State 1
  if (runningAverage1 >= 100 && runningAverage2 >= 100) { // Assuming that if both are reading over 100 inches, There is no object in front
    objDetected = false;
  }

  // State 2
  else if ((runningAverage1 <= 18 && runningAverage1 > 9) || (runningAverage2 <= 18 && runningAverage2 > 9)) {
    objDetected = true; // Yes Object in Sight. Stop Vehicle
  }

  // State 3
  else if (var1 >= 10000 || runningAverage1 <= 9 || var2 >= 10000 || runningAverage2 <= 9) { // to detect extraneous values below 8 inchesvar1 >= 30 || runningAverage1 <= 9 || var1 >= 30 || runningAverage1 <= 9)
    objDetected = true; // Yes object in Sight. Stop Vehicle
  }  // variance is 3000. which is best for walking in front

  // State 4
  else {
    objDetected = false;
  }
  return objDetected;
}

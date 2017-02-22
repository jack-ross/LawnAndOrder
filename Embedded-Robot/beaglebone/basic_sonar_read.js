var b = require('bonescript');
var analogVoltage = 0;

//http://beagleboard.org/support/BoneScript/Ultrasonic_Sensor/
//TODO: Note - need to verify the readings 

/*The AN pin outputs a voltage with a scaling factor of (Vcc/512) per inch. 
Since the AIN pin has a maximum voltage capacity of 1.8V, 
we will set a voltage divider to account for that difference. 
With the voltage divider, a supply of 5V yields ~6.99mV/in. and 3.3V yields ~4.57mV/in. */


/* Check the sensor values every 2 seconds*/
setInterval(read, 2000);

function read(){
	//Make sure that this is an analog pin
	anPin = "P9_40"
    b.analogRead(anPin, printStatus);
}

function printStatus(x) {
    var distanceInches;
    analogVoltage = x.value*1.8; // ADC Value converted to voltage
    console.log('x.value = ' + analogVoltage); 
    distanceInches = analogVoltage / 0.00699;
    console.log("There is an object " + 
    parseFloat(distanceInches).toFixed(3) + " inches away.");
}

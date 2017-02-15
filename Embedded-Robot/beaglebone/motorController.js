"use strict";
//Pins
//make sure theyre init
//logger
var bone = require('octalbonescript');
const constants = require("./constants.js");

// distance to move is updated elsewhere
//Why did we have ticksRcheck? Why not just use ticksR/L
function move() {
	totalTicks = 0;
	var ticksToMove = distanceToGoal * TI_PER_CM;

	//Right is master, left is slave
	bone.analogWrite(motorR_forward, standard_speed);
	bone.digitalWrite(motorR_reverse, LOW);

	bone.analogWrite(motorL_forward, standard_speed);
	bone.digitalWrite(motorL_reverse, LOW);

	ticksL = 0;
	ticksR = 0;
	//move the entire distance
	while (totalTicks < ticksToMove) {
		//Log the ticks every 100 ms
		setInterval(function logTicks() {
			logger.log("L: " + ticksL + "\tR: " + ticksR);
		}, 100)

		//This will be threaded, updated on elsewhere
		//at the beggining of every loop we want to poll the client
		if ((ticksRcheck % 1000 === 0 || ticksLcheck % 1000 === 0) && totalTicks !== 0) {
			// TODO: these are set to TicksR and TicksL, but those are not reset in the callback
			//maybe get rid of the totalTicks != 0 too..
			getNextMsg();
		}
		//This could probably be more refined...
		//angle threshold
		if (abs(angleToGoal) > 30) {
			break;
		}
		//    while (read_sensors() || !permissionToMove) { // don't move while objected is detected
		//      Serial.println("NOT MOVING");
		//      analogWrite(motorL_forward, 0);
		//      analogWrite(motorR_forward, 0);
		//      client.poll();
		//    }
		ticksToMove = distanceToGoal * TI_PER_CM;
		// logger.log("ticks to move: ");
		// logger.log(ticksToMove);
		// logger.log("totalTicks ");
		// logger.log(totalTicks);
		EXTRA_TICKS = abs(1.2 * angleToGoal) * TICKS_PER_DEG_TURN; // normally no multiplier on the angle
		TURN_VEL = (EXTRA_TICKS + SPEED_TICKS) / SPEED_TICKS * standard_speed;

		//checks if we are going straight
		if (abs(ticksRcheck - ticksLcheck) === EXTRA_TICKS) {
			angleToGoal = 0;
			ticksRcheck = 0;
			ticksLcheck = 0;
		}

		if (angleToGoal > .5) { // angle desired requires robot to turn left
			bone.analogWrite(motorL_forward, standard_speed); // should be set to 128
			bone.analogWrite(motorR_forward, TURN_VEL);
			logger.log("Left speed  = " + standard_speed + "Right speed  = " + TURN_VEL);

			// step 1.
			// find extra amount of ticks required
			// step 2.
			// find the required speed to turn the error angle in .5 seconds

		} else if (angleToGoal < -.5) { // angle desired requires robot to turn right
			bone.analogWrite(motorR_forward, standard_speed); // should be set to 128
			bone.analogWrite(motorL_forward, TURN_VEL);
		} else { //else go straight
			int gap = (ticksR - ticksL); //difference normally multiplied by 2
			TURN_VEL = (gap + SPEED_TICKS) / SPEED_TICKS * standard_speed;
			bone.analogWrite(motorL_forward, TURN_VEL);
			bone.analogWrite(motorR_forward, 128);
		}
		//    printTickInfo();

		ticksRcheck = ticksR;
		ticksLcheck = ticksL;
		totalTicks = ticksR; //right is master
	}

	ticksRcheck = 0;
	ticksLcheck = 0;
}

function turn(degrees) {
	bone.analogWrite(motorR_forward, 0);
	bone.analogWrite(motorL_forward, 0);
	delay(50);
	
	var ticksToTurn;
	ticksR = 0;
	ticksL = 0;
	var ticksMovedR = 0, ticksMovedL = 0;

	//turing left will be a postive #
	//turning right will be -ve
	if (degrees < 0) {
		//spin left forawrd and right backwards
		ticksToTurn = abs(degrees) * TICKS_PER_DEG_TURN;
		//    turningMotorPin = motorL_forward;
		//    stationaryMotorPin = motorR_forward;
		bone.digitalWrite(motorL_forward, 128);
		bone.digitalWrite(motorL_reverse, LOW);

		bone.digitalWrite(motorR_forward, LOW);
		bone.analogWrite(motorR_reverse, 190);
		//    ticksMovedR = &ticksL;
	} else {
		//spin right forward, left backwards
		ticksToTurn = degrees * TICKS_PER_DEG_TURN;
		//    turningMotorPin = motorR_forward;
		//    stationaryMotorPin = motorL_forward;
		//    ticksMovedL = &ticksR;
		bone.digitalWrite(motorR_forward, 190);
		bone.digitalWrite(motorR_reverse, LOW);

		bone.digitalWrite(motorL_forward, LOW);
		bone.-analogWrite(motorL_reverse, 128);
	}
	logger.log("To turn"+ticksToTurn);
	
	var leftDone = false, rightDone = false;
	while (!leftDone || !rightDone) {
		//turn
		if (ticksL + 5 * TICKS_PER_DEG_TURN > ticksToTurn / 2 && !leftDone) {
			bone.analogWrite(motorL_forward, 0);
			bone.analogWrite(motorL_reverse, 0);
			leftDone = true;
		}
		if (ticksR > ticksToTurn / 2 && !rightDone) {
			bone.analogWrite(motorR_forward, 0);
			bone.analogWrite(motorR_reverse, 0);
			rightDone = true;
		}
	}
}


//this will waste clock cycles.
//change in the future
function delay(milliseconds) {
	var start = new Date().getTime();
	while ((new Date().getTime() - start) < milliseconds) {}
	alert("woke up!");
}
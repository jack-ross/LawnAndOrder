/*
 * MotorKnob
 *
 * A stepper motor follows the turns of a potentiometer
 * (or other sensor) on analog input 0.
 *
 * http://www.arduino.cc/en/Reference/Stepper
 * This example code is in the public domain.
 */

//#include <Bounce.h>

// set pin numbers:
const int buttonPin = PUSH2;     // the number of the pushbutton pin
const int ledPin =  RED_LED;      // the number of the LED pin

// Variables will change:
int ledState = HIGH;         // the current state of the output pin
int buttonState;             // the current reading from the input pin
int state = LOW;   // the previous reading from the input pin

// the following variables are long's because the time, measured in miliseconds,
// will quickly become a bigger number than can be stored in an int.
long lastDebounceTime = 0;  // the last time the output pin was toggled
long debounceDelay = 50;    // the debounce time; increase if the output flickers

byte led_output = GREEN_LED;
byte switch_input = P1_3;

byte motor1_forward = P2_4;
byte motor1_reverse = P2_5;

byte motor2_forward = P1_6;
byte motor2_reverse = P2_2;

//Bounce bouncer = Bounce(switch_input, 5); 

void setup()
{
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);

  pinMode(led_output, OUTPUT);
  pinMode(motor1_forward, OUTPUT);
  pinMode(motor1_reverse, OUTPUT);

  pinMode(motor2_forward, OUTPUT);
  pinMode(motor2_reverse, OUTPUT);

  pinMode(switch_input, INPUT_PULLUP);
}

int motor_speed = 128;
boolean old_state = true;

void loop() {
  // read the state of the switch into a local variable:
  int reading = digitalRead(buttonPin);

  // check to see if you just pressed the button 
  // (i.e. the input went from LOW to HIGH),  and you've waited 
  // long enough since the last press to ignore any noise:  

  // If the switch changed, due to noise or pressing:
  if (reading != state) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  } 
  
  if ((millis( ) - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:
    buttonState = reading;
  } 

  // set the LED using the state of the button:
  digitalWrite(ledPin, buttonState);

  // save the reading.  Next time through the loop,
  // it'll be the state:
  state = reading;

  if (state != old_state) {
    old_state = state;
  }

  move();
}

void move() {
    if (state) {
    analogWrite(motor1_forward, motor_speed);
    digitalWrite(motor1_reverse, LOW);

    analogWrite(motor2_forward, motor_speed);
    digitalWrite(motor2_reverse, LOW);
  } else {
    analogWrite(motor1_reverse, motor_speed);
    digitalWrite(motor1_forward, LOW);

    analogWrite(motor2_reverse, motor_speed);
    digitalWrite(motor2_forward, LOW);
  }
  delay(500);

    analogWrite(motor1_forward, 0);
    analogWrite(motor2_forward, 0);
  delay(1000);
  
}

/*
 * MotorKnob
 *
 * A stepper motor follows the turns of a potentiometer
 * (or other sensor) on analog input 0.
 *
 * http://www.arduino.cc/en/Reference/Stepper
 * This example code is in the public domain.
 */

byte ENABLE = P1_4;
byte M1D1 = P1_5;
byte NOTM1D2 = P2_0;
byte M1IN2 = P2_2;


void setup()
{

  pinMode(ENABLE, OUTPUT);
  pinMode(M1D1, OUTPUT);
  pinMode(NOTM1D2, OUTPUT);
  pinMode(M1IN2, OUTPUT);

    digitalWrite(ENABLE, HIGH);
    digitalWrite(M1D1, LOW);
    digitalWrite(NOTM1D2, HIGH);
    digitalWrite(M1IN2, LOW);

}

void loop() {
    analogWrite(M1IN2, 200);
}

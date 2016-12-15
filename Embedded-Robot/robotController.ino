/*

  Low power motor control pin out
  incoreperates sonar, MQQT, and PID controller to move

*/
//----------------MQTT server configs----------------
#include <ArduinoJson.h>
#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>

char ssid[] = "NETGEAR98";
char password[] = "luckyflute711";
char server[] = "192.168.1.111";
char ROBOT_TOPIC[] = "robot-1";

//Global variables for storing new packet info
unsigned long lastMsgRecvTime = 0, curMsgRecvTime = 1;
float distanceToGoal = 0, angleToGoal = 0;
bool permissionToMove = true;
bool recievedNewMsg = false;

unsigned int ticksRcheck = 0;
unsigned int ticksLcheck = 0;
unsigned int totalTicks = 0;

//functioned called when we call client.poll() and a message has arrived
void callback(char* topic, byte* payload, unsigned int length) {
  StaticJsonBuffer<2000> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char*)payload);

  // Test if parsing succeeds.
  if (!root.success()) {
    Serial.println("parseObject() failed");
//    client.publish("robot-channel-1", "failed parse command");
    return;
  }
  
  curMsgRecvTime = root["time"];

  //we have recieved the msot recent msg from the server
  if(curMsgRecvTime > lastMsgRecvTime){
    Serial.println("New msg");
    lastMsgRecvTime = curMsgRecvTime;
    distanceToGoal = root["distanceToGoal"];
    angleToGoal = root["angleToGoal"];
    permissionToMove = root["permissionToMove"];
    Serial.println(distanceToGoal);
    totalTicks=0;
    ticksRcheck = 0;
    ticksLcheck = 0;
    recievedNewMsg = true;
  }
  // Print values.
  Serial.println(distanceToGoal);
  Serial.println(angleToGoal);
  Serial.println(curMsgRecvTime);
}


WiFiClient wifiClient;
PubSubClient client(server, 1883, callback, wifiClient);


//----------------Motor and Encoders Pins----------------
//IN1 and 2 should go to the right motor
//Right motor is master, left motor is slave

//U4
#define ENCODER_AR 32
#define ENCODER_BR 11
#define motorR_forward 38
#define motorR_reverse 37
// U7
//in4 and in3 (on h bbridge) control left motor
#define ENCODER_AL 19
#define ENCODER_BL 17
#define motorL_forward 40
#define motorL_reverse 39

unsigned int ONE_REV = 3592; //encoder ticks
float WHEEL_CIRCUM = 25.1327; //centimeters
float TI_PER_CM =  ONE_REV / WHEEL_CIRCUM;
float TICKS_PER_DEG_REV = ONE_REV / 360;
float ROBOT_WIDTH = 22.8;
// ticks to rotate the robot 1 degree
float DEG_PER_REV = WHEEL_CIRCUM * 360 / 2 / PI / ROBOT_WIDTH; //degrees
float TICKS_PER_DEG_TURN = ONE_REV / DEG_PER_REV;

unsigned int ticksR = 0, ticksL = 0;

// SPEED @ 128 is 2124 ticks per half second
int SPEED_TICKS = 2124;

//TODO: maybe no caps
float TURN_VEL = 0;
unsigned int EXTRA_TICKS = 0;


//Define Variables we'll be connecting to
unsigned int standard_speed = 128;

////////////////////////////////////////////////////////////////////

// Sensor Variables

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

////////////////////////////////////////////////////////////////////

void setup() {
  Serial.begin(115200);
  //  delay(100);
  Serial.println("seteup");
  initPins();
  Serial.println("Pins");
  connectWifi();
  Serial.println("Wifi");
}

  /* //the variables below are temps
   float distance = 22.8; //new distance fromk nav
   if (first) {
     angleToGoal = 30;//new angle from nav
     first = false;
   } else {
     angleToGoal = 0;
   }
   */
/////////////////////////////////////////////////////////////////////
void getNextMsg(){
  client.publish("robot-ack-1", "ACK");
    while(!recievedNewMsg){
      client.poll();
      delay(30);
    }
    recievedNewMsg = false;
}

void loop() {
  updateMQTT();
  
   getNextMsg();
//     analogWrite(motorR_forward, 0);
//    analogWrite(motorL_forward, 0);
  //if the distance to goal is > 5 cm we will wait for the next goal
  if(abs(angleToGoal) > 30){
    //we want some time for the system to send us more data
    turn(angleToGoal); 
    delay(150);
  }
  else if(distanceToGoal > 5)
  {  
    move();
  }  
  //TODO: maybe?
  //delay(1000);
  
}

void initPins() {
  pinMode(ENCODER_AL, INPUT_PULLUP);
  pinMode(ENCODER_BL, INPUT_PULLUP);
  pinMode(motorL_forward, OUTPUT);
  pinMode(motorL_reverse, OUTPUT);

  pinMode(ENCODER_AR, INPUT_PULLUP);
  pinMode(ENCODER_BR, INPUT_PULLUP);
  pinMode(motorR_forward, OUTPUT);
  pinMode(motorR_reverse, OUTPUT);
  //encoder interrupts
  attachInterrupt(ENCODER_AR, encoderR_ISR, CHANGE);
  attachInterrupt(ENCODER_BR, encoderR_ISR, CHANGE);
  attachInterrupt(ENCODER_AL, encoderL_ISR, CHANGE);
  attachInterrupt(ENCODER_BL, encoderL_ISR, CHANGE);
}

void connectWifi() {
  // Start Ethernet with the build in MAC Address
  // attempt to connect to Wifi network:
  Serial.print("Attempting to connect to Network named: ");
  // print the network name (SSID);
  Serial.println(ssid);
  // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
  WiFi.begin(ssid, password);
  while ( WiFi.status() != WL_CONNECTED) {
    // print dots while we wait to connect
    Serial.print(".");
    delay(300);
  }

  Serial.println("\nYou're connected to the network");
  Serial.println("Waiting for an ip address");

  while (WiFi.localIP() == INADDR_NONE) {
    // print dots while we wait for an ip addresss
    Serial.print(".");
    delay(300);
  }

  Serial.println("\nIP Address obtained");
  // We are connected and have an IP address.
  // Print the WiFi status.
  printWifiStatus();
}

bool updateMQTT() {
  // Reconnect and resubscribe if the connection was lost
  if (!client.connected()) {
    Serial.println("Disconnected. Reconnecting....");
    if (!client.connect("energiaClient")) {
      Serial.println("Connection failed");
    } else {
      Serial.println("Connection success");

      if (client.subscribe(ROBOT_TOPIC)) {
  
        Serial.println("Subscription successfull");
      }
    }
  }
  //TODO: do we want to send anything back?
//  if (client.publish("robot-channel", "hello world")) {
//    //Serial.println("Publish success");
//  } else {
//    Serial.println("Publish failed");
//  }

  // Check if any message were received
  // on the topic we subsrcived to
//  client.poll();
  //TODO: do we need a delay?
  //  delay(1000);
}

/////////////////////////////////////////////////////////////////////
//This will stoop once the robot travels distance (cm)
void move(){ //Dist(float distance, float angle) {
//probably dont need this
  //we will have checked the messaage queue at this point (rigt before this)
//  while (read_sensors() || !permissionToMove) { // don't move while objected is detected
//    Serial.println("NOT MOVING");
//    analogWrite(motorL_forward, 0);
//    analogWrite(motorR_forward, 0);
//      client.poll();
//  }
Serial.println("moving");
  
  //input will be encoder turns
  float ticksToMove;//, totalTicks = 0;
  totalTicks = 0;
  ticksL = 0;
  ticksR = 0;
  ticksToMove = distanceToGoal * TI_PER_CM;
  Serial.print("TPC\t");
  Serial.println(TI_PER_CM);
  //Right is master, left is slave
  analogWrite(motorR_forward, standard_speed);
  digitalWrite(motorR_reverse, LOW);

  analogWrite(motorL_forward, standard_speed);
  digitalWrite(motorL_reverse, LOW);
  ticksL = 0;
  ticksR = 0;
  //move the entire distance
  while (totalTicks < ticksToMove) {
    
    //lastTime = curTime;
    Serial.print("L: ");
    Serial.print(ticksL);
    Serial.print("\tR: ");
    Serial.println(ticksR);
    //at the beggining of every loop we want to poll the client
//    if(totalTicks % 2000 == 0 && totalTicks != 0){
    if((ticksRcheck % 2000 == 0  || ticksLcheck % 2000 == 0 )  && totalTicks != 0){

       getNextMsg();
    }
       //angle threshold
      if(abs(angleToGoal) > 30){
        break;
      }
//    while (read_sensors() || !permissionToMove) { // don't move while objected is detected
//      Serial.println("NOT MOVING");
//      analogWrite(motorL_forward, 0);
//      analogWrite(motorR_forward, 0);
//      client.poll();
//    }
    ticksToMove = distanceToGoal * TI_PER_CM;
    Serial.print("ticks to move: ");
    Serial.println(ticksToMove);
    Serial.print("totalTicks ");
    Serial.println(totalTicks);
    EXTRA_TICKS = abs(1.2*angleToGoal) * TICKS_PER_DEG_TURN; // normally no multiplier on the angle
    TURN_VEL = (EXTRA_TICKS + SPEED_TICKS) / SPEED_TICKS * standard_speed;

    if (abs(ticksRcheck - ticksLcheck) == (int)EXTRA_TICKS) {
      angleToGoal = 0;
      ticksRcheck = 0;
      ticksLcheck = 0;
    }

    if (angleToGoal > .5) { // angle desired requires robot to turn left
      analogWrite(motorL_forward, standard_speed); // should be set to 128
      analogWrite(motorR_forward, TURN_VEL);
      Serial.print("Left speed  = ");
      Serial.print(standard_speed);
      Serial.println("Right speed  = ");
      Serial.println(TURN_VEL);
      // step 1.
      // find extra amount of ticks required
      // step 2.
      // find the required speed to turn the error angle in .5 seconds

    }
    else if (angleToGoal < -.5) { // angle desired requires robot to turn right
      analogWrite(motorR_forward, standard_speed); // should be set to 128
      analogWrite(motorL_forward, TURN_VEL);
    }
    else { //else go straight
      int gap = (ticksR - ticksL); //difference normally multiplied by 2
      TURN_VEL = (gap + SPEED_TICKS) / SPEED_TICKS * standard_speed;
      analogWrite(motorL_forward, TURN_VEL);
      analogWrite(motorR_forward, 128);
    }
//    printTickInfo();

    ticksRcheck = ticksR;
    ticksLcheck = ticksL;
    totalTicks = ticksR; //right is master
  }

  ticksRcheck = 0;
  ticksLcheck = 0;
  // TODO:
  //we have travelled the distance we need. wait until next goal
//  analogWrite(motorL_forward, 0);
//  analogWrite(motorR_forward, 0);
}

/////////////////////////////////////////////////////////////////////

void turn(float degrees) {
  Serial.println("turning");
  analogWrite(motorR_forward, 0);
  analogWrite(motorL_forward, 0);
  delay(50);
  int ticksToTurn;
//  , forwardMotorPin, backwardsMotorPin;
//  int controlMotorPin
  ticksR = 0;
  ticksL = 0;
  unsigned int* ticksMovedR, ticksMovedL;
  //either way, we want the reverse direction to be low

  //turing left will be a postive #
  //turning right will be -ve
  if (degrees < 0) {
    //spin left forawrd and right backwards
    ticksToTurn = abs(degrees) * TICKS_PER_DEG_TURN;
//    turningMotorPin = motorL_forward;
//    stationaryMotorPin = motorR_forward;
    digitalWrite(motorL_forward, 128);
    digitalWrite(motorL_reverse, LOW);
    
    digitalWrite(motorR_forward, LOW);
    analogWrite(motorR_reverse, 190);
//    ticksMovedR = &ticksL;
  }
  else {
    //spin right forward, left backwards
    ticksToTurn = degrees * TICKS_PER_DEG_TURN;
//    turningMotorPin = motorR_forward;
//    stationaryMotorPin = motorL_forward;
//    ticksMovedL = &ticksR;
    digitalWrite(motorR_forward, 190);
    digitalWrite(motorR_reverse, LOW);
    
    digitalWrite(motorL_forward, LOW);
    analogWrite(motorL_reverse, 128
    );
  }
  Serial.print("To turn");
  Serial.println(ticksToTurn);
  //just move the standard rate
//  analogWrite(turningMotorPin, 128);
//  analogWrite(stationaryMotorPin, 0);
  bool leftDone = false, rightDone = false;
  while (!leftDone || !rightDone) {
    //turn
    if(ticksL+5*TICKS_PER_DEG_TURN > ticksToTurn /2 && !leftDone){
       analogWrite(motorL_forward, 0);
       analogWrite(motorL_reverse, 0);
       leftDone = true;
    }
     if(ticksR > ticksToTurn /2 && !rightDone){
       analogWrite(motorR_forward, 0);
       analogWrite(motorR_reverse, 0);
       rightDone = true;
    }
  }
  Serial.println("Done Turn.");
}


//do subtraction and check if negative to account for the overflow
//----------- Interrupts --------------------
void encoderL_ISR() {
  ticksL++;
}

void encoderR_ISR() {
  ticksR++;
}

////////////////////////////////////////////////////////////////////

bool read_sensors() {

  // Sonar Sensor 1 Data
  distance1 = analogRead(anPin1) / 20; // Read Left Sensor Data

  // Circular Buffer
  inputValue1 = distance1;
  runningSum1 = runningSum1 - sensorBuffer1[i] + inputValue1; // Calculate the sum of variables in the buffer
  sensorBuffer1[i] = inputValue1; // update buffer value
  runningAverage1 = (runningSum1 / 8);
  var1 = var1 + pow((inputValue1 - runningAverage1), 2); // Calculate variance of buffer
  var1 = var1 / (n - 1);

  // Sonar Sensor 2 Data
  distance2 = analogRead(anPin2) / 20; // Read Right Sensor Data

  inputValue2 = distance2;
  runningSum2 = runningSum2 - sensorBuffer2[i] + inputValue2; // Calculate the sum of variables in the buffer
  sensorBuffer2[i] = inputValue2; // update buffer value
  runningAverage2 = (runningSum2 / 8);
  var2 = var2 + pow((inputValue2 - runningAverage2), 2); // Calculate variance of buffer
  var2 = var2 / (n - 1);

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


void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}



void printTickInfo() {
  // just printing
  Serial.println("Actual Extra Ticks = ");
  Serial.print(abs(ticksR - ticksL));
  Serial.println("Actual Turn = ");
  Serial.print(abs(ticksR - ticksL) / TICKS_PER_DEG_TURN);
  Serial.println();
  Serial.print("New PWM = [");
  Serial.print(TURN_VEL);
  Serial.print("]");
  Serial.println();
  Serial.print("pid_output_pwm = [");
  Serial.print(standard_speed);
  Serial.print("]");
  Serial.println();
}

#include <ArduinoJson.h>
#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>

char ssid[] = "NETGEAR98";
char password[] = "luckyflute711";
char server[] = "192.168.1.111";
StaticJsonBuffer<200> jsonBuffer;

void callback(char* topic, byte* payload, unsigned int length) {
  JsonObject& root = jsonBuffer.parseObject((char*)payload);

  // Test if parsing succeeds.
  if (!root.success()) {
    Serial.println("parseObject() failed");
    return;
  }

  float distanceToGoal = root["distanceToGoal"];
  float angleToGoal = root["angleToGoal"];
  long time = root["time"];

  // Print values.
  Serial.println(distanceToGoal);
  Serial.println(angleToGoal);
  Serial.println(time);
}

WiFiClient wifiClient;
PubSubClient client(server, 1883, callback, wifiClient);

void setup()
{
 
  Serial.begin(115200);
  connectWifi();
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

void loop()
{ 
  updateMQTT();
}

void updateMQTT() {
  // Reconnect if the connection was lost
  if (!client.connected()) {
    Serial.println("Disconnected. Reconnecting....");
    if(!client.connect("energiaClient")) {
      Serial.println("Connection failed");
    } else {
      Serial.println("Connection success");
      if(client.subscribe("robot-1")) {
        Serial.println("Subscription successfull");
      }
    }
  }
  
  if(client.publish("robot-channel","hello world")) {
    //Serial.println("Publish success");
  } else {
    Serial.println("Publish failed");
  }
 
  // Check if any message were received
  // on the topic we subsrcived to
  client.poll();
  delay(1000);
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
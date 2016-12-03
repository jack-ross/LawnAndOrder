# Capstone
Lawn and Order - Collection of Code, Resources, Docs, and Static website for UVA ECE Capstone

## Initialization
**Prerequisite**  
Working Redis Server on static IP that is known to all devices.  
**1. Map/Boundary is Set**  
User sets boundary position vectors for the work area.  

**2. Robot Comes Online**  
Once robot connects to central WiFi node, it is responsible for connecting to RedisDB and publishing 
it's unique identifing marker (UID) and name to channel `fieldObjects`. The robot will then subscribe to a channel entitled 
`fieldBot-<UID>`. It will recieve position vector on this channel.  

**3. Navigation Server**  
The navigation server must get from `map-configuration` to receive up to date boundary position vectors and subscribe to `system-updates` 
to receive updates whenever the map is changed to then pull from `map-configuration`.
Each object will come from CV server with a UID, which is read from marker on the robot. That UID will dictate which 
channel navigation info will be published to.   

**OpenCv**  
No configuration necessary. 


## Communications (subject to change)

Redis based message queue. There are three actors in the current network:  
**1. Computer Vision Server**  
*Input*: Video Feed of field  
*Output*: Publish, JSON Object describing field  
**2. Navigation Server**  
*Input*: Subscribe, JSON Object describing field  
*Output*: Publish, Robot Specific message containing position vector and theta angle  
**3. Robot**  
*Input*: Subscribe, message with postition vector and theta angle  
*Output*: Publish, error messages  
**4. UI**  
*Input*: Subscribe, Current Application State  
*Output*: Publish, field boundaries/Application Configuration

### Message Channels and Structures

**Field Objects**  
```JSON
{
    message: {
        objects: [{
            uid: 9183,
            position: {
                x: 412.4,
                y: 1235.9
            },
            angle: 358.8
        }]
    },  
    time: 12341234,
    sender: "cv-server"
}
```

**Robot Directions**  
```JSON
{
    message: {
        objects: [{
            uid: 9183,
            position: {
                x: 412.4,
                y: 1235.9
            },
            angle: 358.8
        }]
    },  
    time: 12348030,
    sender: "navigation-server"
}
```

# Capstone
Lawn and Order - Collection of Code, Resources, Docs, and Static website for UVA ECE Capstone


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

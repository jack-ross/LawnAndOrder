import numpy as np
import cv2
import cv2.aruco as aruco
import math
import time
import json
import paho.mqtt.client as mqtt

class MarkerMetaData:
    def __init__(self, id, center, rotation):
        self.id = id
        self.x = center[0]
        self.y = 1080 - center[1]
        self.rotation = rotation

'''
Given coordinages of 
        [ [x1,y1], [x2,y2], [x3,y3], [x4,y4] ]
        [x1, y1, x2, y2, x3, y3, x4, y4]
        [ 0,  1,  2,  3,  4,  5,  6,  7]
 *  where the corners are:
 *            top left    : x1, y1
 *            top right   : x2, y2
 *            bottom right: x3, y3
 *            bottom left : x4, y4
 '''
 #returns a float with the rotation
def getRotation(corners):
    # Get differences top left minus bottom left
    diffs = [corners[0][0] - corners[3][0], (-1*corners[0][1]) - (-1*corners[3][1])]

    #Get rotation in degrees
    rotation = math.atan(diffs[0]/diffs[1]) * 180 / math.pi

    # Adjust for 2nd & 3rd quadrants, i.e. diff y is -ve.
    if (diffs[1] < 0): 
        rotation += 180

    # Adjust for 4th quadrant
    # i.e. diff x is -ve, diff y is +ve
    elif (diffs[0] < 0): 
        rotation += 360
    # return array of [[centerX, centerY], rotation];
    #return [center, rotation];
    return rotation

#return a tuple with the (x,y) pixels of the center of the corners
def getCenter(corners):
    center = (int((corners[0][0] + corners[2][0]) / 2),
                  int(((corners[0][1] + corners[2][1]) / 2)+30))
    return center

#returm a dictionary corresponding to the JSON to be sent
def getJsonMessage(markersArray):
    objectsList = []
    #Store all the marker meta data in the list
    for marker in markersArray:
        objectDict = {}
        objectDict["uid"]= marker.id
        centerDict = {}
        centerDict["x"] =  marker.x
        centerDict["y"] = marker.y
        objectDict["position"] = centerDict
        objectDict["angle"] = marker.rotation
        objectsList.append(objectDict)

    curTime = time.time()
    sender = "cv-server"
    msg = {"message": {"objects": objectsList},"time": curTime,"sender": sender}
    return msg


def on_connect(client, userdata, flags, rc):
    global loop_flag
    print("HEY")
    loop_flag=0

def on_message(client, userdata, msg):
    print("recieved message")
    print(str(msg.payload))
    parsed = json.loads(str(msg.payload))
    x=parsed['x']
    y=parsed['y']
    global globTuple
    globTuple = (x,y)

'''
---------------------Main start-------------------------
'''
globTuple = (0,0)
if __name__ == "__main__":
    #------------Init redis connection------------
    mqttc = mqtt.Client("python_pub")
    mqttc.connect("::1", 1883, 60)
    mqttc.onconnect=on_connect
    mqttc.on_message = on_message
    mqttc.subscribe("nav-channel", 0)
    mqttc.loop(2)

    # loop_flag=1
    # counter=0
    # while loop_flag == 1:
    #     print(counter)
    #     time.sleep(.01)
    #     counter+=1

    channelName = "cv-channel"  

    # the publish method returns the number matching channel and pattern
    # subscriptions. 'my-first-channel' matches both the 'my-first-channel'
    # subscription and the 'my-*' pattern subscription, so this message will
    # be delivered to 2 channels/patterns
    #r.publish('my-first-channel', 'some data')


    ##------------Init computer vison------------
    cap = cv2.VideoCapture(1)

    while(True):
    # Capture frame-by-frame
        ret, frame = cap.read()
        # frame = cv2.resize(frame, (0,0), fx=0.7, fy=0.7)

        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        # frame = clahe.apply(frame)

        # # Parameters for manipulating image data
        # maxIntensity = 255.0
        # phi = 1
        # theta = 1
        
        # # Decrease intensity such that
        # # dark pixels become much darker, 
        # # bright pixels become slightly dark 
        # for i in xrange(0, frame[1][0]):
        #     frame[i][0] = (maxIntensity/phi)*(frame[i][0]/(maxIntensity/theta))**2
        


        # Our operations on the frame come here
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # apply adaptive histogram
        # gray = clahe.apply(gray)
        gray = cv2.equalizeHist(gray)
        # frame = gray
        aruco_dict = aruco.Dictionary_get(aruco.DICT_4X4_50)
        parameters =  aruco.DetectorParameters_create()

        corners, ids, rejectedImgPoints = aruco.detectMarkers(gray, aruco_dict, parameters=parameters)
        #print(corners, ids)
        if(ids is not None):
            #store the markers found in a list of MarkerMetaData objects 
            markers = []
            for i in xrange(len(ids)):
                curId = ids[i][0]
                if(curId != 1 and curId != 49 and curId != 0):
                    continue
                curCorners = corners[i][0]
                rotation = round(getRotation(curCorners), 3)
                center = getCenter(curCorners)
                markerData = MarkerMetaData(curId, center, rotation)
                markers.append(markerData)

                roationText = "Rotation: "+ str(rotation)
                cv2.putText(frame, roationText, center, cv2.FONT_HERSHEY_SIMPLEX, 1,(0,0,255),2)
                
                if curId == 0:
                    xText = "o"
                    textCenter = (int(center[0] + globTuple[0] - 20), int(center[1]-  globTuple[1]))
                    print("text center")
                    print(textCenter)
                    print("fiducial center")
                    print(center)
                    print("globTuple center")
                    print(globTuple)
                    cv2.putText(frame, xText, textCenter, cv2.FONT_HERSHEY_SIMPLEX, 2,(0,255,0),25)

            if(len(markers) > 0):
                #only go through the drawing if we found any markers
                #if(len(markers) > 0):
                markerJsonMsg = getJsonMessage(markers)
                #print(curId, center, rotation)
                #now have a list of all the markers in the frame
                #may manipulate more
                frame = aruco.drawDetectedMarkers(frame, corners, ids)
                #publish to redis channel
                mqttc.publish(channelName, str(markerJsonMsg))
                mqttc.loop(2)
                print(markerJsonMsg)

                
        #print(rejectedImgPoints)
        # Display the resulting frame


        frame = cv2.resize(frame, (0,0), fx=0.7, fy=0.7)
        cv2.imshow('frame',frame)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

        #check for escape
        if(cv2.waitKey(50) == 27):
            break

            
    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()

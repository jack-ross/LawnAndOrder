# -*- coding: utf-8 -*-
'''
detect markers

One class to detect . this can track and maintain markers currently seen
this class will be a part of the 

Will identifying markers will be different than corners?

Another class that sends unstaructured data via the redis database

Then a controller?
let the controller call detect shit. controlelr can also open the camera
'''
import numpy as np
import cv2
import cv2.aruco as aruco
import math
import time
import json

class MarkerMetaData:
	def __init__(self, id, center, rotation):
		self.id = id
		self.x = center[0]
		self.y = center[1]
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

def getCenter(corners):
	center = (int((corners[0][0] + corners[2][0]) / 2),
                  int(((corners[0][1] + corners[2][1]) / 2)+30))
	print center
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
		objectDict["angle"] marker.rotation
		objectsList.append(objectDict)

	curTime = time.time()
	sender = "cv-server"
	msg = {"message": {"objects": objectsList},"time": curTime,"sender": sender}
	return msg

'''
---------------------Main start-------------------------
'''
if __name__ == "__main__":
	frame = cv2.imread("test_tilt.png", 1)

	# Our operations on the frame come here
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	aruco_dict = aruco.Dictionary_get(aruco.DICT_4X4_50)
	parameters =  aruco.DetectorParameters_create()

	#lists of ids and the corners beloning to each id
	#note ids and corners have the same size
	corners, ids, rejectedImgPoints = aruco.detectMarkers(gray, aruco_dict, parameters=parameters)
	#This is array_type[marker[corners[coord[xy[]]]]
	'''Ex
	[array([[[  53.,   51.],
	        [ 752.,   51.],
	        [ 752.,  750.],
	        [  53.,  750.]]], dtype=float32)]
	        '''

	markers = []

	for i in xrange(len(ids[0])):
		curId = ids[0][i]
		curCorners = corners[0][i]
		rotation = int(getRotation(curCorners))
		center = getCenter(curCorners)
		markerData = MarkerMetaData(curId, center, rotation)
		markers.append(markerData)
		print(getJson(curId, center, rotation))

	#now have a list of all the markers in the frame
	#may manipulate more
	frame = aruco.drawDetectedMarkers(frame, corners, ids)

	roationText = "Rotaion: "+ str(rotation)
	cv2.putText(frame, roationText, center, cv2.FONT_HERSHEY_SIMPLEX, 1,(0,0,255),2)

	# Display the resulting frame
	cv2.imshow('frame',frame)
	cv2.waitKey(0) 

	# When everything done, release the capture
	#cap.release()
	cv2.destroyAllWindows()

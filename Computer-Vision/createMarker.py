import numpy as np
import cv2
import cv2.aruco as aruco


'''
    drawMarker(...)
        drawMarker(dictionary, id, sidePixels[, img[, borderBits]]) -> img

        This creates a marker with the # and size specified Size is in pixels
'''


aruco_dict = aruco.custom_dictionary(3,4)#Dictionary_get(aruco.DICT_4X4_50)
print(aruco_dict)
# second parameter is id number
# last parameter is total image size
img = aruco.drawMarker(aruco_dict, 2, 600)
cv2.imwrite("new_2_small.jpg", img)

cv2.imshow('frame',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
'use strict';

module.exports = Object.freeze({
    ClientId: 'navigation-server',
    OpenCvChannel: 'cv-channel',
    BoundaryConfigChannel: 'map-configuration',
    SystemNotificationChannel: 'system-updates',
    PixelsPerCentimeter: 5,
    RobotDimensions: {
        width: 22.86,
        height: 20.32
    },
    AllowedDistanceErrorCms: 14,
    CourseWidth: 1.7,
    NumberOfBots: 1,
    BoundaryJsonObject: {
        corners: {
            topLeft: {
                x: 10,
                y: 700
            },
            bottomLeft: {
                x: 10,
                y: 120
            },
            topRight: {
                x: 700,
                y: 700
            },
            bottomRight: {
                x: 700,
                y: 120
            }
        },
        mapFidicual: {
            x: 1,
            y: 1
        }
    },
    ECODER_AR : "P8_8";
    ENCODER_BR : "P8_10";
    motorR_forward : "P9_33";
    motorR_reverse : "P9_35";
    ECODER_AL : "P8_12";
    ENCODER_BL : "P8_14";
    motorL_forward : "P9_37";
    motorL_reverse : "P9_39";


});
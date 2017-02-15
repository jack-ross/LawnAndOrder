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
    }
});
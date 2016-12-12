'use strict';

module.exports = Object.freeze({
    ClientId: 'navigation-server',
    OpenCvChannel: 'cv-channel',
    BoundaryConfigChannel: 'map-configuration',
    SystemNotificationChannel: 'system-updates',
    PixelsPerCentimeter: 1.0,
    RobotDimensions: {
        width: 22.86,
        height: 20.32
    },
    AllowedDistanceErrorCms: 8,
    NumberOfBots: 1,
    BoundaryJsonObject: {
        corners: {
            topLeft: {
                x: 10,
                y: 300
            },
            bottomLeft: {
                x: 10,
                y: 10
            },
            topRight: {
                x: 600,
                y: 300
            },
            bottomRight: {
                x: 600,
                y: 0
            }
        },
        mapFidicual: {
            x: 10,
            y: 10
        }
    }
});
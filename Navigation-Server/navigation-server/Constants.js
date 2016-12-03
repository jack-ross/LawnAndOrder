'use strict';

module.exports = Object.freeze({
    RedisConfig: {
        host: "localhost",
        port: 6379
        // password: "password123"
    },
    OpenCvChannel: 'cv-channel',
    BoundaryConfigChannel: 'map-configuration',
    SystemNotificationChannel: 'system-updates',
    PixelsPerCentimeter: 1.0,
    RobotDimensions: {
        width: 22.86,
        height: 20.32
    }
});
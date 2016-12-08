"use strict";

const redisConfig = {
    host: "localhost",
    port: 6379,
    password: "password123"
};

const redis = require("redis")
    , subscriber = redis.createClient(redisConfig)
    , publisher = redis.createClient(redisConfig);

const openCvChannel = "cv-channel";

setInterval(publishTest, 1000);

function publishTest() {
    publisher.publish(openCvChannel, "test message");
}
// Subscribe to posts 

const redisConfig = {
    host: "localhost",
    port: 6379,
    password: "password123"
};

const redis = require("redis")
  , subscriber = redis.createClient(redisConfig)
  , publisher  = redis.createClient(redisConfig);

const openCvChannel = "cv-channel";

subscriber.on("message", function(channel, message) {
  console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
});

subscriber.subscribe(openCvChannel);

function calculateAction() {
    
}
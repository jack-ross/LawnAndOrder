var mosca = require('mosca')

var ascoltatore = {
  type: 'redis',
  redis: require('redis'),
  db: 0,
  port: 6379,
  return_buffers: true, // to handle binary payloads
  host: "localhost",
  channel: "cv-channel"
};

var moscaSettings = {
  port: 1883,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Redis
  }
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);     
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet);
});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}
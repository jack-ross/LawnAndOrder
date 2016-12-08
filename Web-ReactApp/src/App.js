import React, { Component } from 'react';
import mqtt from 'mqtt';
import logo from './logo.svg';
import './App.css';


const client  = mqtt.connect('ws://localhost:11883', "WebApp");

client.on('connect', function () {
  client.subscribe('cv-channel')
  client.publish('cv-channel', 'Hello Matt!')
});

client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
});

 

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

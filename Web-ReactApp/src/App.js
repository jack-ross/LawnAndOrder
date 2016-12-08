import React, { Component } from 'react';
import mqtt from 'mqtt';
import { Grid, Row, Col, Clearfix } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';


const client = mqtt.connect('ws://localhost:11883', "WebApp");

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
                    <h1><img src={logo} className="App-logo" alt="logo" />
                    Lawn and Order</h1>
                </div>

                <Grid>
                    <Row className="show-grid">
                        <Col xs={3} className="left-col"> Col 3 </Col>
                        <Col xs={9} className="right-col"> Col 9 </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default App;

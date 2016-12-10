import React, { Component } from 'react';
import mqtt from 'mqtt';
import 'antd/dist/antd.css';
import { Row, Col, Timeline, Card, Progress, Carousel, Table } from 'antd';
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


const dataSource = [{
  key: '1',
  data: 'Location: {25, 273}',
}, {
  key: '2',
  data: 'Distance: 3.7m',
}, {
  key: '3',
  data: 'Speed: 0.33 m/s',
}
];

const columns = [{
  title: 'Robot 1',
  dataIndex: 'data',
  key: 'data',
}];


// <Row>
//     <Card className="card" bodyStyle={{ padding: 0 }}>
//         <Carousel autoplay dots={false}>
//             <div>
//                 <Table dataSource={dataSource} columns={columns} pagination={false} />
//             </div>
//             <div>
//                 <Table dataSource={dataSource} columns={columns} pagination={false} />
//             </div>
//         </Carousel>
//     </Card>
// </Row>

class App extends Component {
    render() {
        return (
            <div className="App">

                <Row>
                    <Col span={18} className="main-col">
                        <div className="App-header">
                            <h1><img src={logo} className="App-logo" alt="logo" />
                                Lawn and Order</h1>
                        </div>
                    </Col>

                    <Col span={6} className="stats-col">

                        <Row>
                            <Card className="card" title="System Load">
                                <h3> Total </h3>
                                <Progress percent={63} status="active" />

                                <hr></hr>

                                <Row>
                                    <Col span={12}>
                                        <h4> OpenCv </h4>
                                        <Progress type="circle" percent={80} width={80} />
                                    </Col>
                                    <Col span={12}>
                                        <h4 align="center"> Nav </h4>
                                        <Progress type="circle" percent={50} width={80} />
                                    </Col>
                                </Row>
                            </Card>
                        </Row>
                        
                        <Row>
                            <Card className="card" title="Recent Messages">
                                <Timeline>
                                    <Timeline.Item color="green">
                                        <p><b>Navigation </b> <i>5:11.753</i></p>
                                        <p>Payload</p>
                                    </Timeline.Item>
                                    <Timeline.Item color="blue">
                                        <p><b>Roboto </b> <i>5:12.937</i></p>
                                        <p>Payload</p>
                                    </Timeline.Item>
                                    <Timeline.Item color="red">
                                        <p><b>OpenCV </b> <i>5:13.005</i></p>
                                        <p>Payload</p>
                                    </Timeline.Item>
                                </Timeline>
                            </Card>
                        </Row>
                        <Row>
                            <Card className="card" title="MQTT Count">
                                <h1> 10011 </h1>
                            </Card>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Card className="card" title="Frame Rate">
                                    <h2> 5 Hz </h2>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className="card" title="Frame Size">
                                    <h2> 640 x 480 </h2>
                                </Card>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;

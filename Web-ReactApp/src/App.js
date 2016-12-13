import React, { Component } from 'react';
import mqtt from 'mqtt';
import 'antd/dist/antd.css';
import { Row, Col, Timeline, Card, Progress, Carousel, Table } from 'antd';
import Scene from './Scene';
import logo from './logo.svg';
import './App.css';

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

const Header = () => (
  <Col span={18} className="main-col">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 display="inline-block">
        Lawn and Order</h1>
    </div>
  </Col>
);

const Stats = () => (
  <Row>
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
              <h4 style={{ textAlign: "center" }}> Nav </h4>
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
        <Card className="card" bodyStyle={{ padding: 0 }}>
          <Carousel autoplay dots={false}>
            <div>
              <Table dataSource={dataSource} columns={columns} pagination={false} />
            </div>
            <div>
              <Table dataSource={dataSource} columns={columns} pagination={false} />
            </div>
          </Carousel>
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
);

const generateBodies = () => {
  var bodies = [];
  for (var x = 0; x < 2; x++) {
    const rotation = Math.random() * Math.PI;
    const posX = 4 - (Math.random() * 8);
    const posY = 4 - (Math.random() * 8);
    //[((-4, 4), .25, (-4, 4)]
    bodies.push({
      id: x, position: [posX, .3, posY],
      goal: [posY, .5, posX], rotation: rotation
    });
  }
  return bodies;
}
var _this;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { bodies: generateBodies() };
    console.log(this.state, "!");
    this.currentState = 0;
    _this = this;
    // Subscribe to channels here, setState every time they update. Expects shape as defined in generateBodies

    this.client = mqtt.connect('ws://localhost:11883', { clientId: "web-app" });

    this.client.on('connect', function () {
      _this.client.subscribe('web-channel')
      _this.client.publish('web-channel', 'Hello Matt!')
    });

    this.client.on('message', function (topic, message) {
      // message is Buffer 
      var json = JSON.parse(message.toString());
      console.log(json);
    });
  }



  shouldComponentUpdate() {
    if (this.lastState !== this.currentState) {
      this.lastState = this.currentState++;
      return true;
    }
  }
  render() {
    console.log("rendering");
    return (
      <div className="App">
        <div className="map">
          <Scene bodies={this.state.bodies} width={1000} height={1000} />
        </div>
        <div className="overlay">
          <Header />
          <Stats />
        </div>
      </div>
    );
  }
}

export default App;

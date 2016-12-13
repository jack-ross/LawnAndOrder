import React, { Component } from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import Dimensions from 'react-dimensions';

const backVector = new THREE.Vector3(0, 0, -1);
const dragPlane = new THREE.Plane();

class RoboScene extends React.Component {
  constructor(props, context) {
    super(props, context);

    const N = 100;

    this._raycaster = new THREE.Raycaster();

    this.fog = new THREE.Fog(0x001525, 10, 40);

    const d = 20;

    this.lightPosition = new THREE.Vector3(d, d, d);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
                                     .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    this.cameraPosition = new THREE.Vector3(15, 2, -2); 
    this.cameraQuaternion = new THREE.Quaternion()
                                     .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);


    const bodies = this.props.bodies || [];

    const meshRefs = [];

    let constrainedBody;
    let pivot;

    this.state = {
      bodies: bodies
    };

    this.meshes = [];
  }

  componentDidMount() {
    const {
      container,
    } = this.refs;
  }

  componentDidUpdate(newProps) {

    const {
      containerWidth,
      containerHeight,
    } = this.props;

    const width = containerWidth,
          height = containerHeight;
  }

  shouldComponentUpdate() {
    return true;
  }
  componentWillReceiveProps() {
    this.setState({bodies: this.props.bodies});
  }

  render() {
    const {
      containerWidth,
      containerHeight,
    } = this.props;

    const width = containerWidth,
          height = containerHeight;

    const {
      bodies
    } = this.state;

    const d = 20;

    const cubeMeshes = bodies.map(({ position, rotation, id }) => (
      <mesh
          key={id}
          position={new THREE.Vector3(position[0], position[1], position[2])}
          rotation={new THREE.Euler(0, rotation, 0)}>
      <geometryResource
        resourceId="cubeGeo"
      />
      <materialResource
        resourceId={"cubeMaterial"+id}
      />
      </mesh>
    ));
    const goalMeshes = bodies.map(({goal, id}) => (
      <mesh
          key={"goal"+id}
          position={new THREE.Vector3(goal[0], goal[1], goal[2])}>
        <sphereGeometry radius={.1} widthSegments={20} heightSegments={20}/>
        <meshBasicMaterial color={id === 1 ? 0x002F6C : 0xE57200} />
      </mesh>
    )
    );
    console.log(goalMeshes);

    return (<div
                ref="container"
            >
        <React3
            antialias
            mainCamera="camera"
            width={width}
            height={height}

            onAnimate={this._onAnimate}

            clearColor={this.fog.color}

            gammaInput
            gammaOutput
            shadowMapEnabled
        >
          <resources>
            <boxGeometry
                resourceId="floor"

                width={10}
                height={15}
                depth={0.5}

                widthSegments={1}
                heightSegments={1}
            />
            <boxGeometry
                resourceId="cubeGeo"

                width={1}
                height={0.25}
                depth={1}

                widthSegments={10}
                heightSegments={10}
            />
            <meshPhongMaterial
                resourceId="cubeMaterial1"

                color={0x002F6C}
            /> 
            <meshPhongMaterial
                resourceId="cubeMaterial0"

                color={0xE57200}
            />
          </resources>
          <scene
              ref="scene"
              fog={this.fog}
          >
            <perspectiveCamera
                name="camera"
                fov={60}
                aspect={width / height}
                near={0.5}
                far={100}

                position={this.cameraPosition}
                quaternion={this.cameraQuaternion}

                ref="camera"
            />
            <ambientLight
                color={0x666666}
            />
            <directionalLight
                color={0xffffff}
                intensity={1.75}

                castShadow

                shadowMapWidth={1024}
                shadowMapHeight={1024}

                shadowCameraLeft={-d}
                shadowCameraRight={d}
                shadowCameraTop={d}
                shadowCameraBottom={-d}

                shadowCameraFar={3 * d}
                shadowCameraNear={d}

                position={this.lightPosition}
                lookAt={this.lightTarget}
            />
            <mesh
                castShadow
                receiveShadow

                quaternion={this.groundQuaternion}
            >
              <geometryResource
                  resourceId="floor"
              />
              <meshLambertMaterial
                  color={0x777777}
              />
            </mesh>
            {cubeMeshes}
            {goalMeshes}
          </scene>

        </React3>
    </div>);
  }
}

export default Dimensions()(RoboScene);

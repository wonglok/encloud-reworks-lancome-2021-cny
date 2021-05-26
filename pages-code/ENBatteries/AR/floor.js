import {
  // BoxBufferGeometry,
  Camera,
  CircleBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  ShadowMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneBufferGeometry,
  Raycaster,
  RingBufferGeometry,
  ShaderMaterial,
  DirectionalLight,
  CameraHelper,
  AdditiveBlending,
  // SphereBufferGeometry,
  Vector2,
  Vector3,
  PCFSoftShadowMap,
  SphereBufferGeometry,
} from "three";
import { OrbitControls } from "three-stdlib";
import { FolderName } from ".";
// import { enableBloom } from "../../Bloom/Bloom";
import { canUseDeviceOrientationControls } from "../../ENCloudSDK/ENUtils";

export const title = `${FolderName}.floor`;

export const effect = async (node) => {
  let camera = await node.ready.camera;
  let scene = await node.ready.scene;
  let renderer = await node.ready.gl;
  let raycaster = await node.ready.raycaster;
  let mouse = await node.ready.mouse;

  //
  camera.position.z = -7.5;
  camera.position.y = 5.5;
  camera.lookAt(0, 0, 0);

  new Floor({ node });

  // window.addEventListener(
  //   "add-object-many-times",
  //   ({ detail: { birthPlace, cameraPosition } }) => {
  //     new Item({ node, birthPlace, cameraPosition });
  //   }
  // );
};

// export class Item {
//   constructor({ node, birthPlace, cameraPosition }) {
//     this.node = node;
//     this.birthPlace = birthPlace;
//     this.cameraPosition = cameraPosition;
//     this.setup();
//   }
//   async setup() {
//     let scene = await this.node.ready.scene;
//     let camera = await this.node.ready.camera;
//     let renderer = await this.node.ready.gl;
//     let raycaster = await this.node.ready.raycaster;
//     let mouse = await this.node.ready.mouse;

//     let item = new Mesh(
//       new SphereBufferGeometry(0.5, 32, 32),
//       new MeshStandardMaterial({
//         metalness: 1.0,
//         roughness: 0.1,
//       })
//     );
//     item.position.y += 0.5;

//     enableBloom(item);

//     item.position.copy(this.birthPlace);
//     item.lookAt(this.cameraPosition);

//     scene.add(item);
//     this.node.onClean(() => {
//       scene.remove(item);
//     });
//     //
//   }
// }

export class Floor {
  constructor({ node }) {
    this.node = node;
    this.setup();
  }
  async setup() {
    let scene = await this.node.ready.scene;
    let camera = await this.node.ready.camera;
    let renderer = await this.node.ready.gl;
    let raycaster = await this.node.ready.raycaster;
    let mouse = await this.node.ready.mouse;

    // let renderer = this.node.userData.gl;
    // let scene = this.node.userData.scene;
    // let camera = this.node.userData.camera;

    //
    let o3 = new Object3D();
    scene.add(o3);
    this.node.onClean(() => {
      scene.remove(o3);
    });

    let raycasterList = [];
    let geo = new PlaneBufferGeometry(20000, 20000, 2, 2);
    geo.rotateX(Math.PI * -0.5);

    let mesh = new Mesh(
      geo,
      new ShaderMaterial({
        fragmentShader: `
          void main (void) {
            discard;
          }
        `,
      })
    );
    o3.add(mesh);

    raycasterList.push(mesh);

    let makeDoughnut = () => {
      let cubeGeo = new RingBufferGeometry(8.8, 9.5, 36.0, 6.0);
      cubeGeo.scale(0.05, 0.05, 0.05);
      cubeGeo.rotateX(Math.PI * -0.5);
      let target = new Vector3();

      let yellow = new Color("#FFE7C7");
      let red = new Color("#ff0000");
      let cubeMat = new MeshBasicMaterial({
        color: new Color("#FFE7C7"),
        transparent: true,
        opacity: 0.4,
      });

      let circleGeo = new CircleBufferGeometry(8.8 - 1.6, 36);
      circleGeo.scale(0.05, 0.05, 0.05);
      circleGeo.rotateX(Math.PI * -0.5);
      circleGeo.translate(0, 0.03, 0.0);
      let circle = new Mesh(circleGeo, cubeMat);
      //
      o3.add(circle);

      let cube = new Mesh(cubeGeo, cubeMat);
      o3.add(cube);
      cube.position.set(0, 0.1, -2.5 + 1.0);

      //
      this.node.onLoop(() => {
        let time = window.performance.now() * 0.001;

        if (target.length() > 25) {
          //
          window.dispatchEvent(
            new CustomEvent("distance", { detail: { mode: "far-away" } })
          );
          cubeMat.color = red;
        } else {
          //
          window.dispatchEvent(
            new CustomEvent("distance", { detail: { mode: "ok" } })
          );
          cubeMat.color = yellow;
        }

        circle.position.lerp(target, 0.3);
        circle.position.y = (Math.sin(time * 1.8) + 1) * 0.5 * 0.3;

        cube.position.lerp(target, 0.3);
        cube.position.y = (Math.sin(time * 1.8) + 1) * 0.5 * 0.3;
      });

      window.addEventListener("center-cursor", ({ detail }) => {
        // cube.position.x = detail.x
        // cube.position.z = detail.z
        target.x = detail.x;
        target.y = detail.y;
        target.z = detail.z;
      });

      window.addEventListener("on-stop-add", () => {
        cube.visible = false;
        circle.visible = false;

        cube.scale.set(0.0, 0.0, 0.0);
        circle.scale.set(0.0, 0.0, 0.0);
        cubeMat.opacity = 0.0;
      });

      this.node.onClean(() => {
        cube.visible = false;
        circle.visible = false;

        cube.scale.set(0.0, 0.0, 0.0);
        circle.scale.set(0.0, 0.0, 0.0);
        cubeMat.opacity = 0.0;
      });
    };
    makeDoughnut();
    let mouseCenter = new Vector2(0, 0);
    let raycasterSim = new Raycaster();
    let currentBornLocation = new Vector3(0, 0, 0);
    const scanCenter = () => {
      mouseCenter.x = 0.5 * 2 - 1;
      mouseCenter.y = -(0.5 + 0.0) * 2 + 1;

      raycasterSim.setFromCamera(mouseCenter, camera);
      var intersects = raycasterSim.intersectObjects(raycasterList);
      for (var i = 0; i < intersects.length; i++) {
        let pt = intersects[i].point;
        currentBornLocation.copy(pt);
        window.dispatchEvent(new CustomEvent("center-cursor", { detail: pt }));
      }
    };

    //

    let currentType = "lancome-key-visual";

    let parent = renderer.domElement.parentNode;
    let makeButton = () => {
      let button = document.createElement("div");

      button.innerHTML = "Place Item";
      button.style.cssText = `
        color: rgb(255, 209, 139);
        background-color: rgb(191, 33, 33);

        position: absolute;
        bottom: 30px;
        left: calc(50% - 100px);
        padding: 10px 0px;
        width: 200px;
        border-radius: 20px;
        text-align: center;
        font-size: 25px;
        cursor: pointer;
        user-select: none;
      `;

      parent.appendChild(button);
      console.log(button);
      this.node.onClean(() => {
        button.remove();
        //
      });

      window.addEventListener("on-stop-add", () => {
        button.remove();
      });

      //
      let onClickAdd = () => {
        window.dispatchEvent(
          new CustomEvent("add-object-one-time", {
            detail: {
              type: currentType,
              birthPlace: currentBornLocation.clone(),
              cameraPosition: camera.position.clone(),
            },
          })
        );

        //
        window.dispatchEvent(
          new CustomEvent("on-stop-add", {
            detail: {
              birthPlace: currentBornLocation.clone(),
              cameraPosition: camera.position.clone(),
            },
          })
        );
        button.removeEventListener("click", onClickAdd);
        // domElement.removeEventListener("touchstart", onClickAdd);
      };
      button.addEventListener("click", onClickAdd);
      //
    };

    makeButton();

    // domElement.addEventListener("touchstart", addItemOnce);

    let stopScanning = false;
    this.node.onLoop(() => {
      if (stopScanning) {
        return;
      }
      scanCenter();
    });
    window.addEventListener("on-stop-add", () => {
      stopScanning = true;
    });

    if (canUseDeviceOrientationControls) {
      window.addEventListener(
        "camera-rotation",
        ({ detail: { rotation, quaternion } }) => {
          if (quaternion) {
            camera.quaternion.slerp(quaternion, 0.2);
          }
        }
      );
    } else {
      let fakeCam = new Camera();
      fakeCam.position.copy(camera.position);
      fakeCam.rotation.copy(camera.rotation);

      let controls = new OrbitControls(fakeCam, renderer.domElement);
      controls.update();

      controls.enableDamping = true;
      controls.enablePan = true;
      controls.enableRotate = true;
      controls.enableZoom = true;

      this.node.onLoop(() => {
        controls.update();
        camera.rotation.copy(fakeCam.rotation);
        camera.position.copy(fakeCam.position);
      });

      window.addEventListener(
        "add-object-one-time",
        ({ detail: { birthPlace, cameraPosition } }) => {
          //
          controls.target.copy(birthPlace);
        }
      );
    }

    //

    let dirLightShadow = () => {
      //Create a WebGLRenderer and turn on shadows in the renderer
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap; // default PCFShadowMap
      // renderer.shadowMap.type = PCFShadowMap; // default PCFShadowMap

      //Create a DirectionalLight and turn on shadows for the light
      const light = new DirectionalLight(0xffffff, 0.1);
      light.castShadow = true; // default false
      scene.add(light);
      this.node.onClean(() => {
        scene.remove(light);
      });

      light.position.x = 100;
      light.position.y = 100;
      light.position.z = 0;

      //Set up shadow properties for the light
      light.shadow.radius = 2;
      light.shadow.mapSize.width = 256; // default
      light.shadow.mapSize.height = 256; // default
      light.shadow.camera.near = 0.1; // default
      light.shadow.camera.far = light.position.length() * 1.5; // default

      light.shadow.camera.left = -50;
      light.shadow.camera.right = 50;
      light.shadow.camera.top = 50;
      light.shadow.camera.bottom = -50;

      // light.shadow.camera.updateProjectionMatrix();

      // console.log(light.shadow.camera);
      this.node.onLoop(() => {
        light.shadow.camera.position.copy(camera.position);
        light.shadow.camera.rotation.copy(camera.rotation);
      });

      //Create a plane that receives shadows (but does not cast them)
      const planeGeometry = new PlaneBufferGeometry(500, 500, 2, 2);
      planeGeometry.rotateX(Math.PI * -0.5);

      const planeMaterial = new ShadowMaterial({
        opacity: 0.5,
      });
      const plane = new Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;
      plane.position.y = -0.01;

      scene.add(plane);
      this.node.onClean(() => {
        scene.remove(plane);
      });

      //Create a helper for the shadow camera (optional)
      // const helper = new CameraHelper(light.shadow.camera);
      // scene.add(helper);
      // this.node.onClean(() => {
      //   scene.remove(helper);
      // });
    };

    dirLightShadow();
  }
}

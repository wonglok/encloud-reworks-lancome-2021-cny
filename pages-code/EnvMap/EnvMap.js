import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import {
  BackSide,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry,
  sRGBEncoding,
} from "three";
import { PMREMGenerator, TextureLoader } from "three";

export function EnvMap() {
  // let RGBELoader = require("three/examples/jsm/loaders/RGBELoader.js")
  //   .RGBELoader;
  let url = `/texture/cayley_interior_4k.jpg`;
  let { scene, gl } = useThree();
  // let chroma = new ShaderCubeChrome({ res: 128, renderer: gl });
  // useEffect((state, dt) => {
  //   chroma.compute({ time: dt });
  //   scene.environment = chroma.out.envMap;
  // }, []);

  useEffect(() => {
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    let loader = new TextureLoader();
    // loader.setDataType(UnsignedByteType);
    loader.load(url, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      envMap.encoding = sRGBEncoding;
      scene.background = envMap;
      scene.environment = envMap;
    });

    let ball = new SphereBufferGeometry(100, 32, 32);
    let mapper = new MeshStandardMaterial({
      //
      //
      map: loader.load(url),
      roughness: 1,
      metalness: 0,
      side: BackSide,
    });

    //
    // mapper.map.encoding = sRGBEncoding;

    let ballMesh = new Mesh(ball, mapper);
    scene.add(ballMesh);

    return () => {
      scene.remove(ballMesh);
      scene.environment = null;
      scene.background = null;
    };
  }, []);

  //

  return null;
}

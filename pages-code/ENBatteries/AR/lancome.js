import { Object3D } from "three";
import { FolderName } from ".";
import { LanternKV } from "./internals/LanternKV";
import { sleep } from "../../ENCloudSDK/ENUtils";
export const title = `${FolderName}.lancome`;

export const effect = async (node) => {
  let renderer = await node.ready.gl;
  let scene = await node.ready.scene;
  // add-object-one-time

  let url2021 = `https://lancomecny2021.oss-cn-shenzhen.aliyuncs.com/model/lancome_online_latest/lantern_2021.glb`;

  let keyVisual = new LanternKV({
    ctx: {
      onLoop: node.onLoop,
      renderer: renderer,
    },
    loop: false,
    // url: `https://lancomecny2021.oss-cn-shenzhen.aliyuncs.com/model/extracted/Lancome_CNY_ARKOL-processed.glb`,
    //url: `/model/lancome_latest/extracted/Lancome_CNY_ARKOL-processed.glb`,
    //url: `/model/lancome_latest/Lancome_CNY_ARKOL.glb`,
    url: url2021,

    // tex: {
    //   redMap: `https://lancomecny2021.oss-cn-shenzhen.aliyuncs.com/lancome_v002_1201_AR_KOL_FileCollection/Bottle_Texture/Bottle_Red.png`,
    //   redEnvMap: `https://lancomecny2021.oss-cn-shenzhen.aliyuncs.com/lancome_v002_1201_AR_KOL_FileCollection/Bottle_Texture/lanc_env_Red.jpg`,

    //   blueMap: `https://lancomecny2021.oss-cn-shenzhen.aliyuncs.com/lancome_v002_1201_AR_KOL_FileCollection/Bottle_Texture/Bottle_Blue_B.png`,
    //   blueEnvMap: `https://lancomecny2021.oss-cn-shenzhen.aliyuncs.com/lancome_v002_1201_AR_KOL_FileCollection/Bottle_Texture/lanc_env_White.jpg`,
    // }
  });

  let container = new Object3D();
  container.add(keyVisual.group);
  container.scale.set(0.2, 0.2, 0.2);
  node.onClean(() => {
    scene.remove(container);
  });
  window.addEventListener(
    "add-object-one-time",
    async ({ detail: { type, birthPlace, cameraPosition } }) => {
      //

      container.position.copy(birthPlace);
      cameraPosition.y = container.position.y = 0;
      container.lookAt(cameraPosition);
      scene.add(container);

      await sleep(2 * 1000);

      window.dispatchEvent(new CustomEvent("click-start-animation"));
    }
  );
};

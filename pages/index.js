import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Head from "next/head";
import { useEffect, useRef } from "react";
import Bloom from "../pages-code/Bloom/Bloom";
import { ENRuntime, BASEURL_REST } from "../pages-code/ENCloudSDK/ENRuntime";
import {
  authoriseOrientationCam,
  canUseDeviceOrientationControls,
  makeShallowStore,
} from "../pages-code/ENCloudSDK/ENUtils";
import { EnvMap } from "../pages-code/EnvMap/EnvMap";
import { initWebcam, VideoMap } from "../pages-code/EnvMap/VideoEnvMap";

let getProjectJSON = () => {
  return {
    published: true,
    displayName: "encloud-reworks-lancome-2021-cny",
    _id: "60adb83b15bd4300099d75e1",
    username: "wonglok831",
    userID: "609b49ad59f39c00098c34ea",
    slug: "encloud-reworks-lancome-2021-cny",
    created_at: "2021-05-26T02:53:47.682Z",
    updated_at: "2021-05-26T02:54:16.704Z",
    __v: 0,
    largeString:
      '{"_id":"60adb83b15bd4300099d75e1","blockers":[{"_id":"_4jvtynivned87v9kui","position":[273.4078445495033,7.230497278518541e-15,-32.56326484923949],"title":"AR.lancome"},{"_id":"_wu05k62vm9vmxxblni","position":[-269.59089056783904,-0.000001220703140347723,-91.03824477846885],"title":"AR.floor"}],"ports":[{"_id":"_ns6114wj7uyfhf485q","type":"input","idx":0,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_cg55hts76eg5q47q2e","type":"input","idx":1,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_04gddh06ylh9difu6p","type":"input","idx":2,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_vm55jovcbiz81d97dx","type":"input","idx":3,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_f5uhg3ywczb0xgzol4","type":"input","idx":4,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_0a8191oqbo3i65rj3x","type":"output","idx":0,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_0bu693knxbd87zxpko","type":"output","idx":1,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_kha7q59wyzdooxog01","type":"output","idx":2,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_mywzgun10cdurnz4k3","type":"output","idx":3,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_vdoqfmtlo6yksvwcl5","type":"output","idx":4,"blockerID":"_4jvtynivned87v9kui"},{"_id":"_up2mx5rysn25uou80n","type":"input","idx":0,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_n0zr0ppvtg3otzhimc","type":"input","idx":1,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_bk4lgq2wll0kaxhch8","type":"input","idx":2,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_xmxtbgr35ukh47o5uo","type":"input","idx":3,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_0a3h667t2xcpm3j5r0","type":"input","idx":4,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_1rf7x69kh9gi6g5ryg","type":"output","idx":0,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_3a8yw4vz49bgmgl4kz","type":"output","idx":1,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_ze9d3h23e7l3rn1g24","type":"output","idx":2,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_umcakdmnvyd0m9rh2l","type":"output","idx":3,"blockerID":"_wu05k62vm9vmxxblni"},{"_id":"_bs1gv6aqwsogdgwz2e","type":"output","idx":4,"blockerID":"_wu05k62vm9vmxxblni"}],"connections":[],"pickers":[]}',
  };
};

let loadBattriesInFolder = () => {
  let enBatteries = [];
  let reqq = require.context("../pages-code/ENBatteries/", true, /\.js$/);
  let keys = reqq.keys();
  keys.forEach((key) => {
    enBatteries.push(reqq(key));
  });
  return enBatteries;
};

function EffectNode({ projectJSON }) {
  let three = useThree();

  useEffect(() => {
    let enRunTime = new ENRuntime({
      projectJSON: projectJSON,
      enBatteries: loadBattriesInFolder(),
      userData: {
        ...three,
      },
    });

    Object.entries(three).forEach(([key, val]) => {
      enRunTime.mini.set(key, val);
    });

    return () => {
      enRunTime.mini.clean();
    };
  }, []);

  return null;
}

export async function getStaticProps(context) {
  let project = getProjectJSON();
  let projectID = project._id;
  let buildTimeCache = await fetch(
    `${BASEURL_REST}/project?action=get-one-of-published`,
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ _id: projectID }),
      method: "POST",
      mode: "cors",
    }
  )
    //
    .then((res) => {
      return res.json();
    });

  return {
    props: {
      buildTimeCache,
    }, // will be passed to the page component as props
  };
}

function WelcomeScreen() {
  let startGame = () => {
    if (canUseDeviceOrientationControls) {
      authoriseOrientationCam();
    }
    HomeState.overlay = "none";
    // initWebcam(document.querySelector("#videofeed"));
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-90">
      <div className="p-4 tracking-wide">
        <div className="text-2xl text-bold mb-4">
          Research based Rework of Lancôme APAC Chinese New Year 2021
        </div>

        <div className="mb-5">
          <div className="text-xl text-gray-600 mb-2">Campaign Credits:</div>
          <div className="px-3 text-sm  tracking-tight ">
            <div className="mb-1">
              Digital Creatives & Design: AIR, Chika Tsang, Penny Lau, Fung
              Leung, Anna Lee, Anka So, Ray Chan, Kylie Yiu, Katherine Ngai, Fo
              Wong
            </div>
            <div className="mb-1">
              Web AR Game Development: AIR Concepts, Gary Ng, Tony Chau, Lok
              Lok, Kezman Hung
            </div>
            <div className="mb-1">Game Developers: Tony Chau, Kezman Hung,</div>
            <div className="mb-1">Game visual effect: Lok Lok</div>
            <div className="mb-1">
              Producer: Gary Ng, Chloe Ho, Charlotte Ho
            </div>
            <div className="mb-1">Back Stage @AIR: Ken Hui, Denny Wong</div>
          </div>
        </div>

        {/* reworks credit */}
        <div className="mb-5">
          <div className="text-xl text-gray-600 mb-2">Reworks Credit:</div>
          <div className="px-3 text-sm  tracking-tight ">
            <div className="mb-1">Logic Redesign: Lok Lok</div>
          </div>
        </div>

        {/* reworks login */}
        <div className="mb-5">
          <div className="text-xl text-gray-600 mb-2">Lets Go!</div>
          <div className="px-3 text-sm  tracking-tight ">
            <div
              className="mb-1 text-2xl underline cursor-pointer"
              onClick={() => {
                startGame();
              }}
            >
              Start Game
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

let HomeState = makeShallowStore({
  overlay: "welcome",
});

export default function Home({ buildTimeCache }) {
  HomeState.makeKeyReactive("overlay");
  return (
    <div className={"h-full w-full"}>
      <Head>
        <title>
          Research based Rework of Lancôme APAC Chinese New Year 2021
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Canvas dpr={typeof window !== "undefined" && window.devicePixelRatio}>
        {/*  */}
        <EffectNode
          projectJSON={buildTimeCache || getProjectJSON()}
        ></EffectNode>

        {/*  */}
        <ambientLight intensity={0.2}></ambientLight>

        {/*  */}
        <EnvMap></EnvMap>
        {/* <VideoMap></VideoMap> */}

        {/* <gridHelper args={[100, 50]}></gridHelper> */}

        <Bloom></Bloom>
      </Canvas>

      {/*  */}
      <video
        style={{ zIndex: "-1", opacity: 0.000001 }}
        className=" absolute top-0 bottom-0 left-0 z-auto"
        muted
        playsInline
        id="videofeed"
      ></video>

      {HomeState.overlay === "welcome" && <WelcomeScreen></WelcomeScreen>}
    </div>
  );
}

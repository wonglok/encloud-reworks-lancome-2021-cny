// let glsl = (v, ...args) => {
//   let str = "";
//   v.forEach((e, i) => {
//     str += e + (args[i] || "");
//   });
//   return str;
// };

import * as THREE from "three";
import anime from "animejs/lib/anime.es.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// const dat = require('dat.gui');

const BLACK_SCENE = require("../../../Bloom/Bloom.js").ENTIRE_SCENE;
const BLOOM_SCENE = require("../../../Bloom/Bloom.js").BLOOM_SCENE;

export class LanternKV {
  constructor({ ctx, loop, url, tex }) {
    this.ctx = ctx;

    this.group = new THREE.Object3D();
    this.loop = loop;
    this.totalReady = 1;
    this.readyCounter = 0;
    new GLTFLoader().load(
      url,
      (gltf) => {
        this.gltf = gltf;
        this.goReady();

        // this.ready = true
        // this.readyCounter++
        // if (this.readyCounter >= this.totalReady) {
        //   this.goReady()// = true
        // }
      },
      () => {},
      (err) => {
        console.error(err);
        console.log(url);
      }
    );

    //
    // const pmremGenerator = new THREE.PMREMGenerator( ctx.renderer );
    // pmremGenerator.compileEquirectangularShader();

    // this.blueMap = new TextureLoader().load(tex.blueMap, () => {
    //   // this.readyCounter++
    //   // if (this.readyCounter >= this.totalReady) {
    //   //   this.goReady()// = true
    //   // }
    // })

    // this.blueEnvMap = new TextureLoader().load(tex.blueEnvMap, (texture) => {
    //   const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
    //   this.blueEnvMap = envMap
    //   // this.readyCounter++
    //   // if (this.readyCounter >= this.totalReady) {
    //   //   this.goReady()// = true
    //   // }
    // })

    // this.redMap = new TextureLoader().load(tex.redMap, () => {
    //   // this.readyCounter++
    //   // if (this.readyCounter >= this.totalReady) {
    //   //   this.goReady()// = true
    //   // }
    // })

    // this.redEnvMap = new TextureLoader().load(tex.redEnvMap, (texture) => {
    //   const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
    //   this.redEnvMap = envMap

    //   // this.readyCounter++
    //   // if (this.readyCounter >= this.totalReady) {
    //   //   this.goReady()// = true
    //   // }

    // })
  }
  goReady() {
    this.traverse({ ctx: this.ctx, gltf: this.gltf });
    this.setup({ ctx: this.ctx, gltf: this.gltf });
    this.ready = true;
  }

  onReady({ callback }) {
    let tt = setInterval(() => {
      if (this.ready) {
        clearInterval(tt);
        callback(this);
      }
    }, 0);
  }

  // changeToBlue () {
  //   this.gltf.scene.traverse((item) => {
  //     if (item.material && item.material.name === 'LC_Bottle_Blue_V02:Blue_Bottle') {
  //       let mapping = item.material.map.mapping
  //       item.material.map = this.blueMap
  //       item.material.map.flipY = false
  //       item.material.map.mapping = mapping
  //       // item.material.needsUpdate = true
  //     }
  //     if (item.material && item.material.name === 'LC_Bottle_Blue_V02:Bottle_c_blue') {
  //       item.material.envMap = this.blueEnvMap
  //       // item.material.needsUpdate = true
  //     }
  //   })
  // }
  // changeToRed () {
  //   this.gltf.scene.traverse((item) => {
  //     if (item.material && item.material.name === 'LC_Bottle_Blue_V02:Blue_Bottle') {
  //       let mapping = item.material.map.mapping
  //       item.material.map = this.redMap
  //       // item.material.map.encoding = THREE.sRGBEncoding
  //       item.material.map.flipY = false
  //       item.material.map.mapping = mapping
  //       // item.material.needsUpdate = true
  //     }
  //     if (item.material && item.material.name === 'LC_Bottle_Blue_V02:Bottle_c_blue') {
  //       item.material.envMap = this.redEnvMap
  //       // item.material.needsUpdate = true
  //     }
  //   })
  // }
  // hideHook () {
  //   this.gltf.scene.traverse((item) => {
  //     if (item.name === 'fokZero_basePIV') {
  //       item.visible = false
  //     }
  //   })
  // }
  // showHook () {
  //   this.gltf.scene.traverse((item) => {
  //     if (item.name === 'fokZero_basePIV') {
  //       item.visible = true
  //     }
  //   })
  // }

  //

  traverse({ ctx, gltf }) {
    gltf.scene.traverse((item) => {
      if (item && item.material) {
        item.geometry.computeVertexNormals();
        if (item.material.map) {
          item.material.map.generateMipmaps = true;
          item.material.map.needsUpdate = true;
          // item.material.map.anisotropy = ctx.renderer.getMaxAnisotropy()
        }
      }
    });

    gltf.scene.traverse((item) => {
      if (item && item.name === "Box") {
        item.traverse((sub) => {
          if (sub && sub.material) {
            sub.material.transparent = false;
            sub.material.opacity = 1;
            sub.material.envMapIntensity = 0.25;
          }
        });
      }
    });

    gltf.scene.traverse((item) => {
      if (item && item.name === "Text_Box2") {
        item.traverse((sub) => {
          if (sub && sub.material) {
            sub.material.transparent = false;
            sub.material.opacity = 1;
            sub.material.envMapIntensity = 0.25;
          }
        });
      }
    });

    gltf.scene.traverse((item) => {
      if (item && item.name === "locator2_eff") {
        item.traverse((sub) => {
          if (sub && sub.material) {
            sub.material.transparent = true;
            sub.material.opacity = 0;
          }
        });
      }
    });

    gltf.scene.traverse((item) => {
      if (item.name === "Bottle") {
        item.visible = false;
      }
    });

    // // gltf.scene.userData.noBloom = true
    gltf.scene.traverse((item) => {
      if (item.isMesh) {
        item.frustumCulled = false;
      }

      if (item && item.name === "Bottle") {
        item.traverse((sub) => {
          if (sub && sub.material) {
            // sub.geometry.computeVertexNormals()
            sub.layers.enable(BLACK_SCENE);
            // sub.layers.enable(ENTIRE_SCENE)
          }
        });
      }

      if (item && item.name === "LC_Rose_new_petal_org") {
        item.traverse((sub) => {
          if (sub && sub.material) {
            // sub.geometry.computeVertexNormals()
            sub.layers.enable(BLACK_SCENE);
            // sub.layers.enable(ENTIRE_SCENE)
          }
        });
      }

      if (item && item.name === "Box") {
        item.traverse((sub) => {
          if (sub && sub.material) {
            sub.castShadow = true;
            sub.layers.enable(BLACK_SCENE);
          }
        });
      }
      if (item && item.name === "Text_Box2") {
        item.traverse((sub) => {
          if (sub && sub.material) {
            sub.castShadow = true;
            sub.layers.enable(BLACK_SCENE);
          }
        });
      }

      // 金色字
      if (item.material && item.material.name === "GLSL_Beauti") {
        item.material.transparent = true;
        item.material.opacity = 0.0;
        item.layers.enable(BLOOM_SCENE);
        item.material.color = new THREE.Color("#FDEFB5");
      }
      // 美麗辛福
      if (item.material && item.material.name === "GLSLShader6") {
        item.material.transparent = true;
        item.material.opacity = 1.0;

        item.layers.enable(BLOOM_SCENE);
        item.material.color = new THREE.Color("#FDEFB5");
      }
      if (item.material && item.material.name === "GLSLShader7") {
        item.layers.enable(BLOOM_SCENE);
        item.material.color = new THREE.Color("#FDEFB5");

        if (window._type === "i2" && window._res === "normal") {
          item.material.roughness = 0.25;
          // item.material.color = new THREE.Color('#ff9f1a')
          // item.material.emissive = new THREE.Color('#ff9f1a')
        }
      }

      // final sentence
      if (item.material && item.material.name === "GLSLShader8") {
        // item.material.transparent = false
        // item.material.opacity = 1.0
        // item.material.blending = THREE.AdditiveBlending
        item.layers.enable(BLOOM_SCENE);
        item.material.color = new THREE.Color("#FDEFB5");
        // item.material.emissive = new THREE.Color('#121212')
        // if (IS_ANDROID) {
        //   item.material.emissive = new THREE.Color('#FDEFB5')
        // }
        item.renderOrder = 10;
        // item.material.emissive = new THREE.Color('#FDEFB5').offsetHSL(0.0, 0.1, -0.1)

        if (window._type === "i2" && window._res === "normal") {
          item.material.roughness = 0.25;
          // item.material.color = new THREE.Color('#ff9f1a')
          // item.material.emissive = new THREE.Color('#ff9f1a')
        }
      }

      if (item.material && item.material.name === "GLSLShader9") {
        // item.material.transparent = false
        // item.material.opacity = 1.0
        // item.material.blending = THREE.AdditiveBlending
        item.layers.enable(BLOOM_SCENE);
        item.material.color = new THREE.Color("#FDEFB5");
        // item.material.emissive = new THREE.Color('#121212')
        // if (IS_ANDROID) {
        //   item.material.emissive = new THREE.Color('#FDEFB5')
        // }
        item.renderOrder = 10;

        if (window._type === "i2" && window._res === "normal") {
          item.material.roughness = 0.25;
          // item.material.color = new THREE.Color('#ff9f1a')
          // item.material.emissive = new THREE.Color('#ff9f1a')
        }

        // item.material.emissive = new THREE.Color('#FDEFB5').offsetHSL(0.0, 0.1, -0.1)
      }

      // blue area of the bottle
      if (item.material && item.material.name === "EFF_GLB") {
        item.layers.enable(BLOOM_SCENE);
        item.material.opacity = 0.0;
        // item.material.blending = THREE.AdditiveBlending
      }
    });
  }

  setup({ ctx, gltf }) {
    let stuff = gltf.scene;
    this.group.add(stuff);

    // animation stuff
    var mixer = new THREE.AnimationMixer(stuff);
    var clock = new THREE.Clock();
    function update() {
      mixer.update(clock.getDelta());
    }
    ctx.onLoop(() => {
      update();
    });

    var clips = gltf.animations;
    //console.log(clips.map(e => e.name))

    /*
      //

      0 "idle"
      1 "StartA"
      2 "StartB"
      3 "Word_fadeOut"
      4 "BlueBottle_fadeIn"
      5 "Effect"
      6 "Flower_scaleup"
      7 "Bottle_switch"
      8 "Bottle_flow"
      9 "Eff_fadeOut"
      10 "End"

      */
    let play = async (name) => {
      var clip = THREE.AnimationClip.findByName(clips, name);
      mixer.stopAllAction();

      var action = mixer.clipAction(clip);
      action.repetitions = 1;
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, clip.duration * 1000);
        action.play();
      });
    };

    let getDuration = (name) => {
      var clip = THREE.AnimationClip.findByName(clips, name);
      return clip.duration * 1000;
    };

    let sleep = (name) => {
      let duration = getDuration(name);
      return new Promise((resolve) => {
        setTimeout(resolve, duration);
      });
    };

    let playAll = async () => {
      // this.changeToBlue()
      // anims.shift() //
      // anims.shift() //
      // let name = anims.shift()

      // fade out lantern

      // setTimeout(() => {
      //   window.dispatchEvent(new CustomEvent('fade-out-lantern', { detail: {} }))
      // }, 6 * 1000)

      // window.dispatchEvent(new CustomEvent('play-env-particles', { detail: {} }))

      stuff.traverse((item) => {
        // 2021
        if (item.material && item.material.name === "GLSL_Beauti") {
          item.material.transparent = true;
          item.material.opacity = 1.0;
        }

        setTimeout(() => {
          if (item.name === "C_2") {
            item.visible = false;
          }
        }, 4000);

        setTimeout(() => {
          if (item.name === "Text_04Cow_A_4") {
            item.visible = false;
          }
          // if (item.name === 'Text_04super_A_4') {
          //   item.visible = false
          // }
        }, 8 * 1000);

        // 美麗辛福
        if (item.material && item.material.name === "GLSLShader6") {
          item.material.transparent = true;
          item.material.opacity = 1.0;
        }
      });

      await play("Event");

      // window.dispatchEvent(new CustomEvent('fade-out-text', { detail: {} }))
      // window.dispatchEvent(new CustomEvent('play-words-particles', { detail: {} }))

      // await play('Word_fadeOut')
      // await play('BlueBottle_fadeIn')
      // await play('Word_fadeOut')
    };

    // window.addEventListener('finish-fade-out-play-words-particles', async () => {
    //   // ----
    //   window.dispatchEvent(new CustomEvent('play-ball', { detail: {} }))
    //   window.dispatchEvent(new CustomEvent('fade-in-ball', { detail: {} }))

    //   // ----
    //   await play('Effect')
    //   await play('Flower_scaleup')

    //   this.changeToRed()
    //   await play('Bottle_switch')
    //   await play('Bottle_flow')

    //   // window.dispatchEvent(new CustomEvent('play-bottle-buttons', { detail: {} }))
    //   window.dispatchEvent(new CustomEvent('fade-out-ball', { detail: {} }))
    //   window.dispatchEvent(new CustomEvent('fade-out-whiteball', { detail: {} }))
    //   await play('Eff_fadeOut')

    //   await play('End')
    // })

    // let playAnimation = (name) => {
    //   if (name === 'StartA') {
    //     setTimeout(() => {
    //       this.changeToBlue()
    //     }, 300)
    //   }
    //   /**
    //     //6s dim dim yellow pratilce more yellow

    //    */
    //   if (name === 'StartB') {
    //     window.dispatchEvent(new CustomEvent('play-env-particles', { detail: {} }))
    //     play(name, () => {
    //       let next = anims.shift()
    //       playAnimation(next)
    //     })
    //   }

    //   if (name === 'Word_fadeOut') {
    //     window.dispatchEvent(new CustomEvent('fade-out-text', { detail: {} }))
    //     window.dispatchEvent(new CustomEvent('play-words-particles', { detail: {} }))
    //     setTimeout(() => {
    //       window.dispatchEvent(new CustomEvent('bottle-fade-in', { detail: {} }))
    //     }, 1000 * 3)
    //     play(name, () => {
    //       let next = anims.shift()
    //       playAnimation(next)
    //     })
    //   }
    //   //
    //   // mm make it at 9s

    //   if (name === 'BlueBottle_fadeIn') {
    //
    //   }

    //   if (name === 'Effect') {
    //     window.dispatchEvent(new CustomEvent('play-ball', { detail: {} }))
    //     window.dispatchEvent(new CustomEvent('fade-in-ball', { detail: {} }))
    //   }

    //   if (name === 'Bottle_switch') {
    //     this.changeToRed()
    //   }

    //   if (name === 'Bottle_flow') {
    //   }

    //   if (name === 'Eff_fadeOut') {
    //     window.dispatchEvent(new CustomEvent('fade-out-play-words-particles', { detail: {} }))
    //     // window.dispatchEvent(new CustomEvent('play-bottle-buttons', { detail: {} }))
    //     window.dispatchEvent(new CustomEvent('fade-out-ball', { detail: {} }))
    //     window.dispatchEvent(new CustomEvent('fade-out-whiteball', { detail: {} }))
    //   }

    //   // play(name)
    // }

    let skipLoop = true;
    let anims = clips.map((e) => e.name);

    // mixer.addEventListener('finished', () => {
    //   if (skipLoop) {
    //     return
    //   }
    //   let name = anims.shift()
    //   if (name) {
    //     playAnimation(name)
    //   } else {
    //     if (window.loopAnimation) {
    //       window.dispatchEvent(new CustomEvent('restart-animation', { detail: {} }))
    //     }
    //   }
    // })

    // let slowDownStop = false

    window.addEventListener("on-add-object", () => {
      let anims = clips.map((e) => e.name);

      play(anims[0]);
      skipLoop = true;
    });

    window.addEventListener("fade-out-lantern", () => {
      gltf.scene.traverse((item) => {
        if (item && item.name === "Box") {
          item.traverse((sub) => {
            if (sub && sub.material) {
              let tween = { amount: 1 };
              anime({
                amount: 0,
                targets: [tween],
                easing: "linear",
                duration: 500,
                begin: () => {},
                update: () => {
                  sub.material.transparent = true;
                  sub.material.opacity = tween.amount;
                },
                complete: () => {
                  item.visible = false;
                },
              });
            }
          });
        }
      });
    });

    window.addEventListener("click-start-animation", () => {
      skipLoop = false;

      anims = clips.map((e) => e.name);
      playAll();
    });

    window.addEventListener("restart-animation", () => {
      anims = clips.map((e) => e.name);
      playAll();
    });

    window.addEventListener("wave-fade-in", () => {
      let object = { amount: 0 };
      anime({
        amount: 1,
        targets: [object],
        easing: "linear",
        duration: 500,
        begin: () => {},
        update: () => {
          gltf.scene.traverse((item) => {
            if (item && item.name === "locator2_eff") {
              item.traverse((sub) => {
                if (sub && sub.material) {
                  sub.material.transparent = true;
                  sub.material.opacity = object.amount;
                }
              });
            }
          });
        },
        complete: () => {},
      });
    });

    window.addEventListener("bottle-fade-in", () => {
      let bottle = gltf.scene.getObjectByName("Bottle");
      bottle.visible = true;
      bottle.traverse((item) => {
        if (item.material) {
          item.material.transparent = true;
          item.material.opacity = 0;
          item.material.needsUpdate = true;
        }
      });

      let object = { amount: 0 };
      let finalAmount = 1.0;
      anime({
        amount: finalAmount,
        targets: [object],
        easing: "linear",
        duration: 500,
        begin: () => {},
        update: () => {
          bottle.traverse((item) => {
            if (item.material) {
              item.material.transparent = true;
              item.material.opacity = object.amount;
              item.material.needsUpdate = true;
            }
          });
        },
        complete: () => {
          bottle.traverse((item) => {
            if (item.material) {
              item.material.transparent = false;
              item.material.opacity = finalAmount;
              item.material.needsUpdate = true;
            }
          });
          bottle.traverse((item) => {
            if (
              item.material &&
              item.material.name === "LC_Bottle_Blue_V02:Blue_Bottle"
            ) {
              item.material.transparent = true;
              item.material.needsUpdate = true;
            }
          });
        },
      });
    });

    window.addEventListener("fade-out-whiteball", () => {
      gltf.scene.traverse((item) => {
        if (item.material && item.material.name === "EFF_GLB") {
          let val = { value: 1 };
          anime({
            value: 0,
            targets: [val],
            easing: "linear",
            duration: 1000,
            begin: () => {},
            update: () => {
              item.material.transparent = true;
              item.material.opacity = val.value;
            },
            complete: () => {},
          });
        }
      });
    });

    window.addEventListener("fade-out-text", () => {
      gltf.scene.traverse((item) => {
        if (item.material && item.material.name === "GLSL_Beauti") {
          let val = { value: 1 };
          anime({
            value: 0,
            targets: [val],
            easing: "linear",
            duration: 500,
            begin: () => {},
            update: () => {
              item.material.transparent = true;
              item.material.opacity = val.value;
            },
            complete: () => {},
          });
        }
      });
    });

    window.addEventListener("restart-animation", () => {
      setTimeout(() => {
        gltf.scene.traverse((item) => {
          if (item.material && item.material.name === "GLSL_Beauti") {
            item.material.transparent = true;
            item.material.opacity = 1.0;
          }
        });
        let bottle = gltf.scene.getObjectByName("Bottle");
        bottle.visible = false;
      }, 10);
    });

    // window.addEventListener('stop-all', () => {
    //   mixer.stopAllAction()
    // })
  }
}

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// // 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
export function useThree() {
  //创建一个场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  //创建一个相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  // camera.lookAt(15, 15, 15)
  camera.position.set(10, 10, 10)
  //创建一个渲染器
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 1
  document.body.appendChild(renderer.domElement)

  // 添加世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(15)
  scene.add(axesHelper)
  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 添加网格辅助器
  const gridHelper = new THREE.GridHelper(50, 50)
  gridHelper.material.opacity = 0.3
  gridHelper.material.transparent = true
  scene.add(gridHelper)

  const clock = new THREE.Clock()
  let mixer: any = null
  let currentStatus: any
  const animate = () => {
    const delta = clock.getDelta()

    if (mixer) mixer.update(delta)
    controls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  // rgbeLoader 加载hdr贴图
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
    // 设置球形贴图
    // envMap.mapping = THREE.EquirectangularReflectionMapping;
    envMap.mapping = THREE.EquirectangularRefractionMapping
    // 设置环境贴图
    // scene.background = envMap;
    scene.background = new THREE.Color(0xcccccc)
    // 设置环境贴图
    scene.environment = envMap
  })

  // 实例化加载器gltf
  const gltfLoader = new GLTFLoader()
  // 实例化加载器draco
  const dracoLoader = new DRACOLoader()
  // 设置draco路径
  dracoLoader.setDecoderPath('./draco/')
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load('./model/hilda_regular_00.glb', gltf => {
    scene.add(gltf.scene)
    mixer = new THREE.AnimationMixer(gltf.scene)
    const walkAnimation = mixer.clipAction(gltf.animations[37])
    const runAnimation = mixer.clipAction(gltf.animations[27])
    const idlAnimation = mixer.clipAction(gltf.animations[6])
    const posAnimation = mixer.clipAction(gltf.animations[23])
    currentStatus = idlAnimation
    const eventObj = {
      stopAll: () => {
        mixer.stopAllAction()
      },
      play: () => {
        console.log(mixer)

        mixer._actions.forEach((action: any) => {
          action.play()
        })
      },
      walk: () => {
        walkAnimation.enabled = true
        walkAnimation.setEffectiveTimeScale(1)
        walkAnimation.setEffectiveWeight(1)
        walkAnimation.play()
        currentStatus.crossFadeTo(walkAnimation, 0.5, true)
        currentStatus = walkAnimation
      },
      run: () => {
        runAnimation.enabled = true
        runAnimation.setEffectiveTimeScale(1)
        runAnimation.setEffectiveWeight(1)
        runAnimation.play()
        currentStatus.crossFadeTo(runAnimation, 0.5, true)

        currentStatus = runAnimation
      },
      pos: () => {
        posAnimation.enabled = true

        posAnimation.setEffectiveTimeScale(1)
        posAnimation.setEffectiveWeight(1)
        posAnimation.play()
        currentStatus.crossFadeTo(posAnimation, 0.5, true)

        currentStatus = posAnimation
      },
      idle: () => {
        idlAnimation.enabled = true
        idlAnimation.setEffectiveTimeScale(1)
        idlAnimation.setEffectiveWeight(1)
        idlAnimation.play()

        currentStatus.crossFadeTo(idlAnimation, 0.5, true)
        currentStatus = idlAnimation
      },
    }
    const gui = new GUI()
    gui.add(eventObj, 'stopAll')
    gui.add(eventObj, 'play')
    gui.add(eventObj, 'walk')
    gui.add(eventObj, 'run')
    gui.add(eventObj, 'pos')
    gui.add(eventObj, 'idle')
  })
}

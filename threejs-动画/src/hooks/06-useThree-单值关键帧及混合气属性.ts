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
  camera.position.set(15, 15, 15)
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
  let mixer2: any = null
  const animate = () => {
    const delta = clock.getDelta()

    if (mixer) mixer.update(delta)
    if (mixer2) mixer2.update(delta)
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
  //创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0xff33ff,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.name = 'cube'
  scene.add(cube)
  //创建位移关键帧
  const positionKF = new THREE.VectorKeyframeTrack(
    'cube.position',
    [0, 1, 2, 3, 4],
    [0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0]
  )

  //设置三个旋转角度
  const quaternion1 = new THREE.Quaternion()
  quaternion1.setFromEuler(new THREE.Euler(0, 0, 0))
  const quaternion2 = new THREE.Quaternion()
  quaternion2.setFromEuler(new THREE.Euler(0, 0, Math.PI))
  const quaternion3 = new THREE.Quaternion()
  quaternion3.setFromEuler(new THREE.Euler(0, 0, 0))
  const allQuaternion = quaternion1.toArray().concat(quaternion2.toArray(), quaternion3.toArray())
  console.log(allQuaternion)
  //创建旋转关键帧
  const quaternionKF = new THREE.QuaternionKeyframeTrack('cube.quaternion', [0, 2, 4], allQuaternion)
  //创建布尔关键帧
  const boolKF = new THREE.BooleanKeyframeTrack('cube.visible', [0, 1, 2, 3, 4], [true, false, true, false, true])
  // 创建颜色关键帧
  const colorKF = new THREE.ColorKeyframeTrack('cube.material.color', [0, 2, 4], [1, 0, 1, 0, 1, 0, 1, 0, 1])
  mixer = new THREE.AnimationMixer(cube)
  // 创建动画剪辑
  const clip = new THREE.AnimationClip('move', 4, [positionKF, quaternionKF, colorKF])
  // 创建动画播放
  const action = mixer.clipAction(clip)
  action.play()

  // 实例化加载器gltf
  const gltfLoader = new GLTFLoader()
  // 实例化加载器draco
  const dracoLoader = new DRACOLoader()
  // 设置draco路径
  dracoLoader.setDecoderPath('./draco/')
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load('./model/moon.glb', gltf => {
    console.log(gltf.scene)

    scene.add(gltf.scene)
    const mesh = gltf.scene

    material.transparent = true
    // const moon = mesh.getObjectByName('defaultMaterial')
    mixer2 = new THREE.AnimationMixer(mesh)
    mixer2.time = 2
    mixer2.timeScale = 2
    //创建数值关键帧
    const opacityKF = new THREE.NumberKeyframeTrack(
      'defaultMaterial.material.opacity',
      [0, 1, 2, 3, 4],
      [1, 0.5, 0, 0.5, 1]
    )
    const positionKF = new THREE.VectorKeyframeTrack('defaultMaterial.position', [0, 2, 4], [0, 0, 0, 0, 4, 0, 0, 0, 0])
    //创建动画剪辑
    const clip = new THREE.AnimationClip('opacity', 4, [opacityKF, positionKF])
    const action = mixer2.clipAction(clip)
    console.log(action)

    action.play()
    const eventObj = {
      stopAllAnimation: () => {
        mixer2.stopAllAction()
      },
      play: () => {
        action.play()
        mixer2.setTime(3)
      },
      timeScale: 2,
    }
    const gui = new GUI()
    gui.add(eventObj, 'stopAllAnimation').name('停止动画')
    gui.add(eventObj, 'play').name('播放动画')
    gui
      .add(eventObj, 'timeScale', 0, 5)
      .name('播放速度')
      .onChange(val => {
        mixer2.timeScale = val
      })
  })
}

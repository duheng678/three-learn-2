import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// // 导入draco解码器
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
export function useThree() {
  //创建一个场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  //创建一个相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5
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
  //创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0xff33ff,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.name = 'cube'
  scene.add(cube)
  //创建位移动画
  const positionKF = new THREE.VectorKeyframeTrack('cube.position', [0, 1, 2, 3], [0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0])
  mixer = new THREE.AnimationMixer(cube)
  // 创建动画剪辑
  const clip = new THREE.AnimationClip('move', 4, [positionKF])
  // 创建动画播放
  const action = mixer.clipAction(clip)
  action.play()
}

import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import dat from 'dat.gui'
import basicVertexShader from './shader/flyLight/vertex.glsl'
import basicFragmentShader from './shader/flyLight/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
//创建场景
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 2)
scene.add(camera)

//创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.2

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.1
controls.maxPolarAngle = Math.PI
controls.minPolarAngle = Math.PI * 0.75
//创建辅助坐标轴
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

//加载图片
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./src/assets/ca.jpeg')

const planeShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  // transparent: true,
  uniforms: {},
})

// 加载hdr环境图片
const hdrLoader = new RGBELoader()
hdrLoader.loadAsync('/2k.hdr').then(texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})
let lightBox = null
const gltfLoader = new GLTFLoader()
gltfLoader.load('./src/assets/model/flyLight.glb', gltf => {
  // scene.add(gltf.scene)
  console.log(gltf)
  lightBox = gltf.scene.children[0]
  lightBox.material = planeShaderMaterial

  for (let i = 0; i < 150; i++) {
    let flyLight = gltf.scene.clone(true)
    let x = (Math.random() - 0.5) * 300
    let z = (Math.random() - 0.5) * 300
    let y = Math.random() * 60 + 25
    flyLight.position.set(x, y, z)
    gsap.to(flyLight.rotation, { y: 2 * Math.PI, duration: 5 + Math.random() * 10, repeat: -1 })
    gsap.to(flyLight.position, {
      x: '+=' + Math.random(),
      y: '+=' + Math.random() * 20,
      duration: 5 + Math.random() * 10,
      yoyo: true,
      repeat: -1,
    })
    scene.add(flyLight)
  }
})

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  controls.update()
}
animate()

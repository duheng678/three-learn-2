import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import dat from 'dat.gui'
import basicVertexShader from './shader/flyLight/vertex.glsl'
import basicFragmentShader from './shader/flyLight/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import Firework from './firework'
import { Water } from 'three/examples/jsm/objects/Water2.js'

//创建场景
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 20)

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
// controls.maxPolarAngle = Math.PI
// controls.minPolarAngle = Math.PI * 0.55
//创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

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
  lightBox = gltf.scene.children[0]
  lightBox.material = planeShaderMaterial

  for (let i = 0; i < 150; i++) {
    let flyLight = gltf.scene.clone(true)
    let x = (Math.random() - 0.5) * 300
    let z = (Math.random() - 0.5) * 300
    let y = Math.random() * 60 + 5
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
gltfLoader.load('./src/assets/model/newyears_min.glb', gltf => {
  console.log(gltf)

  scene.add(gltf.scene)
  //创建水面
  const waterGeometry = new THREE.PlaneGeometry(100, 100)
  const water = new Water(waterGeometry, {
    color: new THREE.Color(0x001e0f),
    scale: 1,
    // flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 512,
    textureHeight: 512,
  })
  water.rotation.x = -Math.PI / 2
  water.position.y = 1
  scene.add(water)
})
const fireworks = []

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  fireworks.forEach((item, i) => {
    const type = item.update()
    if (type === 'remove') {
      fireworks.splice(i, 1)
    }
  })
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  controls.update()
}
animate()

let createFireWorks = () => {
  //随机生成颜色 位置
  const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`
  const position = {
    x: (Math.random() - 0.5) * 40,
    z: -(Math.random() - 0.5) * 40,
    y: 3 + Math.random() * 15,
  }
  let firework = new Firework(color, position)
  firework.addScene(scene, camera)
  fireworks.push(firework)
}
window.addEventListener('click', () => {
  createFireWorks()
  console.log(fireworks)
  // setTimeout(() => {
  //   if (fireworks.length > 0) fireworks.shift()
  // }, 1000)
})

import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import dat from 'dat.gui'
import basicVertexShader from './shader/water/vertex.glsl'
import basicFragmentShader from './shader/water/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
//导入water
import { Water } from 'three/examples/jsm/objects/Water2.js'

//创建场景
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 1)
scene.add(camera)

//创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 0.2

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

//创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//加载图片
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./src/assets/ca.jpeg')

const params = {
  color: '#ffffff',
  scale: 4,
  flowX: 1,
  flowY: 1,
}

//
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/050.hdr', envMap => {
  scene.environment = envMap
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
})

const gltfLoader = new GLTFLoader()
gltfLoader.load('/yugang.glb', gltf => {
  const yugang = gltf.scene.children[0]
  yugang.material.side = THREE.DoubleSide
  console.log(gltf)
  const waterGeometry = gltf.scene.children[1].geometry
  const water = new Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    // flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 512,
    textureHeight: 512,
  })

  scene.add(yugang)
  scene.add(water)
})

//添加光源

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  // planeShaderMaterial.uniforms.uTime.value = elapsedTime
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  controls.update()
}
animate()
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
})

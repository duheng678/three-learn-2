import * as THREE from 'three'
import './style.css'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//后期效果合成器
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
//three框架本身自带效果
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import gui from 'dat.gui'
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 3)
scene.add(camera)
camera.updateProjectionMatrix()

//轨道控制器

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
  'textures/environmentMaps/0/px.jpg',
  'textures/environmentMaps/0/nx.jpg',
  'textures/environmentMaps/0/py.jpg',
  'textures/environmentMaps/0/ny.jpg',
  'textures/environmentMaps/0/pz.jpg',
  'textures/environmentMaps/0/nz.jpg',
])
scene.background = envMapTexture
scene.environment = envMapTexture

const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.castShadow = true
directionLight.position.set(0, 0, 200)
scene.add(directionLight)
//加载模型
const gltfLoader = new GLTFLoader()
gltfLoader.load('./models/DamagedHelmet/glTF/DamagedHelmet.gltf', gltf => {
  console.log(gltf)
  // scene.add(gltf.scene)
  const mesh = gltf.scene.children[0]

  scene.add(mesh)
})

//合成效果
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)
// effectComposer.setPixelRatio(window.devicePixelRatio)
//添加渲染通道
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)
//添加点效果
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

//抗锯齿
const smaaPass = new SMAAPass()
effectComposer.addPass(smaaPass)

//发光效果
const unrealBloomPass = new UnrealBloomPass()
// unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1
// unrealBloomPass.exposure = 1
unrealBloomPass.strength = 1
unrealBloomPass.radius = 0
unrealBloomPass.threshold = 1

//
const glitchPass = new GlitchPass()
effectComposer.addPass(glitchPass)
// glitchPass.goWild = true
// glitchPass.enabled = false
// glitchPass.randX = 0.01
// glitchPass.curF = 0.01

const dat = new gui.GUI()
dat
  .add(unrealBloomPass, 'enabled')

  .onChange(value => {
    unrealBloomPass.enabled = value
  })

// dat
//   .add(unrealBloomPass, 'exposure')
//   .min(0)
//   .max(1)
//   .onChange(value => {
//     unrealBloomPass.exposure = value
//   })
dat
  .add(unrealBloomPass, 'strength')

  .min(0)
  .max(1)
  .onChange(value => {
    unrealBloomPass.strength = value
  })
dat
  .add(unrealBloomPass, 'radius')

  .min(0)
  .max(1)
  .onChange(value => {
    unrealBloomPass.radius = value
  })

dat
  .add(unrealBloomPass, 'threshold')

  .min(0)
  .max(1)
  .onChange(value => {
    unrealBloomPass.threshold = value
  })
dat
  .add(renderer, 'toneMappingExposure')

  .min(0)
  .max(1)
  .onChange(value => {
    renderer.toneMappingExposure = value
  })
function animate() {
  effectComposer.render()
  requestAnimationFrame(animate)
}
animate()

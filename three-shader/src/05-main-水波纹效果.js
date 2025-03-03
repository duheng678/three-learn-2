import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import dat from 'dat.gui'
import basicVertexShader from './shader/water/vertex.glsl'
import basicFragmentShader from './shader/water/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
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
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.2

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
  uWaresFrequency: 14.0,
  uScale: 0.03,
  uXzScale: 1.5,
  uNoiseFrequency: 10,
  uNoiseScale: 1.5,
  uTime: 0,
  uLowColor: '#ff0000',
  uHighColor: '#00ff00',
  uXSpeed: 1,
  uZSpeed: 1,
  uNoiseSpeed: 1,
  uOpacity: 1,
}

const planeShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uWaresFrequency: { value: params.uWaresFrequency },
    uScale: { value: params.uScale },
    uXzScale: { value: params.uXzScale },
    uNoiseFrequency: { value: params.uNoiseFrequency },
    uNoiseScale: { value: params.uNoiseScale },
    uTime: { value: params.uTime },
    uLowColor: { value: new THREE.Color(params.uLowColor) },
    uHighColor: { value: new THREE.Color(params.uHighColor) },
    uXSpeed: { value: params.uXSpeed },
    uZSpeed: { value: params.uZSpeed },
    uNoiseSpeed: { value: params.uNoiseSpeed },
    uOpacity: { value: params.uOpacity },
  },
})
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1024, 1024), planeShaderMaterial)
plane.rotateX(-Math.PI / 2)
scene.add(plane)

const gui = new dat.GUI()
gui
  .add(params, 'uWaresFrequency')
  .min(1)
  .max(50)
  .step(0.1)
  .onChange(value => {
    planeShaderMaterial.uniforms.uWaresFrequency.value = value
  })

gui
  .add(params, 'uScale')
  .min(0)
  .max(0.2)
  .step(0.001)
  .onChange(value => {
    planeShaderMaterial.uniforms.uScale.value = value
  })

gui
  .add(params, 'uNoiseFrequency')
  .min(1)
  .max(100)
  .onChange(value => {
    planeShaderMaterial.uniforms.uNoiseFrequency.value = value
  })

gui
  .add(params, 'uNoiseScale')
  .min(0)
  .max(5)
  .step(0.01)
  .onChange(value => {
    planeShaderMaterial.uniforms.uNoiseScale.value = value
  })
gui
  .add(params, 'uXzScale')
  .min(0)
  .max(5)
  .step(0.01)
  .onChange(value => {
    planeShaderMaterial.uniforms.uXzScale.value = value
  })

gui.addColor(params, 'uLowColor').onChange(value => {
  planeShaderMaterial.uniforms.uLowColor.value = new THREE.Color(value)
})

gui.addColor(params, 'uHighColor').onChange(value => {
  planeShaderMaterial.uniforms.uHighColor.value = new THREE.Color(value)
})
gui
  .add(params, 'uXSpeed')
  .min(0)
  .max(5)
  .step(0.01)
  .onChange(value => {
    planeShaderMaterial.uniforms.uXSpeed.value = value
  })

gui
  .add(params, 'uZSpeed')
  .min(0)
  .max(5)
  .step(0.01)
  .onChange(value => {
    planeShaderMaterial.uniforms.uZSpeed.value = value
  })

gui
  .add(params, 'uNoiseSpeed')
  .min(0)
  .max(5)
  .step(0.01)
  .onChange(value => {
    planeShaderMaterial.uniforms.uNoiseSpeed.value = value
  })

gui
  .add(params, 'uOpacity')
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(value => {
    planeShaderMaterial.uniforms.uOpacity.value = value
  })

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  planeShaderMaterial.uniforms.uTime.value = elapsedTime
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

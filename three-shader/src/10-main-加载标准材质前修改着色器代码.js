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
camera.position.set(2, 2, 10)

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
// controls.autoRotate = true
// controls.autoRotateSpeed = 0.1
// controls.maxPolarAngle = Math.PI
// controls.minPolarAngle = Math.PI * 0.55
//创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const basicMaterial = new THREE.MeshBasicMaterial({ color: '#00ff00' })
const basicUniform = {
  uTime: {
    value: 0,
  },
}
basicMaterial.onBeforeCompile = (shader, renderer) => {
  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)
  console.log(renderer)
  shader.uniforms.uTime = basicUniform.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    uniform float uTime;`
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    transformed.x+=sin(uTime)*2.0;
    transformed.z+=cos(uTime)*2.0;`
  )
}
const standardMaterial = new THREE.MeshStandardMaterial({
  color: '#00ff00',
})
const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), basicMaterial)

scene.add(floor)
const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  basicUniform.uTime.value = elapsedTime
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  controls.update()
}
animate()

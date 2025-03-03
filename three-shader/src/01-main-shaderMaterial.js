import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import basicVertexShader from './shader/basic/vertex.glsl'
import basicFragmentShader from './shader/basic/fragment.glsl'
console.log(basicVertexShader)
//创建场景
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 15)
scene.add(camera)

//创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
//创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const planeGeometry = new THREE.PlaneGeometry(2, 2)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
})

const planeShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
})
const plane = new THREE.Mesh(planeGeometry, planeShaderMaterial)
scene.add(plane)

function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

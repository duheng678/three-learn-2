import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import basicVertexShader from './shader/raw/vertex.glsl'
import basicFragmentShader from './shader/raw/fragment.glsl'
//创建场景
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(2, 2, 5)
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

//加载图片
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./src/assets/ca.jpeg')
console.log(texture)
const planeGeometry = new THREE.PlaneGeometry(2, 2, 4, 4)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
})

const planeShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    },
  },
})
const plane = new THREE.Mesh(planeGeometry, planeShaderMaterial)
scene.add(plane)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    map: texture,
  })
)
cube.position.set(0, 3, 0)
scene.add(cube)
const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  planeShaderMaterial.uniforms.uTime.value = elapsedTime
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

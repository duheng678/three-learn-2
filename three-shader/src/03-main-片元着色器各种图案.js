import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import dat from 'dat.gui'
import basicVertexShader from './shader/deep/vertex.glsl'
import basicFragmentShader from './shader/deep/fragmentV3.glsl'
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
// console.log(texture)
const planeGeometry = new THREE.PlaneGeometry(2, 2, 4, 4)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
})

const params = {
  uFrequency: 10.0,
  uScale: 0.1,
}
const gui = new dat.GUI()
gui
  .add(params, 'uFrequency')
  .min(0)
  .max(50)
  .step(0.1)
  .onChange(value => {
    planeShaderMaterial.uniforms.uFrequency.value = value
  })
gui
  .add(params, 'uScale')
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(value => {
    planeShaderMaterial.uniforms.uScale.value = value
  })
const planeShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  // transparent: true,
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    },
    uScale: {
      value: 0.5,
    },
    uFrequency: {
      value: 10.0,
    },
    iTime: { value: 0.0 }, // 传递时间
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }, // 传递屏幕分辨率
  },
})
const plane = new THREE.Mesh(planeGeometry, planeShaderMaterial)
scene.add(plane)
const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 4, 4), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
plane2.position.set(0, 0, -2)
scene.add(plane2)

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  planeShaderMaterial.uniforms.uTime.value = elapsedTime
  planeShaderMaterial.uniforms.iTime.value = elapsedTime
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

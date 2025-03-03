import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import dat from 'dat.gui'
import basicVertexShader from './shader/point/vertex.glsl'
import basicFragmentShader from './shader/point/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
//导入water
import { Water } from 'three/examples/jsm/objects/Water2.js'

//创建场景
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.aspect = window.innerWidth / window.innerHeight

camera.updateProjectionMatrix()
camera.position.set(0, 0, 5)
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

const geometryP = new THREE.BufferGeometry()
const positions = new Float32Array([0, 0, 0])

geometryP.setAttribute('position', new THREE.BufferAttribute(positions, 3))

//引入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/particles/10.png')
const texture1 = textureLoader.load('/textures/particles/9.png')
const texture2 = textureLoader.load('/textures/particles/11.png')

//点材质
// const material = new THREE.PointsMaterial({
//   color: 0x00ff00,
//   size: 0.1,
//   sizeAttenuation: true,
// })
//着色器材质

// const pointsP = new THREE.Points(geometryP, materialP)
// scene.add(pointsP)

const params = {
  count: 1000,
  size: 0.1,
  radius: 5,
  branch: 4,
  color: '#b54929',
  endColor: '#c7ff00',
  rotateScale: 0.3,
}

let geometry = null
let material = null
let points = null
const centerColor = new THREE.Color(params.color)
const endColor = new THREE.Color(params.endColor)
const generateGalaxy = () => {
  //生成顶点
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)

  const imgIndex = new Float32Array(params.count)

  const scales = new Float32Array(params.count)

  //循环生成点
  for (let i = 0; i < params.count; i++) {
    const radius = Math.random() * params.radius

    const branchAngle = ((i % params.branch) / params.branch) * Math.PI * 2
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)
    const randomX = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
    const randomY = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
    const randomZ = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
    const current = i * 3
    positions[current] = Math.cos(branchAngle + distance * params.rotateScale) * distance + randomX
    positions[current + 1] = 0 + randomY
    positions[current + 2] = Math.sin(branchAngle + distance * params.rotateScale) * distance + randomZ

    // 混合颜色，形成渐变

    const mixColor = centerColor.clone()
    mixColor.lerp(endColor, distance / params.radius)

    colors[current] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b
    imgIndex[current] = i % 3
    scales[current] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1))
  geometry.setAttribute('scales', new THREE.BufferAttribute(scales, 1))
  material = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0,
      },
      uTexture: {
        value: texture,
      },
      uTexture1: {
        value: texture1,
      },
      uTexture2: {
        value: texture2,
      },
      uTime: {
        value: 0,
      },
    },
  })
  points = new THREE.Points(geometry, material)

  scene.add(points)
}
generateGalaxy()

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  // points.rotation.y = elapsedTime * 0.1
  material.uniforms.uTime.value = elapsedTime * 0.1
  controls.update() // 更新控制器
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
})

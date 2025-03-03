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
renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 0.2

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

const directionLight = new THREE.DirectionalLight('#ffffff', 3)
directionLight.castShadow = true
directionLight.position.set(0, 0, 200)
scene.add(directionLight)
// 添加环境光
// const light = new THREE.AmbientLight(0xffffff, 1) // 白色环境光，强度为1
// scene.add(light)

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader()

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
scene.environment = envMapTexture
scene.background = envMapTexture
// 加载模型纹理
const modelTexture = textureLoader.load('./models/LeePerrySmith/color.jpg')
// 加载模型的法向纹理
const normalTexture = textureLoader.load('./models/LeePerrySmith/normal.jpg')

const material = new THREE.MeshStandardMaterial({
  map: modelTexture,
  normalMap: normalTexture,
})
const customUniforms = {
  uTime: { value: 0 },
}
material.onBeforeCompile = shader => {
  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)
  shader.uniforms.uTime = customUniforms.uTime

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    uniform float uTime;

    mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
    }
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
    #include <beginnormal_vertex>
    float angle = sin(position.y+uTime) *0.5;
    mat2 rotateMatrix =rotate2d(angle);
    objectNormal.xz=rotateMatrix*position.xz;
   `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    transformed.xz=rotateMatrix*transformed.xz;
   `
  )
}
const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
})

depthMaterial.onBeforeCompile = shader => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    float angle = sin(position.y+uTime) *0.5;
    mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;


    `
  )

  console.log('depthMaterial', shader.vertexShader)
}
const gltfLoader = new GLTFLoader()
gltfLoader.load('./models/LeePerrySmith/LeePerrySmith.glb', gltf => {
  // console.log(gltf)
  const mesh = gltf.scene.children[0]
  console.log(mesh)
  mesh.material = material
  mesh.castShadow = true
  //设置自定义深度材质
  mesh.customDepthMaterial = depthMaterial
  scene.add(mesh)
})
const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial())
plane.position.set(0, 0, -6)
plane.receiveShadow = true
scene.add(plane)
const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  customUniforms.uTime.value = elapsedTime
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  controls.update()
}
animate()
// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener('resize', () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix()

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
})

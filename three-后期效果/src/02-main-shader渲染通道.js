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

//纹理加载器
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('./textures/interfaceNormalMap.png')

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
  mesh.material.normalMap = normalTexture
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
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1
// unrealBloomPass.exposure = 1
unrealBloomPass.strength = 1
unrealBloomPass.radius = 0
unrealBloomPass.threshold = 1

//
// const glitchPass = new GlitchPass()
// effectComposer.addPass(glitchPass)
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

const colorParams = {
  r: 0,
  g: 0,
  b: 0,
}
//着色器渲染通道
const shaderPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uColor: {
      value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b),
    },
  },
  vertexShader: `
  varying vec2 vUv;
  void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `

  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform vec3 uColor;
    void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    color.rgb+=uColor;
  
    gl_FragColor = color ;
    }
  `,
})
effectComposer.addPass(shaderPass)

dat.add(colorParams, 'r', -1, 1).onChange(value => (shaderPass.uniforms.uColor.value.r = value))
dat.add(colorParams, 'g', -1, 1).onChange(value => (shaderPass.uniforms.uColor.value.g = value))
dat.add(colorParams, 'b', -1, 1).onChange(value => (shaderPass.uniforms.uColor.value.b = value))

const techPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uNormalMap: {
      value: null,
    },
    uTime: {
      value: 0,
    },
  },
  vertexShader: `
  varying vec2 vUv;
  void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform vec3 uColor;
  uniform sampler2D uNormalMap;
  uniform float uTime;
    void main() {
    vec2 newUv =vUv;
    newUv+=sin(newUv.x*2.0+uTime)*0.01;

    vec4 color = texture2D(tDiffuse, newUv);
    vec4 normalColor = texture2D(uNormalMap,vUv);
    // vec4 color = texture2D(tDiffuse, normalColor);
    //设置光线角度
    vec3 lightDirection = normalize(vec3(-5,5,0));
    float lightness = clamp(dot(normalColor.rgb,lightDirection),0.0,1.0);
    color.rgb+=lightness;
    gl_FragColor = color ;
    }
  `,
})
techPass.material.uniforms.uNormalMap.value = normalTexture
effectComposer.addPass(techPass)
effectComposer.addPass(unrealBloomPass)

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  techPass.material.uniforms.uTime.value = elapsedTime

  effectComposer.render()
  requestAnimationFrame(animate)
}
animate()

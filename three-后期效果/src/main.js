import * as THREE from 'three'
import gsap from 'gsap'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/gltf/')
dracoLoader.setDecoderConfig({ type: 'js' })

// dracoLoader.setDecoderConfig({ type: 'js' })
dracoLoader.preload()
gltfLoader.setDRACOLoader(dracoLoader)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(2, 22, 25)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)

//坐标辅助线
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
controls.enableDamping = true
// 添加hdr环境纹理
const loader = new RGBELoader()
loader.load('./textures/038.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})
init()
const params = { value: 0, value1: 0 }
let mixer
let stem, petal, stem1, petal1, stem2, petal2, stem3, petal3
function init() {
  gltfLoader.load('/model/f4.glb', function (gltf1) {
    console.log(gltf1)
    stem = gltf1.scene.children[0]
    petal = gltf1.scene.children[1]
    scene.add(gltf1.scene)
    gltf1.scene.rotation.x = -Math.PI
    gltf1.scene.traverse(function (child) {
      if (child.material && child.material.name === 'Water') {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x0000ff,
          depthWrite: false,
          transparent: true,
          depthTest: false,
          opacity: 0.5,
        })
      }
      if (child.material && child.material.name === 'Stem') {
        stem = child
      }
      if (child.material && child.material.name === 'Petal') {
        petal = child
        gltfLoader.load('./model/f2.glb', gltf2 => {
          gltf2.scene.traverse(item => {
            if (item.material && item.material.name === 'Stem') {
              stem1 = item
              stem.geometry.morphAttributes.position = [stem1.geometry.attributes.position]
              stem.updateMorphTargets()
              stem.morphTargetInfluences[0] = 0
            }
            if (item.material && item.material.name === 'Petal') {
              petal1 = item
              petal.geometry.morphAttributes.position = [petal1.geometry.attributes.position]
              petal.updateMorphTargets()
              petal.morphTargetInfluences[0] = 0
            }
          })
          gltfLoader.load('./model/f1.glb', gltf3 => {
            gltf3.scene.traverse(item => {
              if (item.material && item.material.name === 'Stem') {
                stem2 = item
                stem.geometry.morphAttributes.position.push(stem2.geometry.attributes.position)
                stem.updateMorphTargets()
                stem.morphTargetInfluences[1] = 0
                console.log(stem)
              }
              if (item.material && item.material.name === 'Petal') {
                petal2 = item
                petal.geometry.morphAttributes.position.push(petal2.geometry.attributes.position)
                petal.updateMorphTargets()
                petal.morphTargetInfluences[1] = 0
              }
            })
            gsap.to(params, {
              value: 1,
              duration: 5,
              onUpdate: () => {
                stem.morphTargetInfluences[0] = params.value
                petal.morphTargetInfluences[0] = params.value
              },
              onComplete: () => {
                gsap.to(params, {
                  value1: 1,
                  duration: 5,
                  onUpdate: () => {
                    stem.morphTargetInfluences[1] = params.value1
                    petal.morphTargetInfluences[1] = params.value1
                  },
                })
              },
            })
          })
        })
      }
    })
  })
}
animate()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
})

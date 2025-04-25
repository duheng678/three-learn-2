import * as THREE from 'three'
import gsap from 'gsap'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/gltf/')
dracoLoader.setDecoderConfig({ type: 'js' })
dracoLoader.preload()
gltfLoader.setDRACOLoader(dracoLoader)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(2, 2, 5)
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
const params = { value: 0 }
function init() {
  gltfLoader.load('./model/sphere1.glb', function (gltf) {
    console.log(gltf)

    scene.add(gltf.scene)
    const sphere1 = gltf.scene.children[0]
    gltfLoader.load('./model/sphere2.glb', function (gltf2) {
      sphere1.geometry.morphAttributes.position = []
      sphere1.geometry.morphAttributes.position.push(gltf2.scene.children[0].geometry.attributes.position.clone())
      sphere1.updateMorphTargets()
      sphere1.morphTargetInfluences[0] = 1
      gsap.to(params, {
        value: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        onUpdate: function () {
          sphere1.morphTargetInfluences[0] = params.value
          // sphere1.morphTargetInfluences[1] = 1 - params.value
        },
      })
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

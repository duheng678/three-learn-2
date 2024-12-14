import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
export default function () {
  // 创建一个场景
  const scene = new THREE.Scene()
  //创建一个相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(15, 15, 0)
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true
  renderer.physicallyCorrectLights = true
  document.body.appendChild(renderer.domElement)
  // 添加世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(15)
  scene.add(axesHelper)
  scene.add(camera)
  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  // // 添加网格辅助器
  // const gridHelper = new THREE.GridHelper(50, 50)
  // gridHelper.material.opacity = 0.3
  // gridHelper.material.transparent = true
  // scene.add(gridHelper)

  //

  function animate() {
    controls.update() // 更新控制器
    renderer.render(scene, camera)

    requestAnimationFrame(animate)
  }
  animate()

  //
  const particlesGeometry = new THREE.BufferGeometry()
  const count = 5000

  //设置缓冲区数组
  const positions = new Float32Array(count * 3)
  //设置顶点颜色
  const colors = new Float32Array(count * 3)
  //设置顶点
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50

    colors[i] = Math.random()
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // 载入纹理
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(
    '/textures/particles/zs2.png',
    () => console.log('Texture loaded successfully'),
    undefined,
    error => console.error('Texture failed to load:', error)
  )

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.5,
    // color: '#fff000',
    map: texture,
    alphaMap: texture,
    transparent: true,
    depthWrite: false,
    // alphaTest: 0.5,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  // const sphereGeometry = new THREE.SphereGeometry(3, 30, 30)

  // const wireframe = new THREE.WireframeGeometry(sphereGeometry)
  const point = new THREE.Points(particlesGeometry, pointsMaterial)
  scene.add(point)
}

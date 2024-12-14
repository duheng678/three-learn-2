import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
export default function () {
  // 创建一个场景
  const scene = new THREE.Scene()
  //创建一个相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 40)
  camera.position.set(0, 0, 40)
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true
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

  //

  function createPoints(img: string, size = 0.5) {
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 5000

    //设置缓冲区数组
    const positions = new Float32Array(count * 3)
    //设置顶点颜色
    const colors = new Float32Array(count * 3)
    //设置顶点
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100

      colors[i] = Math.random()
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // 载入纹理
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(
      `/textures/particles/${img}.png`,
      () => console.log('Texture loaded successfully'),
      undefined,
      error => console.error('Texture failed to load:', error)
    )

    const pointsMaterial = new THREE.PointsMaterial({
      size: size,
      // color: '#fff000',
      map: texture,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      // alphaTest: 0.5,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })
    const point = new THREE.Points(particlesGeometry, pointsMaterial)
    scene.add(point)
    return point
  }
  const point = createPoints('xh', 1)
  const point2 = createPoints('zs2')
  const point3 = createPoints('5')
  // const sphereGeometry = new THREE.SphereGeometry(3, 30, 30)

  // const wireframe = new THREE.WireframeGeometry(sphereGeometry)

  const clock = new THREE.Clock()
  function animate() {
    const time = clock.getElapsedTime()
    point.rotation.x = time * 0.3
    point2.rotation.x = time * 0.6
    point2.rotation.y = time * 0.4
    point3.rotation.x = time * 0.4
    controls.update() // 更新控制器
    renderer.render(scene, camera)

    requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener('resize', () => {
    //更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像头的投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
  })
}

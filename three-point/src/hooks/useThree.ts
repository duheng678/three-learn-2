import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
export default function () {
  // 创建一个场景
  const scene = new THREE.Scene()
  //创建一个相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 10)
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
  // 载入纹理
  //创建一千个立方体
  const redMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000',
  })

  const cubeArr: any[] = []
  for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
      for (let z = -5; z < 5; z++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({
          color: '#ffffff',
          wireframe: true,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(i, j, z)
        cubeArr.push(mesh)
        scene.add(mesh)
      }
    }
  }

  //创建投射光线对象
  const raycaster = new THREE.Raycaster()
  // 鼠标位置对象
  const mouse = new THREE.Vector2()
  // 监听鼠标位置
  window.addEventListener('click', e => {
    console.log(e)
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(cubeArr)
    console.log(intersects)
    intersects[0].object.material = redMaterial
  })

  function animate() {
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
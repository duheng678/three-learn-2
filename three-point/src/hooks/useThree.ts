import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
export default function () {
  // 创建一个场景
  const scene = new THREE.Scene()
  //创建一个相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 300)
  camera.position.set(0, 0, 38)
  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true
  document.body.appendChild(renderer.domElement)
  //渲染器透明
  // 添加世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(15)
  scene.add(axesHelper)
  scene.add(camera)
  // 创建轨道控制器
  // const controls = new OrbitControls(camera, renderer.domElement)
  // controls.enableDamping = true
  // // 添加网格辅助器
  // 载入纹理
  //创建一千个立方体
  const redMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000',
  })

  const cubeArr: any[] = []
  const cubeGroup = new THREE.Group()
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      for (let z = 0; z < 5; z++) {
        const geometry = new THREE.BoxGeometry(2, 2, 2)
        const material = new THREE.MeshBasicMaterial({
          color: '#ffffff',
          wireframe: true,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4)
        cubeArr.push(mesh)
        cubeGroup.add(mesh)
        // scene.add(mesh)
      }
    }
  }
  scene.add(cubeGroup)

  // 创建三角形酷炫物体
  // 添加物体
  // 创建几何体
  const sjxGroup = new THREE.Group()
  for (let i = 0; i < 50; i++) {
    // 每一个三角形，需要3个顶点，每个顶点需要3个值
    const geometry = new THREE.BufferGeometry()
    const positionArray = new Float32Array(9)
    for (let j = 0; j < 9; j++) {
      if (j % 3 == 1) {
        positionArray[j] = Math.random() * 5
      } else {
        positionArray[j] = Math.random() * 10 - 5
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
    const color = new THREE.Color(Math.random(), Math.random(), Math.random())
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    })
    // 根据几何体和材质创建物体
    const sjxMesh = new THREE.Mesh(geometry, material)
    //   console.log(mesh);
    sjxGroup.add(sjxMesh)
  }
  sjxGroup.position.set(0, -30, 0)
  scene.add(sjxGroup)

  // 弹跳小球
  const sphereGroup = new THREE.Group()
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
  const spherematerial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  })
  const sphere = new THREE.Mesh(sphereGeometry, spherematerial)
  // 投射阴影
  sphere.castShadow = true

  sphereGroup.add(sphere)

  // // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(20, 20)
  const plane = new THREE.Mesh(planeGeometry, spherematerial)
  plane.position.set(0, -1, 0)
  plane.rotation.x = -Math.PI / 2
  // 接收阴影
  plane.receiveShadow = true
  sphereGroup.add(plane)

  // 灯光
  // 环境光
  // const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
  // sphereGroup.add(light)

  const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  smallBall.position.set(2, 2, 2)
  //直线光源
  const pointLight = new THREE.PointLight(0xff0000, 3)
  // pointLight.position.set(2, 2, 2);
  pointLight.castShadow = true

  // 设置阴影贴图模糊度
  pointLight.shadow.radius = 20
  // 设置阴影贴图的分辨率
  pointLight.shadow.mapSize.set(512, 512)

  // 设置透视相机的属性
  smallBall.add(pointLight)
  sphereGroup.add(smallBall)

  sphereGroup.position.set(0, -60, 0)
  scene.add(sphereGroup)

  const arrGroup = [cubeGroup, sjxGroup, sphereGroup]

  //创建投射光线对象
  const raycaster = new THREE.Raycaster()
  // 鼠标位置对象
  const mouse = new THREE.Vector2()
  // // 监听鼠标位置
  // window.addEventListener('click', e => {
  //   console.log(e)
  //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  //   mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  //   raycaster.setFromCamera(mouse, camera)
  //   const intersects = raycaster.intersectObjects(cubeArr)
  //   console.log(intersects)

  //   if (intersects?.[0]?.object?.material) intersects[0].object.material = redMaterial
  // })
  const clock = new THREE.Clock()
  function animate() {
    // const time = clock.getElapsedTime()
    const deltaTime = clock.getDelta()

    //根据当前滚动的scrolly设置相机移动的位置
    camera.position.y = -(window.scrollY / window.innerHeight) * 30
    camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5

    // camera.position.x = (mouse.x * 10 - camera.position.x) * delta * 50
    // controls.update() // 更新控制器
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

  gsap.to(cubeGroup.rotation, {
    x: '+=' + Math.PI,
    z: '+=' + Math.PI,

    duration: 3,
    onComplete: () => {
      console.log('动画完成')
    },
    repeat: -1,
    ease: 'power2.inOut',
    yoyo: true,
  })
  gsap.to(sjxGroup.rotation, {
    x: '+=' + Math.PI,
    z: '-=' + Math.PI,

    duration: 3,
    onComplete: () => {
      console.log('动画完成')
    },
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  })
  gsap.to(smallBall.position, {
    x: -4,

    duration: 3,
    onComplete: () => {
      console.log('动画完成')
    },
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  })
  gsap.to(smallBall.position, {
    z: 0,

    duration: 3,
    onComplete: () => {
      console.log('动画完成')
    },
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  })
  gsap.to(smallBall.position, {
    y: 0,

    duration: 0.5,
    onComplete: () => {
      console.log('动画完成')
    },
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  })
  let currentPage = 0

  window.addEventListener('scroll', () => {
    // console.log(window.scrollY, window.innerHeight)
    const newPage = Math.round(window.scrollY / window.innerHeight)
    if (currentPage !== newPage) {
      currentPage = newPage
      console.log('改变页面：当前是：' + currentPage)
      // gsap.to(arrGroup[currentPage].rotation, {
      //   x: '+=' + Math.PI,
      //   duration: 1,
      //   onComplete: () => {
      //     console.log('动画完成')
      //   },
      // })
      // gsap.to(`.page${currentPage} h1`, {
      //   rotate: '+=360deg',
      //   duration: 1,
      // })
      gsap.fromTo(
        `.page${currentPage} h1`,
        {
          x: -300,
        },
        {
          x: 0,
          rotate: '+=360deg',
          duration: 1,
        }
      )
    }
  })
  window.addEventListener('mousemove', event => {
    mouse.x = event.clientX / window.innerWidth - 0.5
    mouse.y = event.clientY / window.innerHeight - 0.5
    console.log(mouse.x, camera.position.x)
  })
}

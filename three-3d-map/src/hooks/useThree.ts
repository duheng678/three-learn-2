import * as THREE from 'three'
import * as d3 from 'd3'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
export function useThree() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(15, 15, 15)
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  const appEl = document.querySelector('.App')
  console.log(appEl)

  appEl?.appendChild(renderer.domElement)
  //创建一个世界坐标辅助器
  const axesHelper = new THREE.AxesHelper(15)
  scene.add(axesHelper)
  //创建一个轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  function animate() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()

  //载入geojson文件
  const loader = new THREE.FileLoader()
  loader.load('/geo.json', function (data: any) {
    const jsonData = JSON.parse(data)
    console.log(jsonData)
    operateData(jsonData)
  })
  const map = new THREE.Object3D()
  function operateData(jsonData: any) {
    const features = jsonData.features
    features.forEach((feature: any) => {
      // 创建省份的物体
      const province: any = new THREE.Object3D()
      province.properties = feature.properties.name
      //获取经纬度坐标
      const coordinates = feature.geometry.coordinates

      if (feature.geometry.type === 'Polygon') {
        coordinates.forEach((coordinate: any) => {
          const mesh: any = createMesh(coordinate)
          const line = createLine(coordinate)
          mesh.properties = feature.properties.name
          province.add(mesh)
          province.add(line)
        })
      }
      if (feature.geometry.type === 'MultiPolygon') {
        coordinates.forEach((item: any) => {
          item.forEach((coordinate: any) => {
            const mesh: any = createMesh(coordinate)
            const line = createLine(coordinate)

            mesh.properties = feature.properties.name
            province.add(mesh)
            province.add(line)
          })
        })
      }
      map.add(province)
    })
    scene.add(map)
  }
  const projection = d3.geoMercator().center([116.5, 38.5]).translate([0, 0])
  function createMesh(polygon: any) {
    const shape = new THREE.Shape()
    polygon.forEach((row: any, i: number) => {
      const [longitude, latitude] = projection(row)
      if (i === 0) {
        shape.moveTo(longitude, -latitude)
      }
      shape.lineTo(longitude, -latitude)
    })
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1 })
    const color = new THREE.Color(Math.random() * 0xffffff)
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 })
    return new THREE.Mesh(geometry, material)
  }
  function createLine(polygon: any[]) {
    const lineGeometry = new THREE.BufferGeometry()
    const pointsArray: any[] = []
    polygon.forEach(row => {
      const [longitude, latitude] = projection(row)
      pointsArray.push(new THREE.Vector3(longitude, -latitude, 0))
    })
    lineGeometry.setFromPoints(pointsArray)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#ff0000',
    })
    return new THREE.Line(lineGeometry, lineMaterial)
  }
  let lastPicker: any = null
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  window.addEventListener('click', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(map.children)
    console.log(intersects)
    if (intersects.length > 0) {
      if (lastPicker) {
        lastPicker.material.color.copy(lastPicker.material.oldColor)
      }
      lastPicker = intersects[0].object
      lastPicker.material.oldColor = lastPicker.material.color.clone()
      lastPicker.material.color.setHex(0xff0000)
    }
  })
}

<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from 'cesium'
import gsap from 'gsap'
import planeData from './assets/json/plane.json'
import './Widgets/widgets.css'
import { onMounted } from 'vue'
//设置cesium 的token
Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNGFjOGZjNC01M2VlLTQ3ZDItYjk2NC0wY2E3ZDFlMzMyOTgiLCJpZCI6MjYyNTIwLCJpYXQiOjE3MzQyMjkwODV9.aoHi7aesaKXDhsm-wnehyzmr1psHyHzFB2c08BjILWo'
// 设置cesium的根目录
window.CESIUM_BASE_URL = '/'
//设置cesium的默认视角
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  89.5, //西经
  20.4, //南纬
  110.4, //东经
  61.2 //北纬
)

onMounted(async () => {
  const viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: false,
    // shouldAnimate: true,
    // 设置地形
  })
  //隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'

  console.log(planeData)
  //通过json数据画线
  const positionProperty = new Cesium.SampledPositionProperty()
  //时间间隔
  const timeStepInSeconds = 30
  //整个飞行花费时间
  const totalSeconds = (planeData.length - 1) * timeStepInSeconds
  //设置起点时间
  const time = new Date('2022-03-09T23:10:00Z')
  //转换成儒略日时间
  const startJulianDate = Cesium.JulianDate.fromDate(time)
  //设置终点时间
  const stopJulianDate = Cesium.JulianDate.addSeconds(startJulianDate, totalSeconds, new Cesium.JulianDate())
  console.log(stopJulianDate)
  // 将查看器的时间调整为起点和结束点范围s
  viewer.clock.startTime = startJulianDate.clone()
  viewer.clock.stopTime = stopJulianDate.clone()

  viewer.clock.currentTime = startJulianDate.clone()
  viewer.timeline.zoomTo(startJulianDate, stopJulianDate)

  planeData.forEach((dataPoint, i) => {
    const time = Cesium.JulianDate.addSeconds(startJulianDate, i * timeStepInSeconds, new Cesium.JulianDate())
    // 设置当前点的位置
    const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height)
    // 添加轨迹的采样点
    positionProperty.addSample(time, position)
    //添加点
    viewer.entities.add({
      position: position,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 5,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      },
    })
  })
  console.log(positionProperty)
  const tiles3d = await Cesium.createOsmBuildingsAsync()
  const osmBuildings = viewer.scene.primitives.add(tiles3d)
  //创建飞机
  const planeEntity = viewer.entities.add({
    name: 'Plane',
    // 设置飞机的可用
    position: positionProperty,
    //根据采样点顺序计算飞机的方向
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    model: {
      uri: '/model/Air.glb',
      // minimumPixelSize: 128,
      // maximumScale: 20000,
    },
    path: {
      // material: Cesium.Color.WHITE.withAlpha(0.5),
      width: 5,
    },
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: startJulianDate,
        stop: stopJulianDate,
      }),
    ]),
  })
  //相机追踪运动的物体
  viewer.trackedEntity = planeEntity
  //设置时间速率
  viewer.clock.multiplier = 60
  // 设置相机偏移，调整离飞机的距离
  const offset = new Cesium.Cartesian3(0.0, -10000.0, 5000.0) // 距离飞机的偏移量
  viewer.trackedEntityChanged.addEventListener(() => {
    if (viewer.trackedEntity === planeEntity) {
      viewer.scene.camera.lookAtTransform(
        Cesium.Transforms.eastNorthUpToFixedFrame(planeEntity.position.getValue(Cesium.JulianDate.now())),
        offset
      )
    }
  })
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

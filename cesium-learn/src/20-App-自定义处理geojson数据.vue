<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from 'cesium'
import gsap from 'gsap'
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
    // 设置地形
  })

  //隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'

  // let dataGeo = Cesium.GeoJsonDataSource.load('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json', {
  //   stroke: Cesium.Color.RED,
  //   fill: Cesium.Color.SKYBLUE.withAlpha(0.5),
  //   strokeWidth: 4,
  // })
  let dataGeo = Cesium.GeoJsonDataSource.load('geo.json', {
    stroke: Cesium.Color.RED,
    fill: Cesium.Color.SKYBLUE.withAlpha(1),
    strokeWidth: 4,
  })
  dataGeo.then(dataSources => {
    console.log(dataSources)
    viewer.dataSources.add(dataSources)
    let entities = dataSources.entities.values
    entities.forEach((entity, i) => {
      entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromRandom({ alpha: 1 }))
      entity.polygon.outline = false
      // entity.polygon.extrudedHeight = 200000
      let randomNum = parseInt(Math.random() * 10)
      entity.polygon.extrudedHeight = 100000 * randomNum
    })
  })
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

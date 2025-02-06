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
  const tiles3d = await Cesium.createOsmBuildingsAsync()
  viewer.scene.primitives.add(tiles3d)

  const position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1000)
  viewer.camera.flyTo({ destination: position, duration: 2 })

  tiles3d.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ['${feature["building"]}==="apartments"', 'color("rgba(255,255,0,0.5)", 0.5)'],
        ['${feature["building"]}==="commercial"', 'color("rgba(255,0,0,0.5)", 0.5)'],
        ['${feature["cesium#estimatedHeight"]}>300', 'color("rgba(200,200,255,0.7)")'],
        ['${feature["cesium#estimatedHeight"]}>100', 'color("rgba(100,100,255,0.7)")'],
        ['${feature["cesium#estimatedHeight"]}>50', 'color("rgba(50,50,150,0.7)")'],

        ['true', 'color("white")'],
      ],
    },
    show: true,
  })
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

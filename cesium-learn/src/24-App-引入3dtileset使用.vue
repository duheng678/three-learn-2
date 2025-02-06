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
  const tileset = await Cesium.Cesium3DTileset.fromUrl('/Assets/tileset.json')
  viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin)
  console.log(tileset)

  viewer.scene.primitives.add(tileset)
  // tileset.allTilesLoaded.addEventListener(function () {
  //   console.log('All tiles are loaded')
  // })
  viewer.zoomTo(tileset)
  const position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1000)
  viewer.camera.flyTo({ destination: position, duration: 2 })
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

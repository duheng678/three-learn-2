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
    // infoBox: false,
    shouldAnimate: true,
    // 设置地形
  })
  //隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'
  //设置沙箱允许使用js
  // 设置沙箱允许使用js
  var iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0]
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
  iframe.setAttribute('src', '')
  const tiles3d = await Cesium.createOsmBuildingsAsync()
  viewer.scene.primitives.add(tiles3d)

  const position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 10)
  viewer.camera.flyTo({ destination: position, duration: 2 })
  // viewer.entities.add({
  //   position: position,
  //   label: {
  //     text: '广州塔',
  //     font: '20px sans-serif',
  //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //     fillColor: Cesium.Color.RED,
  //     outlineWidth: 2,
  //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //     pixelOffset: new Cesium.Cartesian2(0, -9),
  //   },
  //   billboard: {
  //     image: './texture/gzt.png',
  //     scale: 0.5,
  //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //   },
  // })
  tiles3d.style = new Cesium.Cesium3DTileStyle({
    defines: {
      distance: "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude']}),vec2(113.3191,23.109))",
    },
    color: {
      conditions: [
        ['${distance}<0.01', 'color("rgba(255,255,0,0.0)")'],
        ['${distance}<0.02', 'color("rgba(255,255,0,0.5)")'],
        ['${distance}<0.03', 'color("rgba(255,255,0,0.2)")'],

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

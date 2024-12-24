<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from 'cesium'
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

  // setView瞬间相机到达
  // 生成position是天安门的位置
  const position = Cesium.Cartesian3.fromDegrees(
    116.393428, //西经
    39.90923, //南纬
    1000 //高度
  )
  viewer.camera.setView({
    destination: position,
    // orientation: {
    //   heading: Cesium.Math.toRadians(0), // 方向
    //   pitch: Cesium.Math.toRadians(0), // 倾斜
    //   roll: 30, // 旋转
    // },
  })
  // flyto 让相机飞往某个地方
  viewer.camera.flyTo({
    destination: position,
    // duration: 3, // 持续时间
    orientation: {
      heading: Cesium.Math.toRadians(0), // 方向
      pitch: Cesium.Math.toRadians(-30), // 倾斜
      roll: 0, // 旋转
    },
  })
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

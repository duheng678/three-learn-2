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
  //生成广州塔的位置 113.3191，
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
  window.addEventListener('keydown', e => {
    console.log(e)
    const height = viewer.camera.positionCartographic.height
    console.log(Cesium.Math.toRadians(0.1))
    const moveRate = height / 100
    switch (e.key) {
      case 'w':
        //设置相机向前移动
        viewer.camera.moveForward(moveRate)
        break
      case 's':
        //设置相机向后移动
        viewer.camera.moveBackward(moveRate)

        break
      case 'a':
        //设置相机向左移动
        viewer.camera.moveLeft(moveRate)
        break
      case 'd':
        //设置相机向右移动
        viewer.camera.moveRight(moveRate)
        break
      case 'q':
        //设置相机向做旋转
        viewer.camera.lookLeft(Cesium.Math.toRadians(0.1))
        break
      case 'e':
        //设置相机向右旋转
        viewer.camera.lookRight(Cesium.Math.toRadians(0.1))
        break
      case 'r':
        //设置相机向上看
        viewer.camera.lookUp(Cesium.Math.toRadians(0.1))
        break
      case 'f':
        //设置相机向下看
        viewer.camera.lookDown(Cesium.Math.toRadians(0.1))
        break
      case 'g':
        //向左逆时针翻滚
        viewer.camera.twistLeft(Cesium.Math.toRadians(0.1))
        break
      case 'h':
        //向右顺时针时针翻滚
        viewer.camera.twistRight(Cesium.Math.toRadians(0.1))
      default:
        break
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

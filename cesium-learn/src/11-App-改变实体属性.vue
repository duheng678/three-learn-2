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

  viewer.entities.add({
    name: 'Red translucent rectangle',
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(-110.0, 30.0, -80.0, 35.0),
      material: Cesium.Color.RED.withAlpha(0.5),
      extrudedHeight: 300000.0,
      // height: 100000.0,
    },
  })

  // primivite创建矩形
  //创建几何体
  const rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(-110.0, 20.0, -80.0, 25.0),
    extrudedHeight: 300000,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
  })
  const rectGeometry2 = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(-110.0, 12.0, -80.0, 14.0),
    extrudedHeight: 300000,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
  })
  const instance = new Cesium.GeometryInstance({
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CHOCOLATE),
    },
    id: 'chocolate',
  })
  const instance2 = new Cesium.GeometryInstance({
    geometry: rectGeometry2,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.PURPLE),
    },
    id: 'purple',
  })
  //创建图元
  const primitive = new Cesium.Primitive({
    geometryInstances: [instance, instance2],
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true,
    }),
  })
  viewer.scene.primitives.add(primitive)
  setTimeout(() => {
    const attribute = primitive.getGeometryInstanceAttributes('purple')
    console.log(attribute)
    // attribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.RED)
    attribute.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom({ alpha: 1 }))
  }, 3000)
  //  viewer.camera.flyTo({
  //     destination: Cesium.Cartesian3.fromDegrees(113.5, 22.5, 1000000),
  //   })
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

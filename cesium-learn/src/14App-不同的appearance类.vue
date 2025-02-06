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
  // 画线

  const rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(-110.0, 20.0, -80.0, 25.0),
    extrudedHeight: 300000,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
  })
  const instance = new Cesium.GeometryInstance({
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
    },
  })
  //使用instance的颜色去着色
  const appearance = new Cesium.PerInstanceColorAppearance({
    closed: true,
    translucent: true,
  })
  const material = Cesium.Material.fromType('Color', {
    color: Cesium.Color.AQUA.withAlpha(0.5),
  })
  // 设定几何体都是与地球的椭圆体平行
  const appearance1 = new Cesium.EllipsoidSurfaceAppearance({
    material: material,
    aboveGround: false,
  })
  const primitive = new Cesium.Primitive({
    geometryInstances: instance,
    appearance: appearance1,
  })
  viewer.scene.primitives.add(primitive)
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

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

  const czml = [
    {
      id: 'document',
      name: 'box',
      version: '1.0',
    },
    {
      id: 'shape1',
      name: 'Blue box',
      position: {
        cartographicDegrees: [-114.0, 40.0, 300000.0],
      },
      box: {
        dimensions: {
          cartesian: [400000.0, 300000.0, 500000.0],
        },
        material: {
          solidColor: {
            color: {
              rgba: [0, 0, 255, 255],
            },
          },
        },
      },
    },
    {
      id: 'shape2',
      name: 'Red box with black outline',
      position: {
        cartographicDegrees: [-107.0, 40.0, 300000.0],
      },
      box: {
        dimensions: {
          cartesian: [400000.0, 300000.0, 500000.0],
        },
        material: {
          solidColor: {
            color: {
              rgba: [255, 0, 0, 128],
            },
          },
        },
        outline: true,
        outlineColor: {
          rgba: [0, 0, 0, 255],
        },
      },
    },
    {
      id: 'shape3',
      name: 'Yellow box outline',
      position: {
        cartographicDegrees: [-100.0, 40.0, 300000.0],
      },
      box: {
        dimensions: {
          cartesian: [400000.0, 300000.0, 500000.0],
        },
        fill: false,
        outline: true,
        outlineColor: {
          rgba: [255, 255, 0, 255],
        },
      },
    },
  ]
  const czmlUrl = '/Assets/box1.czml'
  // console.log(JSON.stringify(czml))
  const dataSourcePromise = Cesium.CzmlDataSource.load(czmlUrl)
  dataSourcePromise.then(function (dataSource) {
    console.log(dataSource)
    viewer.dataSources.add(dataSource)
    viewer.zoomTo(dataSource)
  })
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

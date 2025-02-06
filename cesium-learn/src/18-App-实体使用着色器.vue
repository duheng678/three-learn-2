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
  // 画线

  class CustomMaterialProperty {
    constructor(options) {
      this._definitionChanged = new Cesium.Event()
      Cesium.Material._materialCache.addMaterial('customMaterial', {
        fabric: {
          type: 'customMaterial',
          uniforms: {
            uTime: 0,
          },
          source: `
      czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            // 生成默认的基础材质
            czm_material material = czm_getDefaultMaterial(materialInput);
            material.diffuse = vec3(materialInput.st, uTime);
            return material;
          }
      `,
        },
      })
      this.params = {
        uTime: 0,
      }
      gsap.to(this.params, {
        uTime: 1,
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
        yoyo: true,
      })
    }
    getType() {
      return 'customMaterial'
    }
    getValue(time, result) {
      // console.log(time, result)
      // let t = performance.now() / 1000
      // t = t % 1
      // result.uTime = t
      result.uTime = this.params.uTime
      return result
    }
  }
  let material = new CustomMaterialProperty()
  viewer.entities.add({
    id: 'entityRect',
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        89.5, //西经
        20.4, //南纬
        110.4, //东经
        61.2 //北纬
      ),
      material: material,
    },
  })

  console.log(material)

  // viewer.scene.primitives.add(primitive)
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

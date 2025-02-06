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

  const rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(-110.0, 20.0, -80.0, 35.0),
    // extrudedHeight: 300000,
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  })
  const instance = new Cesium.GeometryInstance({
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
    },
  })
  let material1 = new Cesium.Material({
    fabric: {
      type: 'Image',
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
      },
    },
  })
  const material2 = new Cesium.Material({
    fabric: {
      type: 'Grid',

      uniforms: {
        // image: '/texture/logo.png',
        color: Cesium.Color.AQUA.withAlpha(0.5),
        cellAlpha: 0.2,
        lineCount: new Cesium.Cartesian2(10.0, 10.0),
        lineThickness: new Cesium.Cartesian2(2.0, 2.0),
      },
    },
  })
  // 边写着色器修改材料
  const material3 = new Cesium.Material({
    fabric: {
      uniforms: {
        uTime: 0,
      },
      source: `
      czm_material czm_getMaterial(czm_materialInput materialInput) {
      czm_material material = czm_getDefaultMaterial(materialInput);
      // material.diffuse = vec3(materialInput.st, 0.0);
      float strength = mod((materialInput.s+uTime) * 10.0,1.0);
      material.diffuse = vec3(strength,0.0,0.0);
      return material;
      }
      `,
    },
  })

  // const gsap=
  gsap.to(material3.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    ease: 'linear',
  })

  const appearance = new Cesium.EllipsoidSurfaceAppearance({
    // material: material3,
    // translucent: true,
    fragmentShaderSource: `
    in vec3 v_positionMC;
    in vec3 v_positionEC;
    in vec2 v_st;
    uniform float uTime;

    void main()
    {
        czm_materialInput materialInput;
        out_FragColor = vec4(v_st,uTime,1.0);
    }
    `,
  })
  appearance.uniforms = {
    uTime: 0,
  }
  gsap.to(appearance.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    ease: 'linear',
    yoyo: true,
  })
  console.log(appearance)
  console.log(appearance.vertexShaderSource)
  console.log(appearance.fragmentShaderSource)

  const primitive = new Cesium.Primitive({
    geometryInstances: instance,
    appearance: appearance,
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

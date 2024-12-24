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

onMounted(() => {
  const viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: false,
    geocoder: false, //source:false,//搜索框
    homeButton: false, //首页按钮
    sceneModePicker: false, //3D/2D切换
    baseLayerPicker: false, //底图切换
    fullscreenButton: false, //全屏按钮
    navigationHelpButton: false, //帮助按钮
    animation: false, //动画控制
    timeline: false, //时间轴
    // selectionIndicator: false, //选中指示器
    //设置天空盒
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX: './texture/sky/px.jpg',
        negativeX: './texture/sky/nx.jpg',
        positiveY: './texture/sky/ny.jpg',
        negativeY: './texture/sky/py.jpg',
        positiveZ: './texture/sky/pz.jpg',
        negativeZ: './texture/sky/nz.jpg',
      },
    }),
    // 天地图矢量路径图
    imageryProvider: false, // 禁用默认底图
    // 天地图矢量路径图
    // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
    //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
    //   layer: "tdtBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
    //   天地图影像服务
    // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
    //   url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
    //   layer: "tdtBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
    // OSM地图,
    // imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    //   url: "https://a.tile.openstreetmap.org/",
    // }),
    // 高德矢量地图,
    // imageryProvider: new Cesium.UrlTemplateImageryProvider({
    //   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    //   layer: "tdtVecBasicLayer",
    //   style: "default",
    //   format: "image/png",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
    // }),
  })
  const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    layer: 'tdtVecBasicLayer',
    style: 'default',
    format: 'image/png',
    tileMatrixSetID: 'GoogleMapsCompatible',
  })
  const imageryProvider1 = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=e628eaeaa6e3fc1dece94d55909829a4',
    layer: 'tdtBasicLayer',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible',
  })
  // 添加图层
  viewer.imageryLayers.addImageryProvider(imageryProvider)
  const layer1 = viewer.imageryLayers.addImageryProvider(imageryProvider1)
  layer1.alpha = 0.5

  //隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = 'none'

  console.log(viewer.imageryLayers.length) // 检查图层数
  console.log(viewer.imageryLayers.get(0)) // 检查第一个图层的配置
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
  width: 100vw;
}
</style>

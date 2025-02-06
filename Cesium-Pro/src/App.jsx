import { memo, useEffect } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import './App.css'
import { initViewer, MousePosition, modifyMap } from './cesium'
import CesiumNavigation from 'cesium-navigation-es6'
function App() {
  async function initCesium() {
    const viewer = await initViewer()
    //根据鼠标位置生成经纬度
    new MousePosition(viewer)
    const options = {
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      enableCompass: true,
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      enableZoomControls: true,
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      enableDistanceLegend: true,
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      enableCompassOuterRing: true,
    }
    // 初始化导航罗盘
    const navigation = new CesiumNavigation(viewer, options)
    modifyMap(viewer)
  }
  useEffect(() => {
    initCesium()
  }, [])

  return <div id="cesiumContainer" className="container"></div>
}

export default memo(App)

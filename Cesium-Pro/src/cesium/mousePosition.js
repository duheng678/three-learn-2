import * as Cesium from 'cesium'
export class MousePosition {
  constructor(viewer) {
    this.divDom = document.createElement('div')
    this.divDom.style.cssText = `
      position: absolute;
      bottom: 0;
      right: 0;
      width: 200px;
      height: 50px;
      background:rgba(0,0,0,0.5);
      z-index: 999;
      pointer-events: none;
      color: #fff;
    `

    document.body.appendChild(this.divDom)
    //监听鼠标垫移动事件
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    handler.setInputAction(movement => {
      //获取鼠标的坐标

      const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid)
      if (cartesian) {
        //转换成经纬度
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2)
        this.divDom.innerHTML = `经度：${longitude}° <br/> 纬度：${latitude}° `
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}

export const modifyMap = viewer => {
  //获取地图影像图层
  let baseLayer = viewer.imageryLayers.get(0)
  console.log(baseLayer)
  //设置2个变量，判断是否进行颜色的反转和过滤
  baseLayer.invertColor = true
  baseLayer.filterRGB = [0, 50, 100]
  //更改底图着色器的代码
  const baseFragmentShader = viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources
  console.log(baseFragmentShader)
  //循环修改着着色器
  for (let i = 0; i < baseFragmentShader.length; i++) {
    console.log(baseFragmentShader[i])
  }
}

import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import useThree from './hooks/useThree'
import './App.css'
import Home from './views/home'
interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  useThree()
  useEffect(() => {}, [])
  return (
    <div>
      {/* <Home /> */}
      <div className="page page0">
        <h1>Ray投射光效</h1>
        <h3>实现3d交互</h3>
      </div>
      <div className="page page1">
        <h1>应用2</h1>
      </div>
      <div className="page page2">
        <h1>活泼点光源</h1>
        <h3>点光源围绕照亮小球</h3>
      </div>
    </div>
  )
}

export default memo(App)

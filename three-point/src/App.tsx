import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import useThree from './hooks/03-useThree-飞雪动画'
interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  useThree()
  return <div></div>
}

export default memo(App)

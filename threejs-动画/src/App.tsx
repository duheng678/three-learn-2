import { memo } from 'react'
import { useThree } from './hooks/useThree'
import './App.css'
function App() {
  useThree()
  return <div></div>
}

export default memo(App)

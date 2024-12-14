import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // 或 '0.0.0.0' 以允许局域网访问
    port: 3000, // 配置端口
    hmr: true, // 默认启用 HMR，可省略
  },
})

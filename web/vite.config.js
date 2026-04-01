import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url' // 新增：用于路径别名

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 新增：路径别名配置
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // 把 @ 映射到 src 目录
    }
  }
})
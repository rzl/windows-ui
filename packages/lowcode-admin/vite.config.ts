import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@windows-ui/core': resolve(__dirname, '../windows-ui/src/index.ts'),
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 大依赖拆分：框架、组件库、流程设计器各自成 chunk，
        // 避免首屏 550KB 单包，且业务代码更新时不破坏框架层缓存
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@vue-flow') || id.includes('vue-flow')) {
              return 'vue-flow'
            }
            if (id.includes('vue') || id.includes('pinia') || id.includes('axios')) {
              return 'vendor'
            }
            // 其余小依赖跟随业务 chunk，避免产生空 chunk
          }
          // alias 解析后模块 id 是源码绝对路径，按路径段匹配组件库源码
          if (id.includes('packages/windows-ui')) {
            return 'windows-ui'
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9001,
    proxy: {
      '/api': {
        target: 'http://localhost:9002',
        changeOrigin: true
      }
    }
  }
})

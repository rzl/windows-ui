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

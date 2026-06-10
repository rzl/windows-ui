import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@windows-ui/core': resolve(__dirname, '../windows-ui/src/index.ts')
    }
  },
  server: {
    port: 5174,
    open: true
  }
})

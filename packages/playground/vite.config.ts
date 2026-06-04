import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@windows-ui/core': resolve(__dirname, '../windows-ui/src/index.ts')
    }
  }
})

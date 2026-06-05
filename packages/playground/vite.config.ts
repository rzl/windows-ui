import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

function docsServerPlugin() {
  const docsRoot = resolve(__dirname, '../../docs')
  return {
    name: 'docs-server',
    configureServer(server: any) {
      server.middlewares.use('/docs', (req: any, res: any, next: any) => {
        const target = resolve(docsRoot, '.' + req.url)
        if (!target.startsWith(docsRoot)) return next()
        fs.readFile(target, 'utf-8', (err: any, data: string) => {
          if (err) return next()
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.end(data)
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), docsServerPlugin()],
  resolve: {
    alias: {
      '@windows-ui/core': resolve(__dirname, '../windows-ui/src/index.ts')
    }
  }
})

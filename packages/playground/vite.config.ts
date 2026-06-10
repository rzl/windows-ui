import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

function docsServerPlugin() {
  const docsRoot = resolve(__dirname, '../../docs')
  const docFolders = fs.readdirSync(docsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  function findDocFolder(urlName: string): string | null {
    if (docFolders.includes(urlName)) return urlName
    const normalized = urlName.replace(/-/g, '')
    for (const folder of docFolders) {
      if (folder.replace(/-/g, '') === normalized) return folder
    }
    return null
  }

  return {
    name: 'docs-server',
    configureServer(server: any) {
      server.middlewares.use('/docs', (req: any, res: any, next: any) => {
        const parts = req.url.replace(/^\/+/, '').split('/')
        if (parts.length < 2) return next()
        const folder = findDocFolder(parts[0])
        if (!folder) return next()
        const target = resolve(docsRoot, folder, parts.slice(1).join('/'))
        if (!target.startsWith(docsRoot)) return next()
        fs.readFile(target, 'utf-8', (err: any, data: string) => {
          if (err) return next()
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(data)
        })
      })
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [vue(), docsServerPlugin()],
  resolve: {
    alias: {
      '@windows-ui/core': resolve(__dirname, '../windows-ui/src/index.ts')
    }
  }
})

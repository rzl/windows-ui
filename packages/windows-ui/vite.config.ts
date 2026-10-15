import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

// 收集全部组件入口：dist/<name>.js，支持 `import { WButton } from '@windows-ui/core/button'` 按需引入
function collectEntries(): Record<string, string> {
  const entries: Record<string, string> = {}
  const componentsDir = resolve(__dirname, 'src/components')
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = resolve(dir, name)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (!/\.(vue|ts)$/.test(name) || name.endsWith('.spec.ts')) continue
      const rel = resolve(full).slice(componentsDir.length + 1).replace(/\\/g, '/')
      const key = rel.replace(/\.(vue|ts)$/, '')
      entries[key] = full
    }
  }
  walk(componentsDir)
  entries['index'] = resolve(__dirname, 'src/index.ts')
  return entries
}

// 默认（production）：ES 多入口构建，产物保留组件粒度便于 tree-shaking
// --mode umd：单入口 UMD 构建（全量包，供 <script> 直接引入）
export default defineConfig(({ mode }) => {
  if (mode === 'umd') {
    return {
      plugins: [vue()],
      build: {
        // ES 产物已在第一步生成，这里只追加 UMD 文件
        emptyOutDir: false,
        outDir: 'dist',
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'WindowsUI',
          fileName: () => 'windows-ui.umd.js',
          formats: ['umd']
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: { vue: 'Vue' },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'windows-ui.css'
              return assetInfo.name as string
            }
          }
        },
        cssCodeSplit: false
      }
    }
  }

  return {
    plugins: [
      vue(),
      dts({
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: ['src/**/*.spec.ts'],
        outDir: 'dist'
      })
    ],
    build: {
      outDir: 'dist',
      lib: {
        entry: collectEntries(),
        name: 'WindowsUI',
        formats: ['es']
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          entryFileNames: '[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'windows-ui.css'
            return assetInfo.name as string
          }
        }
      },
      cssCodeSplit: false
    }
  }
})

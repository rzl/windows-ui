export interface VConsoleOptions {
  theme?: 'light' | 'dark'
  onReady?: () => void
}

let loading = false
let loaded = false
let instance: any = null

const VCONSOLE_CDN = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js'

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`))
    document.body.appendChild(script)
  })
}

export async function loadVConsole(options?: VConsoleOptions) {
  if (typeof window === 'undefined') return
  if (instance) {
    instance.show()
    return
  }
  if (loaded) {
    initVConsole(options)
    return
  }
  if (loading) return
  loading = true

  try {
    await loadScript(VCONSOLE_CDN)
    loaded = true
    initVConsole(options)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[VConsole] load failed:', e)
  } finally {
    loading = false
  }
}

function initVConsole(options?: VConsoleOptions) {
  const VConsole = (window as any).VConsole
  if (!VConsole) return
  instance = new VConsole({
    theme: options?.theme || 'light',
    onReady: options?.onReady
  })
}

export function destroyVConsole() {
  if (instance) {
    instance.destroy()
    instance = null
  }
}

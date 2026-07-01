import { createApp } from 'vue'
import WindowsUI, { setGlobalLocale } from '@windows-ui/core'
import router from './router'
import App from './App.vue'
import i18n, { setPlaygroundLang } from './i18n'

const app = createApp(App)
app.use(i18n)
app.use(router)
app.use(WindowsUI, { locale: i18n.global.locale.value })
setPlaygroundLang(i18n.global.locale.value as 'zh-CN' | 'en-US')
setGlobalLocale(i18n.global.locale.value)

// 开发调试：把未捕获的运行时错误显示在页面上，方便用户反馈
if ((import.meta as any).env?.DEV) {
  function showErrorOverlay(error: any, source = 'Error') {
    const id = '__playground-error-overlay__'
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('div')
      el.id = id
      el.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,0.95);z-index:99999;padding:24px;font-family:monospace;font-size:13px;color:#d00;overflow:auto;white-space:pre-wrap;'
      document.body.appendChild(el)
    }
    const msg = error instanceof Error ? `${error.name}: ${error.message}\n\n${error.stack}` : String(error)
    el.textContent = `[${source}] ${msg}`
  }
  app.config.errorHandler = (err) => showErrorOverlay(err, 'Vue')
  window.addEventListener('error', (e) => showErrorOverlay(e.error || e.message, 'Window'))
  window.addEventListener('unhandledrejection', (e) => showErrorOverlay(e.reason, 'Promise'))
}

app.mount('#app')

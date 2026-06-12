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
app.mount('#app')

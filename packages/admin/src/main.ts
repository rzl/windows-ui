import { createApp } from 'vue'
import { createPinia } from 'pinia'
import WindowsUI from '@windows-ui/core'
import i18n from './i18n'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(WindowsUI)
app.mount('#app')

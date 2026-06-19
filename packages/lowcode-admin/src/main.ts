import { createApp } from 'vue'
import { createPinia } from 'pinia'
import WindowsUI from '@windows-ui/core'
import router from './router'
import App from './App.vue'
import { createLowcodeI18n } from '@/locale'
import { useAppStore } from '@/stores/app'

const app = createApp(App)
app.use(createPinia())

const appStore = useAppStore()
app.use(createLowcodeI18n({ locale: appStore.locale }))

app.use(router)
app.use(WindowsUI)
app.mount('#app')

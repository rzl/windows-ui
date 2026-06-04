import { createApp } from 'vue'
import WindowsUI from '@windows-ui/core'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(WindowsUI)
app.mount('#app')

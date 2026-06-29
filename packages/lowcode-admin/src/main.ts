import { createApp } from 'vue'
import { createPinia } from 'pinia'
import WindowsUI from '@windows-ui/core'
import router from './router'
import App from './App.vue'
import { createLowcodeI18n } from '@/locale'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { initPlugins } from '@/utils/pluginManager'

async function bootstrap() {
  const app = createApp(App)
  app.use(createPinia())

  const appStore = useAppStore()
  app.use(createLowcodeI18n({ locale: appStore.locale }))

  app.use(router)
  app.use(WindowsUI)

  await initPlugins()

  // 启动时若本地有令牌但未恢复用户信息，尝试拉取个人信息以校验令牌有效性。
  // 若令牌过期或失效，请求拦截器会自动清理登录态并跳转登录页。
  const auth = useAuthStore()
  if (auth.isLoggedIn && !auth.userInfo) {
    try {
      await auth.fetchProfile()
    } catch {
      // 拦截器已处理跳转与状态清理
    }
  }

  app.mount('#app')
}

bootstrap()

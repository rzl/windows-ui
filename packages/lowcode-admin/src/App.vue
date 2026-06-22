<template>
  <w-config-provider :size="app.size" :theme="app.theme" :locale="app.locale" :mode="app.mode">
    <router-view />
  </w-config-provider>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { loadVConsole, destroyVConsole } from '@/utils/vconsole'

const app = useAppStore()
const auth = useAuthStore()

watch(() => app.vconsoleEnabled, (enabled) => {
  if (enabled) {
    loadVConsole()
  } else {
    destroyVConsole()
  }
}, { immediate: true })

onMounted(() => {
  // 页面刷新后，若已有 token 则重新获取用户信息并建立 WebSocket 连接
  if (auth.isLoggedIn && !auth.userInfo?.id) {
    auth.fetchProfile().catch(() => {
      // token 失效时 fetchProfile 内部会处理 401 跳转
    })
  }
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: 'Tahoma', 'Microsoft Sans Serif', sans-serif;
  background: var(--w-bg-color-page, var(--w-bg-color));
}
#app,
#app > div {
  height: 100%;
}
</style>

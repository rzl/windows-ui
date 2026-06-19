<template>
  <div class="exception-page">
    <div class="exception-content">
      <h1>{{ code }}</h1>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <w-button type="primary" @click="router.push('/')">回到首页</w-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const code = computed(() => Number(route.params.code) || 404)

const title = computed(() => {
  const map: Record<number, string> = { 403: '抱歉，您无权访问此页面', 404: '抱歉，页面不存在', 500: '抱歉，服务器出错了' }
  return map[code.value] || '未知错误'
})

const description = computed(() => {
  const map: Record<number, string> = {
    403: '请联系管理员确认权限',
    404: '请检查地址是否正确',
    500: '请稍后重试或联系管理员'
  }
  return map[code.value] || ''
})
</script>

<style scoped>
.exception-page { padding: 40px; }
.exception-content { text-align: center; }
.exception-content h1 { font-size: 80px; color: var(--w-color-primary); margin: 0; }
.exception-content h2 { margin: 16px 0 8px; }
.exception-content p { color: #666; margin-bottom: 24px; }
</style>

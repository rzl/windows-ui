<template>
  <div class="result-page">
    <div class="result-content">
      <w-icon :name="icon" :size="64" />
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <w-space>
        <w-button type="primary" @click="router.back()">返回</w-button>
        <w-button @click="router.push('/')">回到首页</w-button>
      </w-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const type = computed(() => (route.query.type as string) || 'success')
const icon = computed(() => (type.value === 'success' ? 'check' : 'close'))
const title = computed(() => (route.query.title as string) || (type.value === 'success' ? '操作成功' : '操作失败'))
const description = computed(() => (route.query.description as string) || '')
</script>

<style scoped>
.result-page { padding: 40px; }
.result-content { text-align: center; }
.result-content h2 { margin: 16px 0 8px; }
.result-content p { color: #666; margin-bottom: 24px; }
</style>

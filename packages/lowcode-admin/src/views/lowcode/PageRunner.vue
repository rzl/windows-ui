<template>
  <div class="page-runner-page">
    <w-page-renderer
      :code="code"
      :load-page="loadPage"
      :execute-data-source="executeDataSource"
      :has-permission="hasPermission"
      @navigate="handleNavigate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as pageApi from '@/api/page'
import { useAuthStore } from '@/stores/auth'
import type { PageDataSource } from '@windows-ui/core'

defineOptions({ name: 'PageRunner' })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const code = computed(() => route.params.code as string)

async function loadPage(pageCode: string) {
  return pageApi.getPage(pageCode)
}

async function executeDataSource(pageCode: string, ds: PageDataSource, ctx?: any) {
  return pageApi.executePageDataSource(pageCode, ds, ctx)
}

function hasPermission(permission: string) {
  return authStore.hasPermission(permission)
}

function handleNavigate(target: string) {
  router.push(target)
}
</script>

<style scoped>
.page-runner-page { padding: 8px; }
</style>

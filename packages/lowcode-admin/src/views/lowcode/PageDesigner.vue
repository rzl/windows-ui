<template>
  <div class="designer-page">
    <w-page-designer
      :code="code"
      :load-page="loadPage"
      :save-page="savePage"
      @back="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import * as pageApi from '@/api/page'

defineOptions({ name: 'PageDesigner' })

const route = useRoute()
const router = useRouter()
const code = route.params.code as string

async function loadPage(pageCode: string) {
  return pageApi.getPage(pageCode)
}

async function savePage(data: any) {
  await pageApi.savePage(data)
  alert('保存成功')
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.designer-page { padding: 8px; }
</style>

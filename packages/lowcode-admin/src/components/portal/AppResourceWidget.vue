<template>
  <div class="resource-grid">
    <div
      v-for="item in displayItems"
      :key="`${item.type}_${item.ref_code}`"
      class="resource-card"
      @click="enterResource(item)"
    >
      <div class="resource-icon">
        <w-icon :name="resourceIcon(item.type)" />
      </div>
      <div class="resource-info">
        <div class="resource-name">{{ item.ref_name || item.ref_code }}</div>
        <div class="resource-type">{{ resourceLabel(item.type) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  widget: any
  items: any[]
}>()

const router = useRouter()

const typeMap: Record<string, string> = {
  model: '数据模型',
  report: '报表',
  dashboard: '仪表盘',
  flow: '流程',
  print: '打印模板',
  datasource: '外部数据源',
  page: '页面'
}

const iconMap: Record<string, string> = {
  model: 'table',
  report: 'chart',
  dashboard: 'dashboard',
  flow: 'flow',
  print: 'printer',
  datasource: 'data',
  page: 'page'
}

const limit = computed(() => props.widget.limit || 8)
const displayItems = computed(() => (props.items || []).slice(0, limit.value))

function resourceLabel(type: string) {
  return typeMap[type] || type
}

function resourceIcon(type: string) {
  return iconMap[type] || 'app'
}

function enterResource(item: any) {
  switch (item.type) {
    case 'model':
      router.push(`/lowcode/run/${item.ref_code}`)
      break
    case 'report':
      router.push(`/report/run/${item.ref_code}`)
      break
    case 'dashboard':
      router.push(`/dashboard/run/${item.ref_code}`)
      break
    case 'flow':
      router.push('/flow/pending')
      break
    case 'print':
      router.push(`/print/preview/${item.ref_code}`)
      break
  }
}
</script>

<style scoped>
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}
.resource-card {
  background: #fff;
  border: 1px solid #d4d0c8;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.resource-card:hover { background: #f0f0f0; }
.resource-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 18px;
}
.resource-info { flex: 1; min-width: 0; }
.resource-name { font-weight: bold; font-size: 14px; margin-bottom: 2px; }
.resource-type { color: #666; font-size: 12px; }
</style>

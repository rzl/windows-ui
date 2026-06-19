<template>
  <div class="list-page">
    <w-form v-if="paramList.length" :inline="true" style="margin-bottom: 12px">
      <w-form-item v-for="p in paramList" :key="p.name" :label="p.label">
        <w-input v-if="p.type === 'string' || p.type === 'number'" v-model="paramValues[p.name]" />
        <w-input v-else-if="p.type === 'date'" v-model="paramValues[p.name]" type="date" />
        <w-input v-else-if="p.type === 'datetime'" v-model="paramValues[p.name]" type="datetime-local" />
        <w-select v-else-if="p.type === 'select'" v-model="paramValues[p.name]" :options="p.options || []" />
      </w-form-item>
      <w-button type="primary" @click="handleExecute">查询</w-button>
      <w-button @click="handleExport">导出 Excel</w-button>
    </w-form>
    <div v-else class="toolbar">
      <w-button type="primary" @click="handleExecute">查询</w-button>
      <w-button @click="handleExport">导出 Excel</w-button>
    </div>

    <w-table :data="list" :columns="tableColumns" stripe border />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as reportApi from '@/api/report'

const route = useRoute()
const reportCode = computed(() => route.params.code as string)

const report = reactive<any>({})
const config = reactive<any>({ columns: [], params: [] })
const list = ref<any[]>([])
const paramValues = reactive<Record<string, any>>({})

const paramList = computed(() => config.params || [])

const tableColumns = computed(() => {
  return (config.columns || []).map((col: any) => ({
    prop: col.field,
    label: col.label || col.field
  }))
})

watch(reportCode, () => loadReport(), { immediate: true })

async function loadReport() {
  if (!reportCode.value) return
  const data = await reportApi.getReport(reportCode.value)
  Object.assign(report, data)
  const cfg = data.config || { columns: [], params: [] }
  Object.assign(config, cfg)
  list.value = []

  // 初始化参数默认值
  for (const p of cfg.params || []) {
    paramValues[p.name] = p.defaultValue || ''
  }
}

async function handleExecute() {
  const result = await reportApi.executeReport(reportCode.value, {
    params: { ...paramValues }
  })
  list.value = result.list || []
}

async function handleExport() {
  try {
    const blob = await reportApi.exportReportExcel(reportCode.value, {
      params: { ...paramValues }
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${reportCode.value}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (err: any) {
    alert(err.message || '导出失败')
  }
}
</script>

<style scoped>
.list-page { padding: 8px; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>

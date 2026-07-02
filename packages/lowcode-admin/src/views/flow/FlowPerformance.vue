<template>
  <div class="list-page">
    <w-card header="查询条件">
      <w-space>
        <w-input v-model="query.startTime" type="datetime-local" placeholder="开始时间" />
        <w-input v-model="query.endTime" type="datetime-local" placeholder="结束时间" />
        <w-select v-model="query.flowCode" :options="flowOptions" clearable placeholder="选择流程" />
        <w-button type="primary" @click="loadData">查询</w-button>
      </w-space>
    </w-card>

    <w-card header="按流程定义统计" style="margin-top: 16px;">
      <w-table :data="definitionStats" :columns="definitionColumns" stripe border />
    </w-card>

    <w-card header="按节点统计" style="margin-top: 16px;">
      <w-table :data="nodeStats" :columns="nodeColumns" stripe border />
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as flowApi from '@/api/flow'

const query = reactive({
  startTime: '',
  endTime: '',
  flowCode: ''
})

const definitionStats = ref<any[]>([])
const nodeStats = ref<any[]>([])
const flowOptions = ref<any[]>([])

const definitionColumns = [
  { prop: 'flowName', label: '流程名称' },
  { prop: 'totalCount', label: '实例总数' },
  { prop: 'completedCount', label: '完成数' },
  { prop: 'rejectedCount', label: '驳回数' },
  { prop: 'timeoutCount', label: '超时任务数' },
  { prop: 'avgDuration', label: '平均耗时(s)' },
  { prop: 'maxDuration', label: '最大耗时(s)' }
]

const nodeColumns = [
  { prop: 'nodeName', label: '节点名称' },
  { prop: 'totalCount', label: '处理数' },
  { prop: 'timeoutCount', label: '超时数' },
  { prop: 'avgDuration', label: '平均耗时(s)' },
  { prop: 'maxDuration', label: '最大耗时(s)' }
]

onMounted(async () => {
  const flows = await flowApi.getFlowDefinitions()
  flowOptions.value = flows.map((f: any) => ({ label: f.name, value: f.code }))
  await loadData()
})

async function loadData() {
  const params: any = {}
  if (query.startTime) params.startTime = new Date(query.startTime).toISOString()
  if (query.endTime) params.endTime = new Date(query.endTime).toISOString()
  if (query.flowCode) params.flowCode = query.flowCode

  const [defStats, nStats] = await Promise.all([
    flowApi.getFlowPerformanceByDefinition(params),
    flowApi.getFlowPerformanceByNode(params)
  ])
  definitionStats.value = defStats
  nodeStats.value = nStats
}
</script>

<style scoped>
.list-page { padding: 8px; }
</style>

<template>
  <div class="pending-task-widget">
    <div v-if="loading" class="loading-tip">加载中...</div>
    <div v-else-if="!filteredTasks.length" class="empty-tip">
      <w-empty description="暂无待办" />
    </div>
    <div v-else class="task-list">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
        @click="goPending"
      >
        <div class="task-title">{{ task.flow_name }} - {{ task.node_name }}</div>
        <div class="task-meta">业务主键：{{ task.business_key }}</div>
      </div>
    </div>
    <div v-if="filteredTasks.length" class="task-footer">
      <w-button type="link" size="small" @click="goPending">查看更多</w-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as flowApi from '@/api/flow'

const props = defineProps<{
  widget: any
  flowCodes?: string[]
}>()

const router = useRouter()
const tasks = ref<any[]>([])
const loading = ref(false)

const limit = computed(() => props.widget.limit || 5)

const filteredTasks = computed(() => {
  let list = tasks.value
  if (props.flowCodes?.length) {
    list = list.filter((t) => props.flowCodes!.includes(t.flow_code))
  }
  return list.slice(0, limit.value)
})

onMounted(() => loadTasks())

async function loadTasks() {
  loading.value = true
  try {
    tasks.value = await flowApi.getPendingTasks()
  } finally {
    loading.value = false
  }
}

function goPending() {
  router.push('/flow/pending')
}
</script>

<style scoped>
.pending-task-widget { min-height: 80px; }
.loading-tip { padding: 16px; text-align: center; color: #999; }
.empty-tip { padding: 8px 0; }
.task-list { display: flex; flex-direction: column; gap: 8px; }
.task-item {
  padding: 10px 12px;
  border: 1px solid #d4d0c8;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.task-item:hover { background: #f0f0f0; }
.task-title { font-weight: bold; margin-bottom: 4px; }
.task-meta { color: #666; font-size: 12px; }
.task-footer { margin-top: 8px; text-align: right; }
</style>

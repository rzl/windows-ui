<template>
  <div class="custom-api-version-panel">
    <w-collapse v-model="activeNames">
      <w-collapse-item title="版本管理" name="versions">
        <div class="toolbar">
          <w-button type="primary" size="small" @click="openCreateDialog">+ 创建快照</w-button>
        </div>
        <w-table :data="versions" :columns="columns" stripe border>
          <template #is_published="{ row }">
            <w-tag :type="row.is_published === 1 ? 'success' : 'info'">
              {{ row.is_published === 1 ? '当前版本' : '历史版本' }}
            </w-tag>
          </template>
          <template #snapshot="{ row }">
            <w-button size="small" @click="previewSnapshot(row)">查看</w-button>
          </template>
          <template #action="{ row }">
            <w-space>
              <w-button size="small" type="primary" @click="handleRollback(row)">回滚</w-button>
              <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
            </w-space>
          </template>
        </w-table>
      </w-collapse-item>
    </w-collapse>

    <w-dialog v-model="createVisible" title="创建快照" width="420">
      <w-form :model="createForm">
        <w-form-item label="版本号">
          <w-input v-model="createForm.version" placeholder="如 v1.0.0" />
        </w-form-item>
        <w-form-item label="说明">
          <w-input v-model="createForm.description" type="textarea" :rows="2" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="createVisible = false">取消</w-button>
        <w-button type="primary" @click="handleCreate">确定</w-button>
      </template>
    </w-dialog>

    <w-dialog v-model="previewVisible" title="快照预览" width="600">
      <w-input v-model="previewText" type="textarea" :rows="16" readonly />
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import * as customApiVersionApi from '@/api/custom-api-version'

const props = defineProps<{
  apiId: number
}>()

const emit = defineEmits<{
  (e: 'rollback'): void
}>()

const activeNames = ref(['versions'])
const versions = ref<any[]>([])
const createVisible = ref(false)
const createForm = reactive({ version: '', description: '' })
const previewVisible = ref(false)
const previewText = ref('')

const columns = [
  { prop: 'version', label: '版本号' },
  { prop: 'description', label: '说明' },
  { prop: 'is_published', label: '状态', width: 110 },
  { prop: 'create_time', label: '创建时间', width: 180 },
  { prop: 'snapshot', label: '快照', width: 90 },
  { prop: 'action', label: '操作', width: 150, fixed: 'right' }
]

async function loadVersions() {
  const res = await customApiVersionApi.getCustomApiVersions(props.apiId)
  versions.value = res.data || []
}

function openCreateDialog() {
  createForm.version = ''
  createForm.description = ''
  createVisible.value = true
}

async function handleCreate() {
  await customApiVersionApi.createCustomApiVersion(props.apiId, {
    version: createForm.version,
    description: createForm.description
  })
  createVisible.value = false
  await loadVersions()
}

async function handleRollback(row: any) {
  if (!confirm(`确定要回滚到版本 ${row.version} 吗？当前编辑器内容将被覆盖，且接口脚本会立即生效。`)) return
  await customApiVersionApi.rollbackCustomApiVersion(props.apiId, row.id)
  emit('rollback')
  await loadVersions()
}

async function handleDelete(row: any) {
  if (!confirm(`确定要删除版本 ${row.version} 吗？`)) return
  await customApiVersionApi.deleteCustomApiVersion(props.apiId, row.id)
  await loadVersions()
}

function previewSnapshot(row: any) {
  try {
    const snapshot = typeof row.snapshot === 'string' ? JSON.parse(row.snapshot) : row.snapshot
    previewText.value = JSON.stringify(snapshot, null, 2)
  } catch {
    previewText.value = String(row.snapshot)
  }
  previewVisible.value = true
}

watch(() => props.apiId, () => {
  if (props.apiId) loadVersions()
}, { immediate: true })
</script>

<style scoped>
.custom-api-version-panel {
  margin-top: 12px;
}
.toolbar {
  margin-bottom: 12px;
}
</style>

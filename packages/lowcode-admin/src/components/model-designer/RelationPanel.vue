<template>
  <div class="relation-panel">
    <div class="toolbar">
      <w-button type="primary" size="small" @click="openEditor()">+ 新增关系</w-button>
    </div>
    <w-table :data="modelRelations" :columns="columns" stripe border>
      <template #relation_type="{ row }">
        <w-tag :type="relationTypeType(row.relation_type)">{{ relationTypeText(row.relation_type) }}</w-tag>
      </template>
      <template #status="{ row }">
        <w-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</w-tag>
      </template>
      <template #action="{ row }">
        <w-space>
          <w-button size="small" @click="openEditor(row)">编辑</w-button>
          <w-button size="small" type="danger" @click="handleDelete(row)">删除</w-button>
        </w-space>
      </template>
    </w-table>

    <relation-editor v-model="editorVisible" :data="currentRow" @saved="loadData" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import * as relationApi from '@/api/relation'
import RelationEditor from '@/views/lowcode/RelationEditor.vue'

const props = defineProps<{
  modelCode?: string
}>()

const relations = ref<any[]>([])
const editorVisible = ref(false)
const currentRow = ref<any>(null)

const modelRelations = computed(() => {
  if (!props.modelCode) return relations.value
  return relations.value.filter((r) => r.source_model === props.modelCode || r.target_model === props.modelCode)
})

const columns = [
  { prop: 'code', label: '编码' },
  { prop: 'name', label: '名称' },
  { prop: 'source_model', label: '源模型' },
  { prop: 'target_model', label: '目标模型' },
  { prop: 'relation_type', label: '关系类型', width: 110 },
  { prop: 'source_field', label: '源字段', width: 110 },
  { prop: 'target_field', label: '目标字段', width: 110 },
  { prop: 'status', label: '状态', width: 90 },
  { prop: 'action', label: '操作', width: 180, fixed: 'right' }
]

const relationTypeMap: Record<string, { text: string; type: string }> = {
  belongsTo: { text: '多对一', type: 'primary' },
  hasMany: { text: '一对多', type: 'success' },
  manyToMany: { text: '多对多', type: 'warning' }
}

function relationTypeText(type?: string) {
  return relationTypeMap[type || 'belongsTo']?.text || type
}

function relationTypeType(type?: string) {
  return relationTypeMap[type || 'belongsTo']?.type || 'info'
}

onMounted(() => loadData())

async function loadData() {
  relations.value = await relationApi.getRelations()
}

function openEditor(row?: any) {
  currentRow.value = row || null
  editorVisible.value = true
}

async function handleDelete(row: any) {
  if (confirm(`确定删除关系 ${row.name} 吗？`)) {
    await relationApi.deleteRelation(row.id)
    await loadData()
  }
}
</script>

<style scoped>
.relation-panel { padding: 8px 0; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>

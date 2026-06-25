<template>
  <w-dialog v-model="visible" :title="isEdit ? '编辑关联关系' : '新增关联关系'" width="620" @closed="handleClose">
    <w-form :model="form" label-width="100px">
      <div class="form-row">
        <w-form-item label="编码">
          <w-input v-model="form.code" :disabled="isEdit" placeholder="唯一编码，如 order_customer" />
        </w-form-item>
        <w-form-item label="名称">
          <w-input v-model="form.name" placeholder="关系名称" />
        </w-form-item>
      </div>
      <div class="form-row">
        <w-form-item label="关系类型">
          <w-select v-model="form.relationType" :options="typeOptions" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="form.status" :active-text="'启用'" :inactive-text="'禁用'" />
        </w-form-item>
      </div>
      <div class="form-row">
        <w-form-item label="源模型">
          <w-select v-model="form.sourceModel" :options="modelOptions" filterable />
        </w-form-item>
        <w-form-item label="目标模型">
          <w-select v-model="form.targetModel" :options="modelOptions" filterable />
        </w-form-item>
      </div>
      <div class="form-row">
        <w-form-item label="源字段">
          <w-input v-model="form.sourceField" placeholder="源模型中的字段，如 customer_id" />
        </w-form-item>
        <w-form-item label="目标字段">
          <w-input v-model="form.targetField" placeholder="默认 id" />
        </w-form-item>
      </div>
      <w-form-item v-if="form.relationType === 'manyToMany'" label="中间表">
        <w-input v-model="form.junctionTable" placeholder="多对多中间表名" />
      </w-form-item>
    </w-form>

    <template #footer>
      <w-space>
        <w-button @click="visible = false">取消</w-button>
        <w-button type="primary" @click="handleSave">保存</w-button>
      </w-space>
    </template>
  </w-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import * as relationApi from '@/api/relation'
import * as lowcodeApi from '@/api/lowcode'

const props = defineProps<{
  modelValue: boolean
  data?: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.data?.id)

const form = ref<any>({
  code: '',
  name: '',
  relationType: 'belongsTo',
  sourceModel: '',
  targetModel: '',
  sourceField: '',
  targetField: 'id',
  junctionTable: '',
  status: true
})

const modelOptions = ref<{ label: string; value: string }[]>([])

const typeOptions = [
  { label: '多对一（belongsTo）', value: 'belongsTo' },
  { label: '一对多（hasMany）', value: 'hasMany' },
  { label: '多对多（manyToMany）', value: 'manyToMany' }
]

watch(() => props.modelValue, (val) => {
  if (val) {
    loadModels()
    if (props.data) {
      form.value = {
        code: props.data.code || '',
        name: props.data.name || '',
        relationType: props.data.relation_type || 'belongsTo',
        sourceModel: props.data.source_model || '',
        targetModel: props.data.target_model || '',
        sourceField: props.data.source_field || '',
        targetField: props.data.target_field || 'id',
        junctionTable: props.data.junction_table || '',
        status: props.data.status === 1
      }
    } else {
      form.value = {
        code: '',
        name: '',
        relationType: 'belongsTo',
        sourceModel: '',
        targetModel: '',
        sourceField: '',
        targetField: 'id',
        junctionTable: '',
        status: true
      }
    }
  }
})

async function loadModels() {
  const models = await lowcodeApi.getModels()
  modelOptions.value = (models || []).map((m: any) => ({ label: m.name, value: m.code }))
}

function handleClose() {
  form.value = {
    code: '',
    name: '',
    relationType: 'belongsTo',
    sourceModel: '',
    targetModel: '',
    sourceField: '',
    targetField: 'id',
    junctionTable: '',
    status: true
  }
}

async function handleSave() {
  try {
    const data = {
      code: form.value.code,
      name: form.value.name,
      relationType: form.value.relationType,
      sourceModel: form.value.sourceModel,
      targetModel: form.value.targetModel,
      sourceField: form.value.sourceField,
      targetField: form.value.targetField || 'id',
      junctionTable: form.value.junctionTable,
      status: form.value.status ? 1 : 0
    }
    if (isEdit.value) {
      await relationApi.updateRelation(props.data.id, data)
    } else {
      await relationApi.createRelation(data)
    }
    visible.value = false
    emit('saved')
  } catch (error: any) {
    alert(error.message || '保存失败')
  }
}
</script>

<style scoped>
.form-row { display: flex; gap: 12px; }
.form-row .w-form-item { flex: 1; min-width: 0; }
</style>

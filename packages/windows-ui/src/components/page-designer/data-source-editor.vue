<template>
  <div class="data-source-editor">
    <div class="section-title">数据源</div>
    <w-form-item label="数据源类型">
      <w-select :model-value="modelValue?.type" :options="typeOptions" @update:model-value="updateType" />
    </w-form-item>

    <template v-if="modelValue?.type === 'static'">
      <w-form-item label="静态值">
        <w-input v-model="modelValue.value" type="textarea" :rows="3" />
      </w-form-item>
    </template>

    <template v-if="modelValue?.type === 'sql'">
      <w-form-item label="SQL 查询">
        <w-input v-model="modelValue.sql" type="textarea" :rows="4" placeholder="仅支持 SELECT 查询" />
      </w-form-item>
      <w-form-item label="转换脚本">
        <w-input v-model="modelValue.transformScript" type="textarea" :rows="4" placeholder="接收 data 参数，返回处理后的数据" />
      </w-form-item>
    </template>

    <template v-if="modelValue?.type === 'api'">
      <w-form-item label="请求方法">
        <w-select v-model="modelValue.api.method" :options="methodOptions" />
      </w-form-item>
      <w-form-item label="请求地址">
        <w-input v-model="modelValue.api.url" placeholder="/api/lowcode/xxx" />
      </w-form-item>
      <w-form-item label="查询参数（JSON）">
        <w-input v-model="paramsText" type="textarea" :rows="2" />
      </w-form-item>
      <w-form-item label="请求体（JSON）">
        <w-input v-model="bodyText" type="textarea" :rows="2" />
      </w-form-item>
      <w-form-item label="转换脚本">
        <w-input v-model="modelValue.transformScript" type="textarea" :rows="4" />
      </w-form-item>
    </template>

    <template v-if="modelValue?.type === 'script'">
      <w-form-item label="执行脚本">
        <w-input v-model="modelValue.script" type="textarea" :rows="8" placeholder="可调用 db.raw() 和 http()，需返回数据" />
      </w-form-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WPageDataSourceEditor' })

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const typeOptions = [
  { label: '无', value: '' },
  { label: '静态值', value: 'static' },
  { label: 'SQL 查询', value: 'sql' },
  { label: '内部接口', value: 'api' },
  { label: '脚本', value: 'script' }
]

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' }
]

function updateType(type: string) {
  const ds: any = { type }
  if (type === 'api') {
    ds.api = { method: 'GET', url: '', params: {}, body: {} }
  }
  emit('update:modelValue', ds)
}

const paramsText = computed({
  get() {
    return JSON.stringify(props.modelValue?.api?.params || {}, null, 2)
  },
  set(value: string) {
    try {
      if (!props.modelValue.api) props.modelValue.api = {}
      props.modelValue.api.params = JSON.parse(value)
      emit('update:modelValue', props.modelValue)
    } catch {
      // ignore
    }
  }
})

const bodyText = computed({
  get() {
    return JSON.stringify(props.modelValue?.api?.body || {}, null, 2)
  },
  set(value: string) {
    try {
      if (!props.modelValue.api) props.modelValue.api = {}
      props.modelValue.api.body = JSON.parse(value)
      emit('update:modelValue', props.modelValue)
    } catch {
      // ignore
    }
  }
})
</script>

<style scoped>
.data-source-editor { margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee; }
.section-title { font-weight: bold; margin-bottom: 8px; }
</style>

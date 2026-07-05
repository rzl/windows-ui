<template>
  <div class="data-source-editor">
    <div class="section-title">数据源</div>
    <component :is="formItemTag" :size="controlSize" label="数据源类型">
      <component :is="selectTag" :size="controlSize" :model-value="modelValue?.type" :options="typeOptions" @update:model-value="updateType" />
    </component>

    <template v-if="modelValue?.type === 'static'">
      <component :is="formItemTag" :size="controlSize" label="静态值">
        <component :is="inputTag" :size="controlSize" v-model="modelValue.value" type="textarea" :rows="3" />
      </component>
    </template>

    <template v-if="modelValue?.type === 'sql'">
      <component :is="formItemTag" :size="controlSize" label="SQL 查询">
        <component :is="inputTag" :size="controlSize" v-model="modelValue.sql" type="textarea" :rows="4" placeholder="仅支持 SELECT 查询" />
      </component>
      <component :is="formItemTag" :size="controlSize" label="转换脚本">
        <component :is="inputTag" :size="controlSize" v-model="modelValue.transformScript" type="textarea" :rows="4" placeholder="接收 data 参数，返回处理后的数据" />
      </component>
    </template>

    <template v-if="modelValue?.type === 'api'">
      <component :is="formItemTag" :size="controlSize" label="请求方法">
        <component :is="selectTag" :size="controlSize" v-model="modelValue.api.method" :options="methodOptions" />
      </component>
      <component :is="formItemTag" :size="controlSize" label="请求地址">
        <component :is="inputTag" :size="controlSize" v-model="modelValue.api.url" placeholder="/api/lowcode/xxx" />
      </component>
      <component :is="formItemTag" :size="controlSize" label="查询参数（JSON）">
        <component :is="inputTag" :size="controlSize" v-model="paramsText" type="textarea" :rows="2" />
      </component>
      <component :is="formItemTag" :size="controlSize" label="请求体（JSON）">
        <component :is="inputTag" :size="controlSize" v-model="bodyText" type="textarea" :rows="2" />
      </component>
      <component :is="formItemTag" :size="controlSize" label="转换脚本">
        <component :is="inputTag" :size="controlSize" v-model="modelValue.transformScript" type="textarea" :rows="4" />
      </component>
    </template>

    <template v-if="modelValue?.type === 'script'">
      <component :is="formItemTag" :size="controlSize" label="执行脚本">
        <component :is="inputTag" :size="controlSize" v-model="modelValue.script" type="textarea" :rows="8" placeholder="可调用 db.raw() 和 http()，需返回数据" />
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrefix, useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WPageDataSourceEditor' })

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')

const props = defineProps<{
  modelValue: any
  size?: string
}>()

const controlSize = computed(() => props.size || globalSize.value)

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
.data-source-editor { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--w-border-color-light); }
.section-title { font-weight: bold; margin-bottom: 8px; }
</style>

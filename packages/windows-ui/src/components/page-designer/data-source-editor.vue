<template>
  <div class="data-source-editor">
    <div class="section-title">数据源</div>
    <component :is="formItemTag" label="数据源类型">
      <component :is="selectTag" :model-value="modelValue?.type" :options="typeOptions" @update:model-value="updateType" />
    </component>

    <template v-if="modelValue?.type === 'static'">
      <component :is="formItemTag" label="静态值">
        <component :is="inputTag" v-model="modelValue.value" type="textarea" :rows="3" />
      </component>
    </template>

    <template v-if="modelValue?.type === 'sql'">
      <component :is="formItemTag" label="SQL 查询">
        <component :is="inputTag" v-model="modelValue.sql" type="textarea" :rows="4" placeholder="仅支持 SELECT 查询" />
      </component>
      <component :is="formItemTag" label="转换脚本">
        <component :is="inputTag" v-model="modelValue.transformScript" type="textarea" :rows="4" placeholder="接收 data 参数，返回处理后的数据" />
      </component>
    </template>

    <template v-if="modelValue?.type === 'api'">
      <component :is="formItemTag" label="请求方法">
        <component :is="selectTag" v-model="modelValue.api.method" :options="methodOptions" />
      </component>
      <component :is="formItemTag" label="请求地址">
        <component :is="inputTag" v-model="modelValue.api.url" placeholder="/api/lowcode/xxx" />
      </component>
      <component :is="formItemTag" label="查询参数（JSON）">
        <component :is="inputTag" v-model="paramsText" type="textarea" :rows="2" />
      </component>
      <component :is="formItemTag" label="请求体（JSON）">
        <component :is="inputTag" v-model="bodyText" type="textarea" :rows="2" />
      </component>
      <component :is="formItemTag" label="转换脚本">
        <component :is="inputTag" v-model="modelValue.transformScript" type="textarea" :rows="4" />
      </component>
    </template>

    <template v-if="modelValue?.type === 'script'">
      <component :is="formItemTag" label="执行脚本">
        <component :is="inputTag" v-model="modelValue.script" type="textarea" :rows="8" placeholder="可调用 db.raw() 和 http()，需返回数据" />
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrefix } from '../../utils/prefix'

defineOptions({ name: 'WPageDataSourceEditor' })

const { withPrefix } = usePrefix()
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')

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

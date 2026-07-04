<template>
  <div class="event-editor">
    <div class="section-title">事件</div>
    <component :is="formItemTag" label="事件类型">
      <component :is="selectTag" :model-value="eventName" :options="eventNameOptions" @update:model-value="updateEventName" />
    </component>

    <template v-if="eventName && eventConfig">
      <component :is="formItemTag" label="动作">
        <component :is="selectTag" v-model="eventConfig.action" :options="actionOptions" />
      </component>
      <component :is="formItemTag" v-if="showTarget" label="目标">
        <component :is="inputTag" v-model="eventConfig.target" placeholder="路径 / 页面编码 / URL / 变量名" />
      </component>
      <component :is="formItemTag" v-if="showMethod" label="请求方法">
        <component :is="selectTag" v-model="eventConfig.method" :options="methodOptions" />
      </component>
      <component :is="formItemTag" v-if="showParams" label="查询参数(JSON)">
        <component :is="inputTag" v-model="paramsText" type="textarea" :rows="2" />
      </component>
      <component :is="formItemTag" v-if="showBody" label="请求体(JSON)">
        <component :is="inputTag" v-model="bodyText" type="textarea" :rows="2" />
      </component>
      <component :is="formItemTag" v-if="showVariable" label="变量名">
        <component :is="inputTag" v-model="eventConfig.variable" placeholder="pageState 中的变量名" />
      </component>
      <component :is="formItemTag" v-if="showValue" label="变量值">
        <component :is="inputTag" v-model="valueText" type="textarea" :rows="2" placeholder="支持字符串、数字或 JSON" />
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrefix } from '../../utils/prefix'

defineOptions({ name: 'WPageEventEditor' })

const { withPrefix } = usePrefix()
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const eventNameOptions = [
  { label: '无', value: '' },
  { label: '点击 onClick', value: 'onClick' }
]

const actionOptions = [
  { label: '跳转', value: 'navigate' },
  { label: '打开弹窗', value: 'openDialog' },
  { label: '调用接口', value: 'callApi' },
  { label: '设置变量', value: 'setVariable' },
  { label: '刷新页面', value: 'refresh' },
  { label: '返回上一页', value: 'goBack' },
  { label: '打开外部链接', value: 'openExternal' }
]

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' }
]

const eventName = computed(() => {
  if (!props.modelValue) return ''
  return Object.keys(props.modelValue)[0] || ''
})

const eventConfig = computed(() => {
  if (!eventName.value) return null
  return props.modelValue[eventName.value]
})

const showTarget = computed(() => ['navigate', 'openDialog', 'callApi', 'openExternal'].includes(eventConfig.value?.action))
const showMethod = computed(() => eventConfig.value?.action === 'callApi')
const showParams = computed(() => eventConfig.value?.action === 'callApi')
const showBody = computed(() => eventConfig.value?.action === 'callApi')
const showVariable = computed(() => eventConfig.value?.action === 'setVariable')
const showValue = computed(() => eventConfig.value?.action === 'setVariable')

const paramsText = computed({
  get() {
    return JSON.stringify(eventConfig.value?.params || {}, null, 2)
  },
  set(value: string) {
    try {
      eventConfig.value.params = JSON.parse(value)
      emit('update:modelValue', { ...props.modelValue })
    } catch { /* ignore */ }
  }
})

const bodyText = computed({
  get() {
    return JSON.stringify(eventConfig.value?.body || {}, null, 2)
  },
  set(value: string) {
    try {
      eventConfig.value.body = JSON.parse(value)
      emit('update:modelValue', { ...props.modelValue })
    } catch { /* ignore */ }
  }
})

const valueText = computed({
  get() {
    const v = eventConfig.value?.value
    if (v === undefined || v === null) return ''
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2)
  },
  set(value: string) {
    let parsed: any = value
    try {
      parsed = JSON.parse(value)
    } catch {
      // 保持字符串
    }
    eventConfig.value.value = parsed
    emit('update:modelValue', { ...props.modelValue })
  }
})

function updateEventName(name: string) {
  if (!name) {
    emit('update:modelValue', {})
    return
  }
  emit('update:modelValue', {
    [name]: { action: 'navigate', target: '' }
  })
}
</script>

<style scoped>
.event-editor { margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee; }
.section-title { font-weight: bold; margin-bottom: 8px; }
</style>

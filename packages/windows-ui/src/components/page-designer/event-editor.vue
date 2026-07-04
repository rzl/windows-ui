<template>
  <div class="event-editor">
    <div class="section-title">事件</div>
    <component :is="formItemTag" label="事件类型">
      <component :is="selectTag" :model-value="eventName" :options="eventNameOptions" @update:model-value="updateEventName" />
    </component>

    <template v-if="eventName && eventConfig">
      <component :is="formItemTag" label="执行条件">
        <component :is="inputTag" v-model="eventConfig.condition" placeholder="如 formData.status === '1'，为空则始终执行" />
      </component>

      <!-- 链式动作 -->
      <template v-if="isChain && eventConfig.actions">
        <div class="chain-list">
          <div v-for="(action, index) in eventConfig.actions" :key="index" class="chain-item">
            <div class="chain-header">
              <span>动作 {{ index + 1 }}</span>
              <component :is="buttonTag" size="mini" type="danger" @click="removeAction(index)">删除</component>
            </div>
            <component :is="formItemTag" label="动作">
              <component :is="selectTag" v-model="action.action" :options="actionOptions" />
            </component>
            <component :is="formItemTag" v-if="showTarget(action)" label="目标">
              <component :is="inputTag" v-model="action.target" placeholder="路径 / 页面编码 / URL / 变量名" />
            </component>
            <component :is="formItemTag" v-if="showMethod(action)" label="请求方法">
              <component :is="selectTag" v-model="action.method" :options="methodOptions" />
            </component>
            <component :is="formItemTag" v-if="showParams(action)" label="查询参数(JSON)">
              <component :is="inputTag" :model-value="jsonStringify(action.params)" type="textarea" :rows="2" @update:model-value="(v: string) => updateJson(action, 'params', v)" />
            </component>
            <component :is="formItemTag" v-if="showBody(action)" label="请求体(JSON)">
              <component :is="inputTag" :model-value="jsonStringify(action.body)" type="textarea" :rows="2" @update:model-value="(v: string) => updateJson(action, 'body', v)" />
            </component>
            <component :is="formItemTag" v-if="showVariable(action)" label="变量名">
              <component :is="inputTag" v-model="action.variable" placeholder="pageState 中的变量名" />
            </component>
            <component :is="formItemTag" v-if="showValue(action)" label="变量值">
              <component :is="inputTag" :model-value="valueStringify(action.value)" type="textarea" :rows="2" placeholder="支持字符串、数字或 JSON" @update:model-value="(v: string) => updateValue(action, v)" />
            </component>
            <component :is="formItemTag" label="当前条件">
              <component :is="inputTag" v-model="action.condition" placeholder="可选，满足时才执行该动作" />
            </component>
          </div>
        </div>
        <div class="chain-actions">
          <component :is="buttonTag" size="small" @click="addAction">+ 添加动作</component>
          <component :is="buttonTag" size="small" @click="convertToSingle">切换为单个动作</component>
        </div>
      </template>

      <!-- 单个动作 -->
      <template v-else>
        <component :is="formItemTag" label="动作">
          <component :is="selectTag" v-model="eventConfig.action" :options="actionOptions" />
        </component>
        <component :is="formItemTag" v-if="showTarget(eventConfig)" label="目标">
          <component :is="inputTag" v-model="eventConfig.target" placeholder="路径 / 页面编码 / URL / 变量名" />
        </component>
        <component :is="formItemTag" v-if="showMethod(eventConfig)" label="请求方法">
          <component :is="selectTag" v-model="eventConfig.method" :options="methodOptions" />
        </component>
        <component :is="formItemTag" v-if="showParams(eventConfig)" label="查询参数(JSON)">
          <component :is="inputTag" v-model="paramsText" type="textarea" :rows="2" />
        </component>
        <component :is="formItemTag" v-if="showBody(eventConfig)" label="请求体(JSON)">
          <component :is="inputTag" v-model="bodyText" type="textarea" :rows="2" />
        </component>
        <component :is="formItemTag" v-if="showVariable(eventConfig)" label="变量名">
          <component :is="inputTag" v-model="eventConfig.variable" placeholder="pageState 中的变量名" />
        </component>
        <component :is="formItemTag" v-if="showValue(eventConfig)" label="变量值">
          <component :is="inputTag" v-model="valueText" type="textarea" :rows="2" placeholder="支持字符串、数字或 JSON" />
        </component>
        <div class="chain-actions">
          <component :is="buttonTag" size="small" @click="convertToChain">+ 添加链式动作</component>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrefix } from '../../utils/prefix'
import type { PageEventConfig } from './types'

defineOptions({ name: 'WPageEventEditor' })

const { withPrefix } = usePrefix()
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')
const buttonTag = withPrefix('button')

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
  return props.modelValue[eventName.value] as PageEventConfig | null
})

const isChain = computed(() => Array.isArray(eventConfig.value?.actions))

function showTarget(config?: PageEventConfig | null) {
  return config && ['navigate', 'openDialog', 'callApi', 'openExternal'].includes(config.action)
}
function showMethod(config?: PageEventConfig | null) {
  return config?.action === 'callApi'
}
function showParams(config?: PageEventConfig | null) {
  return config?.action === 'callApi'
}
function showBody(config?: PageEventConfig | null) {
  return config?.action === 'callApi'
}
function showVariable(config?: PageEventConfig | null) {
  return config?.action === 'setVariable'
}
function showValue(config?: PageEventConfig | null) {
  return config?.action === 'setVariable'
}

const paramsText = computed({
  get() {
    return jsonStringify(eventConfig.value?.params)
  },
  set(value: string) {
    updateJson(eventConfig.value, 'params', value)
  }
})

const bodyText = computed({
  get() {
    return jsonStringify(eventConfig.value?.body)
  },
  set(value: string) {
    updateJson(eventConfig.value, 'body', value)
  }
})

const valueText = computed({
  get() {
    return valueStringify(eventConfig.value?.value)
  },
  set(value: string) {
    updateValue(eventConfig.value, value)
  }
})

function jsonStringify(value: any) {
  return JSON.stringify(value || {}, null, 2)
}

function valueStringify(value: any) {
  if (value === undefined || value === null) return ''
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

function updateJson(config: PageEventConfig | null | undefined, key: 'params' | 'body', value: string) {
  if (!config) return
  try {
    ;(config as any)[key] = JSON.parse(value)
    emitUpdate()
  } catch { /* ignore invalid json */ }
}

function updateValue(config: PageEventConfig | null | undefined, value: string) {
  if (!config) return
  let parsed: any = value
  try {
    parsed = JSON.parse(value)
  } catch {
    // 保持字符串
  }
  config.value = parsed
  emitUpdate()
}

function emitUpdate() {
  emit('update:modelValue', { ...props.modelValue })
}

function updateEventName(name: string) {
  if (!name) {
    emit('update:modelValue', {})
    return
  }
  emit('update:modelValue', {
    [name]: { action: 'navigate', target: '' }
  })
}

function convertToChain() {
  if (!eventConfig.value || !eventName.value) return
  const current = { ...eventConfig.value }
  delete (current as any).actions
  emit('update:modelValue', {
    [eventName.value]: {
      condition: current.condition || '',
      actions: [current]
    }
  })
}

function convertToSingle() {
  if (!eventConfig.value || !eventName.value || !eventConfig.value.actions?.length) return
  const first = { ...eventConfig.value.actions[0] }
  first.condition = eventConfig.value.condition || first.condition || ''
  emit('update:modelValue', {
    [eventName.value]: first
  })
}

function addAction() {
  if (!eventConfig.value || !eventName.value) return
  const actions = eventConfig.value.actions || []
  actions.push({ action: 'navigate', target: '' })
  emitUpdate()
}

function removeAction(index: number) {
  if (!eventConfig.value?.actions) return
  eventConfig.value.actions.splice(index, 1)
  emitUpdate()
}
</script>

<style scoped>
.event-editor { margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee; }
.section-title { font-weight: bold; margin-bottom: 8px; }
.chain-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }
.chain-item { padding: 12px; border: 1px dashed #d4d0c8; border-radius: 4px; background: #fafafa; }
.chain-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; color: #666; }
.chain-actions { display: flex; gap: 8px; }
</style>

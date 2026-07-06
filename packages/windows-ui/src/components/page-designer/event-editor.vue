<template>
  <div class="event-editor">
    <component :is="formTag" :size="controlSize" label-width="80">
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
                <component :is="buttonTag" :size="controlSize" type="danger" icon="delete" title="删除" @click="removeAction(index)" />
              </div>
              <component :is="formItemTag" label="动作">
                <component :is="selectTag" v-model="action.action" :options="actionOptions" />
              </component>
              <template v-for="field in getActionFields(action.action)" :key="field.key">
                <component :is="formItemTag" :label="field.label">
                  <component
                    :is="inputTag"
                    v-if="field.type === 'input'"
                    :model-value="getFieldValue(action, field.key)"
                    :placeholder="field.placeholder || ''"
                    @update:model-value="(v: any) => setFieldValue(action, field.key, v)"
                  />
                  <component
                    :is="selectTag"
                    v-else-if="field.type === 'select'"
                    :model-value="getFieldValue(action, field.key)"
                    :options="field.options || []"
                    @update:model-value="(v: any) => setFieldValue(action, field.key, v)"
                  />
                  <component
                    :is="switchTag"
                    v-else-if="field.type === 'switch'"
                    :model-value="!!getFieldValue(action, field.key)"
                    @update:model-value="(v: any) => setFieldValue(action, field.key, v)"
                  />
                  <component
                    :is="inputTag"
                    v-else-if="field.type === 'json'"
                    :model-value="jsonStringify(getFieldValue(action, field.key))"
                    type="textarea"
                    :rows="field.rows || 2"
                    :placeholder="field.placeholder || ''"
                    @update:model-value="(v: string) => updateJson(action, field.key, v)"
                  />
                </component>
              </template>
              <component :is="formItemTag" label="当前条件">
                <component :is="inputTag" v-model="action.condition" placeholder="可选，满足时才执行该动作" />
              </component>
            </div>
          </div>
          <div class="chain-actions">
            <component :is="buttonTag" :size="controlSize" @click="addAction">+ 添加动作</component>
            <component :is="buttonTag" :size="controlSize" @click="convertToSingle">切换为单个动作</component>
          </div>
        </template>

        <!-- 单个动作 -->
        <template v-else>
          <component :is="formItemTag" label="动作">
            <component :is="selectTag" v-model="eventConfig.action" :options="actionOptions" />
          </component>
          <template v-for="field in currentActionFields" :key="field.key">
            <component :is="formItemTag" :label="field.label">
              <component
                :is="inputTag"
                v-if="field.type === 'input'"
                :model-value="getFieldValue(eventConfig, field.key)"
                :placeholder="field.placeholder || ''"
                @update:model-value="(v: any) => setFieldValue(eventConfig, field.key, v)"
              />
              <component
                :is="selectTag"
                v-else-if="field.type === 'select'"
                :model-value="getFieldValue(eventConfig, field.key)"
                :options="field.options || []"
                @update:model-value="(v: any) => setFieldValue(eventConfig, field.key, v)"
              />
              <component
                :is="switchTag"
                v-else-if="field.type === 'switch'"
                :model-value="!!getFieldValue(eventConfig, field.key)"
                @update:model-value="(v: any) => setFieldValue(eventConfig, field.key, v)"
              />
              <component
                :is="inputTag"
                v-else-if="field.type === 'json'"
                :model-value="jsonStringify(getFieldValue(eventConfig, field.key))"
                type="textarea"
                :rows="field.rows || 2"
                :placeholder="field.placeholder || ''"
                @update:model-value="(v: string) => updateJson(eventConfig, field.key, v)"
              />
            </component>
          </template>
          <div class="chain-actions">
            <component :is="buttonTag" :size="controlSize" @click="convertToChain">+ 添加链式动作</component>
          </div>
        </template>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import { listActions, getAction } from './plugin-manager'
import type { PageEventConfig, PropertySchemaField } from './types'

defineOptions({ name: 'WPageEventEditor' })

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const formTag = withPrefix('form')
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const selectTag = withPrefix('select')
const switchTag = withPrefix('switch')
const buttonTag = withPrefix('button')

const props = defineProps<{
  modelValue: any
  size?: string
}>()

const emit = defineEmits(['update:modelValue'])

const controlSize = computed(() => props.size || globalSize.value)

const eventNameOptions = [
  { label: '无', value: '' },
  { label: '点击 onClick', value: 'onClick' }
]

const actionOptions = computed(() => listActions().map((a) => ({ label: a.label, value: a.action })))

const eventName = computed(() => {
  if (!props.modelValue) return ''
  return Object.keys(props.modelValue)[0] || ''
})

const eventConfig = computed(() => {
  if (!eventName.value) return null
  return props.modelValue[eventName.value] as PageEventConfig | null
})

const isChain = computed(() => Array.isArray(eventConfig.value?.actions))

const currentActionFields = computed<PropertySchemaField[]>(() => {
  if (!eventConfig.value) return []
  return getActionFields(eventConfig.value.action)
})

function getActionFields(action: string): PropertySchemaField[] {
  return getAction(action)?.fields || []
}

function getFieldValue(obj: any, path: string): any {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

function setFieldValue(obj: any, path: string, value: any) {
  const keys = path.split('.')
  const last = keys.pop()!
  const target = keys.reduce((o, k) => {
    if (o[k] == null) o[k] = {}
    return o[k]
  }, obj)
  target[last] = value
  emitUpdate()
}

function jsonStringify(value: any) {
  return JSON.stringify(value ?? {}, null, 2)
}

function updateJson(config: PageEventConfig | null | undefined, key: string, value: string) {
  if (!config) return
  try {
    setFieldValue(config, key, JSON.parse(value))
  } catch { /* ignore invalid json */ }
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
.event-editor { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--w-border-color-light); }
.section-title { font-weight: bold; margin-bottom: 8px; color: var(--w-text-color-regular); }
.chain-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }
.chain-item { padding: 12px; border: 1px dashed var(--w-border-color-darker); border-radius: 4px; background: var(--w-fill-color-lighter); }
.chain-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; color: var(--w-text-color-secondary); }
.chain-actions { display: flex; gap: 8px; }
</style>

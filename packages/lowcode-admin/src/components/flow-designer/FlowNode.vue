<template>
  <div :class="['flow-node', `flow-node--${data.type}`]">
    <Handle type="target" :position="Position.Top" />
    <div class="flow-node__icon">{{ icon }}</div>
    <div class="flow-node__label">{{ data.name }}</div>
    <div v-if="subLabel" class="flow-node__sub">{{ subLabel }}</div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { FlowNodeData } from './flow-types'

defineOptions({ name: 'FlowNode' })

const props = defineProps<{
  data: FlowNodeData
}>()

const icon = computed(() => {
  const map: Record<string, string> = {
    start: '▶',
    approve: '✓',
    cc: '✉',
    condition: '◆',
    sign: '✍',
    end: '■'
  }
  return map[props.data.type] || '●'
})

const subLabel = computed(() => {
  if (props.data.type === 'approve' && props.data.assigneeValue) {
    return `${props.data.assigneeType || ''}: ${props.data.assigneeValue}`
  }
  if (props.data.type === 'condition' && props.data.condition) {
    return props.data.condition
  }
  if (props.data.type === 'sign') {
    return props.data.signType === 'all' ? '全部通过' : '一人通过'
  }
  return ''
})
</script>

<style scoped>
.flow-node {
  width: 140px;
  padding: 8px;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  background: var(--w-bg-color);
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
}
.flow-node--start { background: #e8f5e9; }
.flow-node--end { background: #ffebee; }
.flow-node--approve { background: #e3f2fd; }
.flow-node--cc { background: #fff3e0; }
.flow-node--condition { background: #f3e5f5; }
.flow-node--sign { background: #e0f7fa; }
.flow-node__icon { font-size: 18px; margin-bottom: 4px; }
.flow-node__label { font-weight: bold; margin-bottom: 2px; }
.flow-node__sub { color: #666; font-size: 10px; word-break: break-all; }
</style>

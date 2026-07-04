<template>
  <div class="page-info">
    <div class="panel-title">页面信息</div>
    <div class="page-info-form">
      <w-form-item label="编码">
        <w-input :model-value="code" readonly />
      </w-form-item>
      <w-form-item label="名称">
        <w-input :model-value="name" @update:model-value="emit('update:name', $event)" />
      </w-form-item>
      <w-form-item label="配置（JSON）">
        <textarea
          :value="configText"
          class="sub-page-config-textarea"
          rows="8"
          placeholder='{"components":[]}'
          @input="emit('update:config-text', ($event.target as HTMLTextAreaElement).value)"
        />
      </w-form-item>
      <div class="sub-page-actions">
        <component :is="buttonTag" size="small" type="primary" @click="emit('apply')">应用</component>
        <component :is="buttonTag" size="small" @click="emit('reset')">重置</component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePrefix } from '../../utils/prefix'
import WFormItem from '../form/form-item.vue'
import WInput from '../input/input.vue'

defineOptions({ name: 'PageInfoPanel' })

const props = defineProps<{
  code: string
  name: string
  configText: string
}>()

const emit = defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'update:config-text', value: string): void
  (e: 'apply'): void
  (e: 'reset'): void
}>()

const { withPrefix } = usePrefix()
const buttonTag = withPrefix('button')

void props
</script>

<style scoped>
.page-info { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.panel-title { font-weight: bold; margin-bottom: 12px; color: var(--w-text-color-primary); }
.page-info-form { padding: 12px; border: 1px dashed var(--w-border-color-darker); border-radius: 4px; background: var(--w-fill-color-lighter); }
.sub-page-actions { display: flex; gap: 8px; margin-top: 8px; }
.sub-page-config-textarea { width: 100%; box-sizing: border-box; border: 1px solid var(--w-border-color); padding: 4px; font-family: var(--w-font-family); font-size: var(--w-font-size-base); color: var(--w-text-color-primary); background: var(--w-bg-color); resize: vertical; }
</style>

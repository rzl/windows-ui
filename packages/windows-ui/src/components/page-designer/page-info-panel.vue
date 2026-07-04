<template>
  <div class="page-info">
    <div class="panel-title">页面信息</div>
    <div class="page-info-form">
      <component :is="formItemTag" label="编码">
        <component :is="inputTag" :model-value="code" readonly />
      </component>
      <component :is="formItemTag" label="名称">
        <component :is="inputTag" :model-value="name" @update:model-value="emit('update:name', $event)" />
      </component>
      <component :is="formItemTag" label="配置（JSON）">
        <component
          :is="inputTag"
          :model-value="configText"
          type="textarea"
          :rows="8"
          placeholder='{"components":[]}'
          @update:model-value="emit('update:config-text', $event)"
        />
      </component>
      <div class="sub-page-actions">
        <component :is="buttonTag" :size="globalSize" type="primary" @click="emit('apply')">应用</component>
        <component :is="buttonTag" :size="globalSize" @click="emit('reset')">重置</component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePrefix, useGlobalSize } from '../../utils/prefix'

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
const globalSize = useGlobalSize()
const buttonTag = withPrefix('button')
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')

void props
</script>

<style scoped>
.page-info { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.panel-title { font-weight: bold; margin-bottom: 12px; color: var(--w-text-color-primary); }
.page-info-form { padding: 12px; border: 1px dashed var(--w-border-color-darker); border-radius: 4px; background: var(--w-fill-color-lighter); }
.sub-page-actions { display: flex; gap: 8px; margin-top: 8px; }

</style>

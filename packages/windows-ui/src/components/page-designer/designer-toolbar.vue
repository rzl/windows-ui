<template>
  <div class="toolbar">
    <component :is="buttonTag" size="small" @click="emit('back')">返回</component>
    <component :is="spaceTag">
      <component :is="buttonTag" size="small" :disabled="!canUndo" @click="emit('undo')">撤销</component>
      <component :is="buttonTag" size="small" :disabled="!canRedo" @click="emit('redo')">重做</component>
      <component :is="buttonTag" size="small" :disabled="!hasSelected" @click="emit('copy')">复制</component>
      <component :is="buttonTag" size="small" :disabled="!hasClipboard" @click="emit('paste')">粘贴</component>
      <component :is="buttonTag" size="small" @click="emit('zoom-out')">缩小</component>
      <component :is="buttonTag" size="small" @click="emit('zoom-reset')">{{ Math.round(zoom * 100) }}%</component>
      <component :is="buttonTag" size="small" @click="emit('zoom-in')">放大</component>
      <component :is="buttonTag" size="small" :type="showGrid ? 'primary' : 'default'" @click="emit('toggle-grid')">网格</component>
      <component :is="buttonTag" size="small" @click="emit('preview')">预览</component>
      <component :is="buttonTag" size="small" @click="emit('preview-config')">预览配置</component>
      <component :is="buttonTag" type="primary" size="small" @click="emit('save')">保存</component>
    </component>
  </div>
</template>

<script setup lang="ts">
import { usePrefix } from '../../utils/prefix'

defineOptions({ name: 'DesignerToolbar' })

const props = defineProps<{
  canUndo: boolean
  canRedo: boolean
  zoom: number
  showGrid: boolean
  hasSelected: boolean
  hasClipboard: boolean
}>()

const emit = defineEmits([
  'back',
  'undo',
  'redo',
  'copy',
  'paste',
  'zoom-out',
  'zoom-reset',
  'zoom-in',
  'toggle-grid',
  'preview',
  'preview-config',
  'save'
])

const { withPrefix } = usePrefix()
const buttonTag = withPrefix('button')
const spaceTag = withPrefix('space')

// 仅用于满足 ts noUnusedLocals，实际模板已使用
void props
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; }
</style>

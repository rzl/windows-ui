<template>
  <div class="toolbar">
    <component :is="buttonTag" :size="globalSize" icon="arrowLeft" title="返回" @click="emit('back')" />
    <component :is="spaceTag">
      <component :is="buttonTag" :size="globalSize" icon="undo" title="撤销 (Ctrl+Z)" :disabled="!canUndo" @click="emit('undo')" />
      <component :is="buttonTag" :size="globalSize" icon="redo" title="重做 (Ctrl+Shift+Z)" :disabled="!canRedo" @click="emit('redo')" />
      <component :is="buttonTag" :size="globalSize" icon="copy" title="复制 (Ctrl+C)" :disabled="!hasSelected" @click="emit('copy')" />
      <component :is="buttonTag" :size="globalSize" icon="paste" title="粘贴 (Ctrl+V)" :disabled="!hasClipboard" @click="emit('paste')" />
      <component :is="buttonTag" :size="globalSize" icon="zoom-out" title="缩小" @click="emit('zoom-out')" />
      <component :is="buttonTag" :size="globalSize" title="重置缩放" @click="emit('zoom-reset')">{{ Math.round(zoom * 100) }}%</component>
      <component :is="buttonTag" :size="globalSize" icon="zoom-in" title="放大" @click="emit('zoom-in')" />
      <component :is="buttonTag" :size="globalSize" icon="grid" title="显示网格" :type="showGrid ? 'primary' : 'default'" @click="emit('toggle-grid')" />
      <component :is="buttonTag" :size="globalSize" :icon="isDark ? 'sun' : 'moon'" :title="isDark ? '切换浅色' : '切换深色'" @click="emit('toggle-dark')" />
      <component :is="buttonTag" :size="globalSize" icon="eye" title="预览" @click="emit('preview')" />
      <component :is="buttonTag" :size="globalSize" icon="code" title="预览配置" @click="emit('preview-config')" />
      <component :is="buttonTag" type="primary" :size="globalSize" icon="save" title="保存" @click="emit('save')" />
    </component>
  </div>
</template>

<script setup lang="ts">
import { usePrefix, useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'DesignerToolbar' })

const props = defineProps<{
  canUndo: boolean
  canRedo: boolean
  zoom: number
  showGrid: boolean
  hasSelected: boolean
  hasClipboard: boolean
  isDark?: boolean
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
  'toggle-dark',
  'preview',
  'preview-config',
  'save'
])

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const buttonTag = withPrefix('button')
const spaceTag = withPrefix('space')

// 仅用于满足 ts noUnusedLocals，实际模板已使用
void props
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; margin-bottom: 12px; }
</style>

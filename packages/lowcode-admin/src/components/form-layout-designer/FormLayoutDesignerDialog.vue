<template>
  <w-dialog
    :model-value="visible"
    title="表单布局设计器"
    fullscreen
    :close-on-click-modal="false"
    @update:model-value="handleVisibleChange"
  >
    <w-page-designer
      v-if="visible"
      :key="renderKey"
      :config="pageConfig"
      @back="close"
      @save="handleDesignerSave"
    />
  </w-dialog>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import type { FormLayout, PageConfig, PageFormLayout } from '@windows-ui/core'
import { toastWarning } from '@/utils/toast'
import { setFormLayoutDesignContext } from './context'
import type { FormLayoutFieldMeta } from './context'
import { registerFormLayoutComponents, unregisterFormLayoutComponents } from './designer-components'
import { formLayoutToComponents } from './convert'

defineOptions({ name: 'FormLayoutDesignerDialog' })

const props = defineProps<{
  visible: boolean
  /** 当前模型的表单布局：新 schema（含 components）/ 旧 FormLayout（打开时自动迁移）/ 空（生成默认布局） */
  layout?: FormLayout | PageFormLayout
  formFields: FormLayoutFieldMeta[]
  models?: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', layout: PageFormLayout | undefined): void
}>()

// 每次打开都重新挂载设计器，确保读取最新注册的组件定义与字段选项
const renderKey = ref(0)
const pageConfig = ref<PageConfig>({ components: [] })

watch(() => props.visible, (visible) => {
  if (visible) {
    setFormLayoutDesignContext({
      formFields: props.formFields,
      models: props.models || []
    })
    registerFormLayoutComponents()
    pageConfig.value = {
      title: '表单布局',
      components: buildComponents(props.layout)
    }
    renderKey.value += 1
  } else {
    unregisterFormLayoutComponents()
  }
}, { immediate: true })

/** 已是新 schema 直接使用；旧 FormLayout / 空布局在打开时迁移为设计器节点 */
function buildComponents(layout: FormLayout | PageFormLayout | undefined): PageConfig['components'] {
  const stored: any = layout
  if (stored && Array.isArray(stored.components)) {
    return JSON.parse(JSON.stringify(stored.components))
  }
  return formLayoutToComponents(layout as FormLayout | undefined)
}

onUnmounted(() => {
  unregisterFormLayoutComponents()
})

function handleVisibleChange(value: boolean) {
  if (!value) close()
}

function close() {
  emit('update:visible', false)
}

function handleDesignerSave(data: any) {
  const subPages = data?.config?.subPages || []
  if (subPages.length) {
    toastWarning('表单布局暂不支持子页面，子页面内容已被忽略')
  }
  // 直接保存页面设计器节点树，运行时由 dynamic-form 的 PageNode 引擎渲染
  const components = data?.config?.components || []
  emit('save', components.length ? { components } : undefined)
  close()
}
</script>

<style>
/* 表单布局设计器画布/预览的节点样式（渲染函数产出，需全局作用域） */
.w-fl-field { min-width: 0; }
.w-fl-field__label { font-size: 12px; color: var(--w-text-color-regular); margin-bottom: 4px; }
.w-fl-field__label .is-required { color: var(--w-color-danger); margin-right: 2px; }
.w-fl-field__missing {
  padding: 8px 12px;
  border: 1px dashed var(--w-border-color);
  background: var(--w-fill-color-lighter);
  color: var(--w-text-color-secondary);
  font-size: 12px;
  border-radius: 3px;
}
.w-fl-field__options { display: flex; flex-wrap: wrap; gap: 8px; }
.w-fl-grid { min-width: 0; }
.w-fl-subtable-tip { margin-top: 8px; font-size: 12px; color: var(--w-text-color-secondary); }
</style>

<template>
  <component :is="componentTag" v-bind="mergedProps">
    <generic-render
      v-for="child in node.children"
      :key="child.id"
      :node="child"
    />
  </component>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { usePrefix } from '../../utils/prefix'
import type { PageNode } from './types'

defineOptions({ name: 'WPageGenericRender' })

const props = defineProps<{
  node: PageNode
}>()

const { withPrefix } = usePrefix()
const componentTag = computed(() => withPrefix(props.node.type))

// 插件组件的字段绑定：node.props.field 指向 formData 键时，
// modelValue 与记录/页面数据双向绑定（与内置表单控件的绑定语义一致）。
// 画布等无 pageContext 的场景保持 props 透传（静态预览）。
const pageContext = inject<any>('pageContext', null)

const mergedProps = computed(() => {
  const ownProps = props.node.props || {}
  const field = ownProps.field as string | undefined
  if (!field || !pageContext) return ownProps
  return {
    ...ownProps,
    modelValue: pageContext.formData[field],
    'onUpdate:modelValue': (value: any) => {
      pageContext.updateFormData(field, value)
    }
  }
})
</script>

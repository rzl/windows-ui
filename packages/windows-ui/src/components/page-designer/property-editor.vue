<template>
  <div class="property-editor">
    <div class="property-group-nav">
      <div
        v-for="group in navGroups"
        :key="group.name"
        class="property-group-nav-item"
        :title="group.name"
        @click="scrollToGroup(group)"
      >
        <component :is="iconTag" :name="group.icon" />
      </div>
    </div>

    <div class="section-title">基础</div>
    <component :is="formTag" :size="globalSize" label-width="80">
      <component :is="formItemTag" label="组件类型">
        <component :is="inputTag" :size="globalSize" :model-value="typeLabel" disabled />
      </component>
    </component>

    <!-- 通用样式 -->
    <schema-property-editor
      ref="styleEditorRef"
      :node="node"
      :schema="styleSchema"
      :size="globalSize"
      @update="emitUpdate"
    />

    <!-- 组件特定属性 -->
    <schema-property-editor
      v-if="componentSchema.length"
      ref="propEditorRef"
      :node="node"
      :schema="componentSchema"
      :size="globalSize"
      @update="emitUpdate"
    />

    <!-- 插件组件 fallback：JSON 编辑 -->
    <template v-if="pluginComponent && !componentSchema.length">
      <component :is="formTag" :size="globalSize" label-width="80">
        <component :is="formItemTag" label="组件编码">
          <component :is="inputTag" :size="globalSize" :model-value="node.type" disabled />
        </component>
        <component :is="formItemTag" label="属性（JSON）">
          <component
            :is="inputTag"
            :size="globalSize"
            :model-value="propsText"
            type="textarea"
            :rows="8"
            @update:model-value="updatePropsText"
          />
        </component>
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SchemaPropertyEditor from './schema-property-editor.vue'
import { getComponent, listCharts } from './plugin-manager'
import { getPropertySchema, styleSchema, getTypeLabel, getGroupIcon } from './property-schemas'
import { usePrefix, useGlobalSize } from '../../utils/prefix'
import type { PageNode, PropertySchemaField } from './types'

defineOptions({ name: 'WPagePropertyEditor' })

const props = defineProps<{
  node: PageNode
}>()

const emit = defineEmits(['update'])

const { withPrefix } = usePrefix()
const globalSize = useGlobalSize()
const formTag = withPrefix('form')
const formItemTag = withPrefix('form-item')
const inputTag = withPrefix('input')
const iconTag = withPrefix('icon')

const styleEditorRef = ref<{ scrollToGroup: (name: string) => void } | null>(null)
const propEditorRef = ref<{ scrollToGroup: (name: string) => void } | null>(null)

interface NavGroup {
  name: string
  icon: string
  source: 'style' | 'props'
}

function extractGroupNames(schema: PropertySchemaField[]): string[] {
  const names: string[] = []
  const seen = new Set<string>()
  for (const field of schema) {
    const name = field.group || '常规'
    if (!seen.has(name)) {
      seen.add(name)
      names.push(name)
    }
  }
  return names
}

const navGroups = computed<NavGroup[]>(() => {
  const groups: NavGroup[] = []
  extractGroupNames(styleSchema).forEach((name) => groups.push({ name, icon: getGroupIcon(name), source: 'style' }))
  extractGroupNames(componentSchema.value).forEach((name) => groups.push({ name, icon: getGroupIcon(name), source: 'props' }))
  return groups
})

function scrollToGroup(group: NavGroup) {
  const editor = group.source === 'style' ? styleEditorRef.value : propEditorRef.value
  editor?.scrollToGroup(group.name)
}

function emitUpdate() {
  emit('update', props.node)
}

const typeLabel = computed(() => getTypeLabel(props.node.type))
const pluginComponent = computed(() => getComponent(props.node.type))

const componentSchema = computed<PropertySchemaField[]>(() => {
  // 插件组件优先使用自身注册的 propertySchema
  if (pluginComponent.value?.propertySchema) {
    return pluginComponent.value.propertySchema as PropertySchemaField[]
  }
  const base = getPropertySchema(props.node.type) || []
  // chart 类型需要动态获取图表类型选项
  if (props.node.type === 'chart') {
    return base.map((field) => {
      if (field.key === 'props.chartType') {
        return { ...field, options: listCharts().map((c) => ({ label: c.label, value: c.type })) }
      }
      return field
    })
  }
  return base
})

const propsText = computed({
  get() {
    return JSON.stringify(props.node.props || {}, null, 2)
  },
  set(value: string) {
    try {
      props.node.props = JSON.parse(value)
      emitUpdate()
    } catch {
      // ignore invalid json
    }
  }
})

function updatePropsText(value: string) {
  propsText.value = value
}
</script>

<style scoped>
.property-editor { padding: 8px 0; }
.section-title { font-weight: bold; margin-bottom: 8px; color: var(--w-text-color-regular); }
.property-group-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--w-border-color-light);
}
.property-group-nav-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--w-border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--w-text-color-secondary);
  transition: all 0.2s;
}
.property-group-nav-item:hover {
  color: var(--w-color-primary);
  border-color: var(--w-color-primary);
  background: var(--w-fill-color-light);
}
</style>

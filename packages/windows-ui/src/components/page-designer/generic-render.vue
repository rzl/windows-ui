<template>
  <component :is="componentTag" v-bind="node.props">
    <generic-render
      v-for="child in node.children"
      :key="child.id"
      :node="child"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrefix } from '../../utils/prefix'
import type { PageNode } from './types'

defineOptions({ name: 'WPageGenericRender' })

const props = defineProps<{
  node: PageNode
}>()

const { withPrefix } = usePrefix()
const componentTag = computed(() => withPrefix(props.node.type))
</script>

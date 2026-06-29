<template>
  <slot v-if="visible" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

defineOptions({ name: 'WPermission' })
const props = defineProps({
  code: { type: String, default: '' },
  has: { type: Function as PropType<(code: string) => boolean>, default: null },
  size: { type: String, default: undefined }
})

const visible = computed(() => {
  if (!props.code) return true
  if (props.has) return props.has(props.code)
  // 默认通过，实际项目中通过注入权限函数控制
  return true
})
</script>

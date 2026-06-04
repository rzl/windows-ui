<template>
  <div class="w-config-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { configProviderContextKey } from '../../utils/prefix'

const props = defineProps({
  prefix: { type: String, default: 'w' },
  size: { type: String, default: 'default' },
  zIndex: { type: Number, default: 2000 }
})

const config = ref({ prefix: props.prefix, size: props.size, zIndex: props.zIndex })
watch(() => [props.prefix, props.size, props.zIndex], ([p, s, z]) => {
  config.value = { prefix: p as string, size: s as string, zIndex: z as number }
}, { immediate: true })
provide(configProviderContextKey, config)
</script>

<style scoped>
.w-config-provider { font-family: var(--w-font-family); }
</style>

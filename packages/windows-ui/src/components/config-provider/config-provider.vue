<template>
  <div class="w-config-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch, onUnmounted } from 'vue'
import { configProviderContextKey } from '../../utils/prefix'

const props = defineProps({
  prefix: { type: String, default: 'w' },
  size: { type: String, default: 'default' },
  zIndex: { type: Number, default: 2000 },
  theme: { type: Object, default: () => ({}) }
})

const config = ref({ prefix: props.prefix, size: props.size, zIndex: props.zIndex })
watch(() => [props.prefix, props.size, props.zIndex], ([p, s, z]) => {
  config.value = { prefix: p as string, size: s as string, zIndex: z as number }
}, { immediate: true })
provide(configProviderContextKey, config)

const themeVarMap: Record<string, string> = {
  primary: '--w-color-primary',
  success: '--w-color-success',
  warning: '--w-color-warning',
  danger: '--w-color-danger',
  info: '--w-color-info',
  bgColor: '--w-bg-color',
  textColor: '--w-text-color-primary'
}

const appliedThemeVars = new Set<string>()

function applyTheme(theme: Record<string, string>) {
  appliedThemeVars.forEach((v) => document.documentElement.style.removeProperty(v))
  appliedThemeVars.clear()
  Object.entries(theme).forEach(([key, val]) => {
    const cssVar = themeVarMap[key] || key
    if (val) {
      document.documentElement.style.setProperty(cssVar, val)
      appliedThemeVars.add(cssVar)
    }
  })
}

watch(() => props.theme, (t) => applyTheme(t as Record<string, string>), { deep: true, immediate: true })

onUnmounted(() => {
  appliedThemeVars.forEach((v) => document.documentElement.style.removeProperty(v))
})
</script>

<style scoped>
.w-config-provider { font-family: var(--w-font-family); }
</style>

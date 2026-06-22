<template>
  <div class="w-config-provider" :style="providerStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { configProviderContextKey } from '../../utils/prefix'
import { localeContextKey, getLocaleMessages, type LocaleType, type LocaleMessages } from '../../locale'

defineOptions({ name: 'WConfigProvider' })

const props = defineProps({
  prefix: { type: String, default: 'w' },
  size: { type: String, default: 'default' },
  zIndex: { type: Number, default: 2000 },
  theme: { type: Object, default: () => ({}) },
  locale: { type: [String, Object], default: 'zh-CN' },
  mode: { type: String as () => 'light' | 'dark' | 'auto', default: 'light' }
})

const config = ref({ prefix: props.prefix, size: props.size, zIndex: props.zIndex, locale: props.locale, mode: props.mode })
watch(() => [props.prefix, props.size, props.zIndex, props.locale, props.mode], ([p, s, z, l, m]) => {
  config.value = { prefix: p as string, size: s as string, zIndex: z as number, locale: l as string | LocaleMessages, mode: m as 'light' | 'dark' | 'auto' }
}, { immediate: true })
provide(configProviderContextKey, config)

const localeKey = computed<LocaleType>(() => {
  if (typeof props.locale === 'string') return props.locale as LocaleType
  return 'zh-CN'
})
const localeMessages = computed<LocaleMessages>(() => {
  if (typeof props.locale === 'object' && props.locale !== null) return props.locale as LocaleMessages
  return getLocaleMessages(localeKey.value)
})

provide(localeContextKey, { locale: localeKey, messages: localeMessages })

/* Mode / dark class handling */
let mediaQuery: MediaQueryList | null = null
let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null

function isDarkMode(mode: string) {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

function updateHtmlMode() {
  if (typeof document === 'undefined') return
  const dark = isDarkMode(props.mode)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

watch(() => props.mode, updateHtmlMode, { immediate: true })

onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQueryListener = (e) => {
    if (props.mode === 'auto') {
      document.documentElement.classList.toggle('dark', e.matches)
      document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light'
    }
  }
  mediaQuery.addEventListener('change', mediaQueryListener)
})

const themeVarMap: Record<string, string> = {
  primary: '--w-color-primary',
  success: '--w-color-success',
  warning: '--w-color-warning',
  danger: '--w-color-danger',
  info: '--w-color-info',
  bgColor: '--w-bg-color',
  textColor: '--w-text-color-primary'
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  }
}

function mixColor(base: string, mix: string, weight: number) {
  const b = hexToRgb(base)
  const m = hexToRgb(mix)
  const w = weight / 100
  const r = Math.round(b.r * w + m.r * (1 - w))
  const g = Math.round(b.g * w + m.g * (1 - w))
  const bl = Math.round(b.b * w + m.b * (1 - w))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}

const shadeKeys = ['lighter', 'light', 'dark', 'darker'] as const
const shadeMixes: Record<(typeof shadeKeys)[number], [string, number]> = {
  lighter: ['#ffffff', 40],
  light: ['#ffffff', 70],
  dark: ['#000000', 70],
  darker: ['#000000', 50]
}

function buildThemeStyle(theme: Record<string, string>) {
  const style: Record<string, string> = {}
  Object.entries(theme).forEach(([key, val]) => {
    const cssVar = themeVarMap[key] || key
    if (val) {
      style[cssVar] = val
      if (['primary', 'success', 'warning', 'danger', 'info'].includes(key)) {
        shadeKeys.forEach((sk) => {
          const [mixColorHex, weight] = shadeMixes[sk]
          style[`${cssVar}-${sk}`] = mixColor(val, mixColorHex, weight)
        })
      }
      if (key === 'primary') {
        style['--w-table-current-row-bg'] = mixColor(val, '#ffffff', 15)
        style['--w-xp-title-bar'] = `linear-gradient(180deg, ${mixColor(val, '#ffffff', 40)} 0%, ${mixColor(val, '#ffffff', 70)} 10%, ${val} 100%)`
        const inactiveVars = [
          { name: '--w-xp-title-bar-inactive-start', weight: 60 },
          { name: '--w-xp-title-bar-inactive-mid', weight: 50 },
          { name: '--w-xp-title-bar-inactive-end', weight: 40 }
        ]
        inactiveVars.forEach(({ name, weight }) => {
          style[name] = mixColor(val, '#ffffff', weight)
        })
      }
    }
  })
  return style
}

const providerStyle = computed(() => buildThemeStyle(props.theme as Record<string, string>))

const appliedVars = new Set<string>()

function applyToDocument(theme: Record<string, string>) {
  appliedVars.forEach((v) => document.documentElement.style.removeProperty(v))
  appliedVars.clear()
  const style = buildThemeStyle(theme)
  Object.entries(style).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val)
    appliedVars.add(key)
  })
}

watch(() => props.theme, (t) => applyToDocument(t as Record<string, string>), { deep: true, immediate: true })

onUnmounted(() => {
  appliedVars.forEach((v) => document.documentElement.style.removeProperty(v))
  if (mediaQuery && mediaQueryListener) {
    mediaQuery.removeEventListener('change', mediaQueryListener)
  }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = ''
  }
})
</script>

<style scoped>
.w-config-provider { font-family: var(--w-font-family); }
</style>

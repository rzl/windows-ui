<template>
  <span :class="['w-icon', `w-icon--${size}`]" v-html="svgContent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'WIcon' })

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'default' },
  color: String
})

const icons: Record<string, string> = {
  info: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#1f91e5"/><text x="8" y="12" text-anchor="middle" fill="white" font-size="10" font-family="Arial" font-weight="bold">i</text></svg>',
  warning: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l7 13H1z" fill="#e4a010"/><text x="8" y="13" text-anchor="middle" fill="black" font-size="10" font-family="Arial" font-weight="bold">!</text></svg>',
  error: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#d92b2b"/><text x="8" y="12" text-anchor="middle" fill="white" font-size="10" font-family="Arial" font-weight="bold">x</text></svg>',
  success: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#3a9e3a"/><path d="M4 8l3 3 5-5" stroke="white" stroke-width="2" fill="none"/></svg>',
  close: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 4l8 8M12 4l-8 8" stroke="#000" stroke-width="2"/></svg>',
  folder: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h5l2 2h7v8H1z" fill="#e4a010" stroke="#a07010"/><path d="M1 3h5l2 2h7v8H1z" fill="none" stroke="#000"/></svg>',
  file: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h8l4 4v10H2z" fill="#fff" stroke="#808080"/><path d="M10 1v4h4" fill="none" stroke="#808080"/></svg>',
  search: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="7" cy="7" r="5" fill="none" stroke="#000"/><path d="M11 11l4 4" stroke="#000" stroke-width="2"/></svg>',
  user: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="5" r="3" fill="#808080"/><path d="M2 14c0-3 3-5 6-5s6 2 6 5" fill="#808080"/></svg>',
  star: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2 5h5l-4 3 1.5 5L8 10l-4.5 4 1.5-5-4-3h5z" fill="#e4a010"/></svg>',
  arrowUp: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2l6 8H2z" fill="#000"/></svg>',
  arrowDown: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 14l-6-8h12z" fill="#000"/></svg>',
  arrowLeft: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 8l8-6v12z" fill="#000"/></svg>',
  arrowRight: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14 8l-8-6v12z" fill="#000"/></svg>',
  menu: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12M2 8h12M2 13h12" stroke="#000" stroke-width="2"/></svg>',
  home: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L1 7h3v8h4V9h2v6h4V7h3z" fill="#808080" stroke="#404040"/></svg>',
  loading: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="2" r="1.5" fill="#245edb"/><circle cx="12" cy="4" r="1.5" fill="#245edb" opacity="0.8"/><circle cx="14" cy="8" r="1.5" fill="#245edb" opacity="0.6"/><circle cx="12" cy="12" r="1.5" fill="#245edb" opacity="0.4"/><circle cx="8" cy="14" r="1.5" fill="#245edb" opacity="0.2"/></svg>',
  fullscreen: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  'fullscreen-exit': '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 2v3H2M11 2v3h3M5 14v-3H2M11 14v-3h3" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>'
}

const svgContent = computed(() => {
  let svg = icons[props.name] || `<span style="font-size:12px">${props.name}</span>`
  if (props.color) svg = svg.replace(/fill="[^"]*"/g, `fill="${props.color}"`).replace(/stroke="[^"]*"/g, `stroke="${props.color}"`)
  return svg
})
</script>

<style scoped>
.w-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
.w-icon--small { width: 12px; height: 12px; }
.w-icon--large { width: 24px; height: 24px; }
</style>

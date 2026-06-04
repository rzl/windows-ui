<template>
  <div class="w-anchor">
    <div
      v-for="link in links"
      :key="link.href"
      :class="['w-anchor__link', { 'is-active': active === link.href }]"
      :style="{ paddingLeft: `${(link.level || 1) * 12}px` }"
      @click="scrollTo(link.href)"
    >{{ link.title }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'WAnchor' })
const props = defineProps({
  links: { type: Array as () => { href: string; title: string; level?: number }[], default: () => [] }
})

const active = ref('')

const scrollTo = (href: string) => {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const handleScroll = () => {
  for (const link of [...props.links].reverse()) {
    const el = document.querySelector(link.href)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 20) { active.value = link.href; break }
    }
  }
}

onMounted(() => { window.addEventListener('scroll', handleScroll); handleScroll() })
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.w-anchor { width: 160px; border-left: 2px solid #d4d0c8; }
.w-anchor__link { padding: 4px 8px; cursor: pointer; font-size: var(--w-font-size-base); color: var(--w-text-color-secondary); }
.w-anchor__link:hover { color: var(--w-color-primary); }
.w-anchor__link.is-active { color: var(--w-color-primary); font-weight: bold; border-left: 2px solid var(--w-color-primary); margin-left: -2px; background: #f0f8ff; }
</style>

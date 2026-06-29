<template>
  <span ref="itemRef" :class="['w-breadcrumb__item', { 'is-last': isLast }]">
    <a v-if="linkHref && !isLast" :href="linkHref"><slot>{{ label }}</slot></a>
    <span v-else><slot>{{ label }}</slot></span>
    <span class="w-breadcrumb__separator">{{ separator }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, inject, ref, onMounted, onUpdated } from 'vue'

defineOptions({ name: 'WBreadcrumbItem' })
const props = defineProps({
  to: [String, Object] as any,
  href: String,
  label: String
})

const breadcrumb = inject<{ separator: string }>('breadcrumb', { separator: '>' })
const separator = computed(() => breadcrumb.separator)
const itemRef = ref<HTMLElement>()
const isLast = ref(false)

const updateLast = () => {
  const el = itemRef.value
  if (!el?.parentElement) return
  isLast.value = el === el.parentElement.lastElementChild
}

onMounted(updateLast)
onUpdated(updateLast)

const linkHref = computed(() => {
  if (props.href) return props.href
  if (typeof props.to === 'string') return props.to
  if (props.to && typeof props.to === 'object') return props.to.path || '#'
  return undefined
})
</script>

<style scoped>
.w-breadcrumb__item:last-child .w-breadcrumb__separator { display: none; }
</style>

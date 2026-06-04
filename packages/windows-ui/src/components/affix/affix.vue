<template>
  <div ref="affixRef" :style="wrapperStyle">
    <div :class="['w-affix', { 'is-fixed': fixed }]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'WAffix' })
const props = defineProps({ offset: { type: Number, default: 0 } })

const affixRef = ref<HTMLDivElement>()
const fixed = ref(false)
let rect: DOMRect | null = null

const handleScroll = () => { if (!rect) return; fixed.value = window.scrollY + props.offset > rect.top }

onMounted(() => { if (affixRef.value) rect = affixRef.value.getBoundingClientRect(); window.addEventListener('scroll', handleScroll) })
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const wrapperStyle = computed(() => fixed.value ? { height: `${rect?.height}px` } : {})
</script>

<style scoped>
.w-affix.is-fixed { position: fixed; top: 0; z-index: var(--w-index-top); }
</style>

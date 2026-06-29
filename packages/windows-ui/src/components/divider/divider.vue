<template>
  <div :class="['w-divider', `w-divider--${direction}`, `w-divider--${size}`]">
    <span v-if="$slots.default || content" :class="['w-divider__text', textClass]">{{ content }}<slot /></span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WDivider' })
const props = defineProps({ direction: { type: String, default: 'horizontal' }, content: String, contentPosition: { type: String, default: 'center' }, size: { type: String, default: undefined } })
import { computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const textClass = computed(() => `w-divider__text--${props.contentPosition}`)
</script>

<style scoped>
.w-divider { display: flex; align-items: center; }
.w-divider--horizontal { width: 100%; margin: 12px 0; border-top: 1px solid #d4d0c8; }
.w-divider--horizontal .w-divider__text { padding: 0 12px; background: var(--w-bg-color); color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); transform: translateY(-50%); }
.w-divider--horizontal .w-divider__text--left { position: absolute; left: 20px; transform: translateY(-50%); }
.w-divider--horizontal .w-divider__text--right { position: absolute; right: 20px; transform: translateY(-50%); }
.w-divider--vertical { display: inline-block; width: 1px; height: 1em; margin: 0 8px; border-left: 1px solid #d4d0c8; vertical-align: middle; }
.w-divider--small.w-divider--horizontal { margin: 8px 0; }
.w-divider--small .w-divider__text { font-size: var(--w-font-size-extra-small); }
.w-divider--large.w-divider--horizontal { margin: 16px 0; }
.w-divider--large .w-divider__text { font-size: var(--w-font-size-base); }
</style>

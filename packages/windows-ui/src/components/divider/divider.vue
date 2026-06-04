<template>
  <div :class="['w-divider', `w-divider--${direction}`]">
    <span v-if="$slots.default || content" class="w-divider__text">{{ content }}<slot /></span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WDivider' })
defineProps({ direction: { type: String, default: 'horizontal' }, content: String })
</script>

<style scoped>
.w-divider { display: flex; align-items: center; }
.w-divider--horizontal { width: 100%; margin: 12px 0; border-top: 1px solid #d4d0c8; }
.w-divider--horizontal .w-divider__text { padding: 0 12px; background: var(--w-bg-color); color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); transform: translateY(-50%); }
.w-divider--vertical { display: inline-block; width: 1px; height: 1em; margin: 0 8px; border-left: 1px solid #d4d0c8; vertical-align: middle; }
</style>

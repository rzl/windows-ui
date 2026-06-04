<template>
  <div v-if="visible" class="w-loading">
    <div class="w-loading__spinner">
      <div class="w-loading__dot" v-for="i in 8" :key="i" />
    </div>
    <div v-if="text" class="w-loading__text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WLoading' })
defineProps({ visible: Boolean, text: String })
</script>

<style scoped>
.w-loading { position: absolute; inset: 0; background: rgba(255,255,255,0.7); z-index: 2000; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.w-loading__spinner { position: relative; width: 32px; height: 32px; }
.w-loading__dot { position: absolute; width: 6px; height: 6px; background: var(--w-color-primary); border-radius: 50%; animation: w-loading-spin 1s linear infinite; }
.w-loading__dot:nth-child(1) { top: 0; left: 13px; animation-delay: 0s; }
.w-loading__dot:nth-child(2) { top: 3px; right: 3px; animation-delay: -0.125s; }
.w-loading__dot:nth-child(3) { top: 13px; right: 0; animation-delay: -0.25s; }
.w-loading__dot:nth-child(4) { bottom: 3px; right: 3px; animation-delay: -0.375s; }
.w-loading__dot:nth-child(5) { bottom: 0; left: 13px; animation-delay: -0.5s; }
.w-loading__dot:nth-child(6) { bottom: 3px; left: 3px; animation-delay: -0.625s; }
.w-loading__dot:nth-child(7) { top: 13px; left: 0; animation-delay: -0.75s; }
.w-loading__dot:nth-child(8) { top: 3px; left: 3px; animation-delay: -0.875s; }
.w-loading__text { margin-top: 8px; font-size: var(--w-font-size-small); color: var(--w-color-primary); }
@keyframes w-loading-spin { 0% { opacity: 1; } 100% { opacity: 0.2; } }
</style>

<template>
  <div :class="['w-layout', `w-layout--${direction}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WLayout' })
defineProps({ direction: { type: String, default: 'vertical' } })
</script>

<style scoped>
.w-layout { display: flex; gap: 0; }
.w-layout--vertical { flex-direction: column; }
.w-layout--horizontal { flex-direction: row; }
</style>

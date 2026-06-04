<template>
  <div :class="['w-container', { 'w-container--fluid': fluid }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WContainer' })
defineProps({ fluid: Boolean })
</script>

<style scoped>
.w-container { max-width: 960px; margin: 0 auto; padding: 8px; background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; }
.w-container--fluid { max-width: 100%; }
</style>

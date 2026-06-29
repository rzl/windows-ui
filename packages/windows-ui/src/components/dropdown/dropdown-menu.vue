<template>
  <div :class="['w-dropdown__menu']">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WDropdownMenu' })
</script>

<style scoped>
.w-dropdown__menu { min-width: 120px; background: var(--w-bg-color); padding: 2px; }
</style>

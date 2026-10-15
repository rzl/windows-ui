<template>
  <div :class="['w-border', `w-border--${type}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'WBorder' })
defineProps({ type: { type: String, default: 'raised' } })
</script>

<style scoped>
.w-border { padding: 4px; }
.w-border--raised { border: 2px solid; border-color: var(--w-xp-bevel-light) var(--w-xp-bevel-dark) var(--w-xp-bevel-dark) var(--w-xp-bevel-light); }
.w-border--sunken { border: 2px solid; border-color: var(--w-xp-bevel-dark) var(--w-xp-bevel-light) var(--w-xp-bevel-light) var(--w-xp-bevel-dark); background: var(--w-bg-color); }
.w-border--field { border: 1px solid var(--w-xp-input-border); }
.w-border--none { border: none; }
</style>

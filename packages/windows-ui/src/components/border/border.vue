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
.w-border--raised { border: 2px solid; border-color: #fff #808080 #808080 #fff; }
.w-border--sunken { border: 2px solid; border-color: #808080 #fff #fff #808080; background: #fff; }
.w-border--field { border: 1px solid #7f9db9; }
.w-border--none { border: none; }
</style>

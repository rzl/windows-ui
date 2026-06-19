<template>
  <slot />
</template>

<script setup lang="ts">
defineOptions({ name: 'WDescriptionsItem' })

defineProps({
  label: { type: String, default: '' },
  prop: { type: String, default: '' }
})
</script>

<template>
  <component :is="tag" :class="['w-text', `w-text--${size}`, `w-text--${type}`]"><slot /></component>
</template>

<script setup lang="ts">
defineOptions({ name: 'WText' })
defineProps({ tag: { type: String, default: 'span' }, size: { type: String, default: 'default' }, type: { type: String, default: 'default' } })
</script>

<style scoped>
.w-text { font-family: var(--w-font-family); }
.w-text--default { font-size: var(--w-font-size-base); color: var(--w-text-color-primary); }
.w-text--small { font-size: var(--w-font-size-small); }
.w-text--large { font-size: var(--w-font-size-large); }
.w-text--primary { color: var(--w-color-primary); }
.w-text--success { color: var(--w-color-success); }
.w-text--warning { color: var(--w-color-warning); }
.w-text--danger { color: var(--w-color-danger); }
.w-text--info { color: var(--w-color-info); }
</style>

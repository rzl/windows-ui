<template>
  <component :is="tag" :class="['w-text', `w-text--${size}`, `w-text--${type}`, { 'is-truncated': truncated }]"><slot /></component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WText' })
const props = defineProps({ tag: { type: String, default: 'span' }, size: { type: String, default: undefined }, type: { type: String, default: 'default' }, truncated: Boolean })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
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
.w-text.is-truncated { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: bottom; }
</style>

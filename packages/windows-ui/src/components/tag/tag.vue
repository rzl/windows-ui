<template>
  <span :class="['w-tag', `w-tag--${type}`, `w-tag--${size}`, { 'is-hit': hit, 'is-closable': closable }]" :style="tagStyle">
    <slot />
    <w-icon v-if="closable" name="close" :size="size" class="w-tag__close" @click="handleClose" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WTag' })
const props = defineProps({ type: { type: String, default: 'default' }, size: { type: String, default: undefined }, closable: Boolean, hit: Boolean, color: String, bgColor: String })
const emit = defineEmits(['close'])
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const tagStyle = computed(() => { const style: Record<string, string> = {}; if (props.color) style.color = props.color; if (props.bgColor) style.backgroundColor = props.bgColor; return style })
const handleClose = () => emit('close')
</script>

<style scoped>
.w-tag { display: inline-flex; align-items: center; gap: 2px; box-sizing: border-box; padding: 2px 8px; border-radius: var(--w-border-radius-base); font-size: var(--w-font-size-base); border: 1px solid #919b9c; background: #f0f0f0; color: var(--w-text-color-primary); height: var(--w-component-size); }
.w-tag--primary { background: #e8f0ff; color: var(--w-color-primary); border-color: var(--w-color-primary); }
.w-tag--success { background: #e8f8e8; color: var(--w-color-success); border-color: var(--w-color-success); }
.w-tag--warning { background: #fff8e0; color: var(--w-color-warning); border-color: var(--w-color-warning); }
.w-tag--danger { background: #ffe8e8; color: var(--w-color-danger); border-color: var(--w-color-danger); }
.w-tag--info { background: #f0f0f0; color: var(--w-color-info); border-color: var(--w-color-info); }
.w-tag--small { padding: 1px 6px; font-size: var(--w-font-size-small); height: var(--w-component-size-small); }
.w-tag--large { padding: 4px 10px; font-size: var(--w-font-size-medium); height: var(--w-component-size-large); }
.w-tag__close { cursor: pointer; margin-left: 2px; }
</style>

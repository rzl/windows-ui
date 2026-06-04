<template>
  <a :class="['w-link', `w-link--${type}`, { 'is-underline': underline, 'is-disabled': disabled }]" :href="disabled ? undefined : href" @click="handleClick">
    <w-icon v-if="icon" :name="icon" size="small" />
    <slot />
  </a>
</template>

<script setup lang="ts">
import WIcon from '../icon/icon.vue'
defineOptions({ name: 'WLink' })
const props = defineProps({ type: { type: String, default: 'default' }, underline: { type: Boolean, default: true }, disabled: Boolean, href: String, icon: String })
const emit = defineEmits(['click'])
const handleClick = (e: MouseEvent) => { if (!props.disabled) emit('click', e) }
</script>

<style scoped>
.w-link { font-family: var(--w-font-family); font-size: var(--w-font-size-base); color: #0000ee; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; }
.w-link.is-underline:hover { text-decoration: underline; }
.w-link--primary { color: #245edb; }
.w-link--success { color: #3a9e3a; }
.w-link--warning { color: #c48810; }
.w-link--danger { color: #d92b2b; }
.w-link--info { color: #808080; }
.w-link.is-disabled { color: #c0c0c0; cursor: not-allowed; }
</style>

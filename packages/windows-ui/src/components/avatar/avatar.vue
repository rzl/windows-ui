<template>
  <div :class="['w-avatar', `w-avatar--${size}`, `w-avatar--${shape}`]" :style="avatarStyle">
    <img v-if="src" :src="src" :alt="alt" @error="handleError" />
    <w-icon v-else-if="icon" :name="icon" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WAvatar' })
const props = defineProps({
  src: String,
  alt: String,
  icon: String,
  size: { type: [String, Number], default: undefined },
  shape: { type: String, default: 'circle' },
  bgColor: String,
  color: String
})

const globalSize = useGlobalSize()
const size = computed(() => props.size !== undefined ? props.size : globalSize.value)

const initials = computed(() => props.alt?.slice(0, 2).toUpperCase() || '?')
const avatarStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) style.backgroundColor = props.bgColor
  if (props.color) style.color = props.color
  if (typeof size.value === 'number') { style.width = `${size.value}px`; style.height = `${size.value}px` }
  return style
})
const handleError = () => {}
</script>

<style scoped>
.w-avatar { display: inline-flex; align-items: center; justify-content: center; background: var(--w-color-primary); color: #fff; overflow: hidden; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-avatar img { width: 100%; height: 100%; object-fit: cover; }
.w-avatar--circle { border-radius: 50%; }
.w-avatar--square { border-radius: var(--w-border-radius-base); }
.w-avatar--default { width: 32px; height: 32px; }
.w-avatar--small { width: 24px; height: 24px; font-size: var(--w-font-size-small); }
.w-avatar--large { width: 40px; height: 40px; font-size: var(--w-font-size-medium); }
</style>

<template>
  <div :class="colClass" :style="colStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

defineOptions({ name: 'WCol' })
const props = defineProps({
  span: { type: Number, default: 24 },
  offset: { type: Number, default: 0 },
  push: { type: Number, default: 0 },
  pull: { type: Number, default: 0 }
})
const gutter = inject<number>('rowGutter', 0)

const colClass = computed(() => {
  const cls = ['w-col']
  if (props.span) cls.push(`w-col-${props.span}`)
  if (props.offset) cls.push(`w-col-offset-${props.offset}`)
  if (props.push) cls.push(`w-col-push-${props.push}`)
  if (props.pull) cls.push(`w-col-pull-${props.pull}`)
  return cls
})

const colStyle = computed(() => {
  if (!gutter) return {}
  const padding = `${gutter / 2}px`
  return { paddingLeft: padding, paddingRight: padding }
})
</script>

<style scoped>
.w-col { float: left; box-sizing: border-box; }
.w-row--flex .w-col { float: none; }
.w-col-0 { display: none; }
.w-col-1 { width: 4.16666667%; }
.w-col-2 { width: 8.33333333%; }
.w-col-3 { width: 12.5%; }
.w-col-4 { width: 16.66666667%; }
.w-col-5 { width: 20.83333333%; }
.w-col-6 { width: 25%; }
.w-col-7 { width: 29.16666667%; }
.w-col-8 { width: 33.33333333%; }
.w-col-9 { width: 37.5%; }
.w-col-10 { width: 41.66666667%; }
.w-col-11 { width: 45.83333333%; }
.w-col-12 { width: 50%; }
.w-col-13 { width: 54.16666667%; }
.w-col-14 { width: 58.33333333%; }
.w-col-15 { width: 62.5%; }
.w-col-16 { width: 66.66666667%; }
.w-col-17 { width: 70.83333333%; }
.w-col-18 { width: 75%; }
.w-col-19 { width: 79.16666667%; }
.w-col-20 { width: 83.33333333%; }
.w-col-21 { width: 87.5%; }
.w-col-22 { width: 91.66666667%; }
.w-col-23 { width: 95.83333333%; }
.w-col-24 { width: 100%; }
.w-col-offset-1 { margin-left: 4.16666667%; }
.w-col-offset-2 { margin-left: 8.33333333%; }
.w-col-offset-3 { margin-left: 12.5%; }
.w-col-offset-4 { margin-left: 16.66666667%; }
.w-col-offset-5 { margin-left: 20.83333333%; }
.w-col-offset-6 { margin-left: 25%; }
.w-col-offset-7 { margin-left: 29.16666667%; }
.w-col-offset-8 { margin-left: 33.33333333%; }
.w-col-offset-9 { margin-left: 37.5%; }
.w-col-offset-10 { margin-left: 41.66666667%; }
.w-col-offset-11 { margin-left: 45.83333333%; }
.w-col-offset-12 { margin-left: 50%; }
.w-col-offset-13 { margin-left: 54.16666667%; }
.w-col-offset-14 { margin-left: 58.33333333%; }
.w-col-offset-15 { margin-left: 62.5%; }
.w-col-offset-16 { margin-left: 66.66666667%; }
.w-col-offset-17 { margin-left: 70.83333333%; }
.w-col-offset-18 { margin-left: 75%; }
.w-col-offset-19 { margin-left: 79.16666667%; }
.w-col-offset-20 { margin-left: 83.33333333%; }
.w-col-offset-21 { margin-left: 87.5%; }
.w-col-offset-22 { margin-left: 91.66666667%; }
.w-col-offset-23 { margin-left: 95.83333333%; }
.w-col-push-1 { left: 4.16666667%; }
.w-col-push-2 { left: 8.33333333%; }
.w-col-push-3 { left: 12.5%; }
.w-col-push-4 { left: 16.66666667%; }
.w-col-push-5 { left: 20.83333333%; }
.w-col-push-6 { left: 25%; }
.w-col-push-7 { left: 29.16666667%; }
.w-col-push-8 { left: 33.33333333%; }
.w-col-push-9 { left: 37.5%; }
.w-col-push-10 { left: 41.66666667%; }
.w-col-push-11 { left: 45.83333333%; }
.w-col-push-12 { left: 50%; }
.w-col-push-13 { left: 54.16666667%; }
.w-col-push-14 { left: 58.33333333%; }
.w-col-push-15 { left: 62.5%; }
.w-col-push-16 { left: 66.66666667%; }
.w-col-push-17 { left: 70.83333333%; }
.w-col-push-18 { left: 75%; }
.w-col-push-19 { left: 79.16666667%; }
.w-col-push-20 { left: 83.33333333%; }
.w-col-push-21 { left: 87.5%; }
.w-col-push-22 { left: 91.66666667%; }
.w-col-push-23 { left: 95.83333333%; }
.w-col-pull-1 { right: 4.16666667%; }
.w-col-pull-2 { right: 8.33333333%; }
.w-col-pull-3 { right: 12.5%; }
.w-col-pull-4 { right: 16.66666667%; }
.w-col-pull-5 { right: 20.83333333%; }
.w-col-pull-6 { right: 25%; }
.w-col-pull-7 { right: 29.16666667%; }
.w-col-pull-8 { right: 33.33333333%; }
.w-col-pull-9 { right: 37.5%; }
.w-col-pull-10 { right: 41.66666667%; }
.w-col-pull-11 { right: 45.83333333%; }
.w-col-pull-12 { right: 50%; }
.w-col-pull-13 { right: 54.16666667%; }
.w-col-pull-14 { right: 58.33333333%; }
.w-col-pull-15 { right: 62.5%; }
.w-col-pull-16 { right: 66.66666667%; }
.w-col-pull-17 { right: 70.83333333%; }
.w-col-pull-18 { right: 75%; }
.w-col-pull-19 { right: 79.16666667%; }
.w-col-pull-20 { right: 83.33333333%; }
.w-col-pull-21 { right: 87.5%; }
.w-col-pull-22 { right: 91.66666667%; }
.w-col-pull-23 { right: 95.83333333%; }
</style>

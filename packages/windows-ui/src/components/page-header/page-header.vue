<template>
  <div :class="['w-page-header', `w-page-header--${size}`]">
    <div class="w-page-header__left">
      <span v-if="showBack" class="w-page-header__back" @click="$emit('back')">&larr; 返回</span>
      <div class="w-page-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div v-if="$slots.extra || $slots.action" class="w-page-header__extra">
      <slot name="action" />
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WPageHeader' })
const props = defineProps({ title: String, showBack: { type: Boolean, default: true }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
defineEmits(['back'])
</script>

<style scoped>
.w-page-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); border-bottom: 1px solid #d4d0c8; }
.w-page-header__left { display: flex; align-items: center; gap: 12px; }
.w-page-header__back { color: var(--w-color-primary); cursor: pointer; font-size: var(--w-font-size-base); }
.w-page-header__back:hover { text-decoration: underline; }
.w-page-header__title { font-size: var(--w-font-size-large); font-weight: bold; color: var(--w-text-color-primary); }
.w-page-header--small { padding: 8px 12px; }
.w-page-header--small .w-page-header__back { font-size: var(--w-font-size-small); }
.w-page-header--small .w-page-header__title { font-size: var(--w-font-size-base); }
.w-page-header--large { padding: 16px 20px; }
.w-page-header--large .w-page-header__back { font-size: var(--w-font-size-medium); }
.w-page-header--large .w-page-header__title { font-size: var(--w-font-size-extra-large); }
</style>
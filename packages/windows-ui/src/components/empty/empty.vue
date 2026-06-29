<template>
  <div :class="['w-empty', `w-empty--${size}`]">
    <w-icon name="folder" :size="size" />
    <p class="w-empty__description">{{ description ?? t('暂无数据') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WIcon from '../icon/icon.vue'
import { useLocale } from '../../locale'
import { useGlobalSize } from '../../utils/prefix'
defineOptions({ name: 'WEmpty' })
const { t } = useLocale()
const props = defineProps({ description: { type: String, default: undefined }, size: { type: String, default: undefined } })
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
</script>

<style scoped>
.w-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; color: var(--w-text-color-secondary); }
.w-empty__description { margin-top: 8px; font-size: var(--w-font-size-base); }
.w-empty--small { padding: 16px; }
.w-empty--small .w-empty__description { font-size: var(--w-font-size-small); }
.w-empty--large { padding: 32px; }
.w-empty--large .w-empty__description { font-size: var(--w-font-size-medium); }
</style>

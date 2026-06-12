<template>
  <div class="w-empty">
    <w-icon name="folder" size="large" />
    <p class="w-empty__description">{{ description ?? t('暂无数据') }}</p>
  </div>
</template>

<script setup lang="ts">
import WIcon from '../icon/icon.vue'
import { useLocale } from '../../locale'
defineOptions({ name: 'WEmpty' })
const { t } = useLocale()
defineProps({ description: { type: String, default: undefined } })
</script>

<style scoped>
.w-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; color: var(--w-text-color-secondary); }
.w-empty__description { margin-top: 8px; font-size: var(--w-font-size-base); }
</style>

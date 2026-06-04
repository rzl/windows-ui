<template>
  <div class="w-pagination">
    <w-button size="small" :disabled="currentPage <= 1" @click="prev">上一页</w-button>
    <span
      v-for="p in pages"
      :key="p"
      :class="['w-pagination__page', { 'is-active': p === currentPage }]"
      @click="goTo(p)"
    >{{ p }}</span>
    <w-button size="small" :disabled="currentPage >= totalPages" @click="next">下一页</w-button>
    <span class="w-pagination__total">共 {{ total }} 条</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WButton from '../button/button.vue'

defineOptions({ name: 'WPagination' })
const props = defineProps({
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 }
})
const emit = defineEmits(['update:currentPage', 'change'])

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const pages = computed(() => {
  const arr: number[] = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(totalPages.value, props.currentPage + 2)
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})

const prev = () => { if (props.currentPage > 1) goTo(props.currentPage - 1) }
const next = () => { if (props.currentPage < totalPages.value) goTo(props.currentPage + 1) }
const goTo = (p: number) => { emit('update:currentPage', p); emit('change', p) }
</script>

<style scoped>
.w-pagination { display: inline-flex; align-items: center; gap: 4px; }
.w-pagination__page { display: inline-block; padding: 2px 8px; cursor: pointer; border: 1px solid #919b9c; background: #fff; font-size: var(--w-font-size-base); }
.w-pagination__page:hover { background: var(--w-xp-blue-light); color: #fff; border-color: var(--w-xp-blue); }
.w-pagination__page.is-active { background: var(--w-color-primary); color: #fff; border-color: var(--w-color-primary); }
.w-pagination__total { font-size: var(--w-font-size-small); color: var(--w-text-color-secondary); margin-left: 8px; }
</style>

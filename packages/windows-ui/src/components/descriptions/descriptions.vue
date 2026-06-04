<template>
  <div class="w-descriptions">
    <div v-if="title" class="w-descriptions__title">{{ title }}</div>
    <table class="w-descriptions__table">
      <tbody>
        <tr v-for="(row, ri) in rows" :key="ri">
          <td v-for="(cell, ci) in row" :key="ci" class="w-descriptions__cell">
            <span class="w-descriptions__label">{{ cell.label }}</span>
            <span class="w-descriptions__value"><slot :name="cell.prop || cell.label" :row="cell">{{ cell.value }}</slot></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'WDescriptions' })
const props = defineProps({ title: String, items: { type: Array as () => { label: string; value?: any; prop?: string }[], default: () => [] }, column: { type: Number, default: 3 } })
const rows = computed(() => { const rows: any[][] = []; for (let i = 0; i < props.items.length; i += props.column) rows.push(props.items.slice(i, i + props.column)); return rows })
</script>

<style scoped>
.w-descriptions { background: var(--w-bg-color); border: 2px solid; border-color: #fff #808080 #808080 #fff; padding: 8px; }
.w-descriptions__title { font-weight: bold; font-size: var(--w-font-size-medium); margin-bottom: 8px; color: var(--w-color-primary); }
.w-descriptions__table { width: 100%; border-collapse: collapse; }
.w-descriptions__cell { padding: 6px 8px; border: 1px solid #d4d0c8; }
.w-descriptions__label { color: var(--w-text-color-secondary); font-size: var(--w-font-size-small); display: block; margin-bottom: 2px; }
.w-descriptions__value { color: var(--w-text-color-primary); font-size: var(--w-font-size-base); }
</style>

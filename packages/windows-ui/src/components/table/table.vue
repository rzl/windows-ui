<template>
  <div class="w-table">
    <table>
      <thead>
        <tr><th v-for="col in columns" :key="col.prop">{{ col.label }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in data" :key="ri">
          <td v-for="col in columns" :key="col.prop"><slot :name="col.prop" :row="row" :$index="ri">{{ row[col.prop] }}</slot></td>
        </tr>
        <tr v-if="!data.length"><td :colspan="columns.length" class="w-table__empty"><w-empty description="暂无数据" /></td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import WEmpty from '../empty/empty.vue'
defineOptions({ name: 'WTable' })
defineProps({ data: { type: Array as () => any[], default: () => [] }, columns: { type: Array as () => { prop: string; label: string }[], default: () => [] } })
</script>

<style scoped>
.w-table { border: 1px solid #919b9c; background: #fff; }
.w-table table { width: 100%; border-collapse: collapse; font-family: var(--w-font-family); font-size: var(--w-font-size-base); }
.w-table th { background: linear-gradient(180deg, #f8f8f8, #e0e0e0); padding: 6px 10px; text-align: left; border-bottom: 1px solid #d4d0c8; font-weight: bold; }
.w-table td { padding: 6px 10px; border-bottom: 1px solid #e8e8e8; }
.w-table tr:hover td { background: #f0f8ff; }
.w-table__empty { text-align: center; padding: 24px; }
</style>

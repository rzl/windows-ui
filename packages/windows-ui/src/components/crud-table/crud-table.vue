<template>
  <div class="w-crud-table">
    <w-search-form
      v-if="searchable"
      :model="query"
      :collapsible="searchCollapsible"
      @search="handleSearch"
      @reset="handleReset"
    >
      <slot name="search" :query="query" />
    </w-search-form>

    <div v-if="$slots.toolbar" class="w-crud-table__toolbar">
      <slot name="toolbar" :selected="selectedRows" />
    </div>

    <w-table
      :data="data"
      :columns="columns"
      :stripe="stripe"
      :border="border"
      :size="size"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @row-click="(...args: any[]) => $emit('row-click', ...args)"
    >
      <template v-for="slot in tableSlots" :key="slot" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </w-table>

    <div class="w-crud-table__pagination">
      <w-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @update:current-page="handlePageChange"
        @update:page-size="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import WSearchForm from '../search-form/search-form.vue'
import WTable from '../table/table.vue'
import WPagination from '../pagination/pagination.vue'
import { useGlobalSize } from '../../utils/prefix'
import type { ColumnItem } from '../table/table.vue'

defineOptions({ name: 'WCrudTable' })

const props = defineProps({
  data: { type: Array as () => any[], default: () => [] },
  columns: { type: Array as () => ColumnItem[], default: () => [] },
  query: { type: Object as () => Record<string, any>, default: () => ({}) },
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  searchable: { type: Boolean, default: true },
  searchCollapsible: { type: Boolean, default: false },
  stripe: { type: Boolean, default: true },
  border: { type: Boolean, default: true },
  highlightCurrentRow: { type: Boolean, default: true },
  size: { type: String as () => 'large' | 'default' | 'small', default: undefined }
})

const emit = defineEmits([
  'search',
  'reset',
  'page-change',
  'size-change',
  'selection-change',
  'row-click'
])

const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)
const slots = useSlots()
const selectedRows = ref<any[]>([])

const tableSlots = computed(() => {
  return Object.keys(slots).filter((name) =>
    name !== 'search' && name !== 'toolbar'
  )
})

function handleSearch() {
  emit('search', props.query)
}

function handleReset() {
  emit('reset')
}

function handlePageChange(page: number) {
  emit('page-change', page)
}

function handleSizeChange(size: number) {
  emit('size-change', size)
}

function handleSelectionChange(rows: any[]) {
  selectedRows.value = rows
  emit('selection-change', rows)
}
</script>

<style scoped>
.w-crud-table { }
.w-crud-table__toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
.w-crud-table__pagination { margin-top: 12px; display: flex; justify-content: flex-end; }
</style>

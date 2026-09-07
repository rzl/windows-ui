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

    <div v-if="$slots.toolbar || showColumnSetting" class="w-crud-table__toolbar">
      <div class="w-crud-table__toolbar-left">
        <slot name="toolbar" :selected="selectedRows" />
      </div>
      <div v-if="showColumnSetting" class="w-crud-table__toolbar-right">
        <w-button
          class="w-crud-table__column-setting-trigger"
          :size="size"
          :title="t('列设置')"
          @click="settingOpen = true"
        >
          <w-icon name="settings" :size="size" />
        </w-button>
      </div>
    </div>

    <w-table
      :data="data"
      :columns="displayColumns"
      :stripe="stripe"
      :border="border"
      :size="size"
      :highlight-current-row="highlightCurrentRow"
      :storage-key="storageKey"
      :column-draggable="columnDraggable"
      @selection-change="handleSelectionChange"
      @row-click="(...args: any[]) => $emit('row-click', ...args)"
      @sort-change="(...args: any[]) => $emit('sort-change', ...args)"
      @column-order-change="handleColumnOrderChange"
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

    <w-drawer v-model="settingOpen" :title="t('列设置')" direction="right" size="420px">
      <div class="w-crud-table__column-setting-body">
        <div class="w-crud-table__column-setting-toolbar">
          <button type="button" class="w-crud-table__column-setting-reset" @click="resetColumnSettings">
            {{ t('重置') }}
          </button>
        </div>
        <w-table
          class="w-crud-table__column-setting-table"
          :data="columnSettings"
          :columns="settingColumns"
          :highlight-current-row="false"
          size="small"
          border
        >
          <template #visible="{ row }">
            <w-checkbox v-model="row.visible" @change="persistColumnSettings" />
          </template>
          <template #label="{ row }">
            {{ row.label }}
          </template>
          <template #fixed="{ row }">
            <select
              v-model="row.fixed"
              class="w-crud-table__column-setting-fixed"
              @change="persistColumnSettings"
            >
              <option value="">{{ t('不冻结') }}</option>
              <option value="left">{{ t('冻结至左侧') }}</option>
              <option value="right">{{ t('冻结至右侧') }}</option>
            </select>
          </template>
          <template #operation="{ $index }">
            <span class="w-crud-table__column-setting-move">
              <button
                type="button"
                class="w-crud-table__column-setting-move-btn"
                :disabled="$index === 0"
                @click="moveColumn($index, -1)"
              >↑</button>
              <button
                type="button"
                class="w-crud-table__column-setting-move-btn"
                :disabled="$index === columnSettings.length - 1"
                @click="moveColumn($index, 1)"
              >↓</button>
            </span>
          </template>
        </w-table>
      </div>
    </w-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import WSearchForm from '../search-form/search-form.vue'
import WTable from '../table/table.vue'
import WPagination from '../pagination/pagination.vue'
import WButton from '../button/button.vue'
import WIcon from '../icon/icon.vue'
import WCheckbox from '../checkbox/checkbox.vue'
import WDrawer from '../drawer/drawer.vue'
import { useGlobalSize } from '../../utils/prefix'
import { useLocale } from '../../locale'
import type { ColumnItem } from '../table/table.vue'

defineOptions({ name: 'WCrudTable' })

interface ColumnSettingItem {
  key: string
  label: string
  visible: boolean
  fixed: '' | 'left' | 'right'
}

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
  size: { type: String as () => 'large' | 'default' | 'small', default: undefined },
  storageKey: { type: String, default: '' },
  columnDraggable: Boolean,
  columnSetting: { type: Boolean, default: true }
})

const emit = defineEmits([
  'search',
  'reset',
  'page-change',
  'size-change',
  'selection-change',
  'row-click',
  'sort-change',
  'column-order-change',
  'update:current-page',
  'update:page-size'
])

const globalSize = useGlobalSize()
const { t } = useLocale()
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

// ----- 列设置（显隐 / 顺序） -----
const columnSettings = ref<ColumnSettingItem[]>([])
const settingOpen = ref(false)

// 可配置列：固定列、勾选列、展开列不参与配置，与 w-table 的列拖拽规则保持一致
const isConfigurable = (col: ColumnItem) => !col.fixed && col.type !== 'selection' && col.type !== 'expand'
const columnKey = (col: ColumnItem) => col.prop || col.label

const showColumnSetting = computed(() => {
  return props.columnSetting && props.columns.some(isConfigurable)
})

const settingsStorageKey = computed(() => props.storageKey ? `w-crud-table-${props.storageKey}` : '')

// 列设置抽屉内表格的列配置（含表头）
const settingColumns = computed<ColumnItem[]>(() => [
  { prop: 'visible', label: t('显示'), width: 52, align: 'center' },
  { prop: 'label', label: t('字段名称') },
  { prop: 'fixed', label: t('冻结'), width: 118, align: 'center' },
  { prop: 'operation', label: t('操作'), width: 60, align: 'center' }
])

watch(() => props.columns, (cols) => {
  const prev = columnSettings.value
  const prevMap = new Map(prev.map(s => [s.key, s]))
  // 仅收集可配置列：固定列、勾选列、展开列不出现在列设置中
  const next: ColumnSettingItem[] = cols.filter(isConfigurable).map((col) => {
    const key = columnKey(col)
    const prevItem = prevMap.get(key)
    return { key, label: col.label, visible: prevItem?.visible ?? true, fixed: prevItem?.fixed ?? '' }
  })
  // 保持既有顺序（含 localStorage 恢复的顺序），新增列追加在末尾
  if (prev.length) {
    const orderMap = new Map(prev.map((s, i) => [s.key, i]))
    next.sort((a, b) =>
      (orderMap.get(a.key) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(b.key) ?? Number.MAX_SAFE_INTEGER)
    )
  }
  columnSettings.value = next
}, { deep: true, immediate: true })

loadColumnSettings()

function loadColumnSettings() {
  if (!settingsStorageKey.value) return
  try {
    const raw = localStorage.getItem(settingsStorageKey.value)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return
    const savedKeys = new Set(parsed.map((s: any) => s.key))
    const merged: ColumnSettingItem[] = []
    parsed.forEach((s: any) => {
      const cur = columnSettings.value.find(c => c.key === s.key)
      if (cur) {
        merged.push({
          ...cur,
          visible: !!s.visible,
          fixed: s.fixed === 'left' || s.fixed === 'right' ? s.fixed : ''
        })
      }
    })
    columnSettings.value.forEach(c => {
      if (!savedKeys.has(c.key)) merged.push(c)
    })
    columnSettings.value = merged
  } catch {
    // ignore
  }
}

function persistColumnSettings() {
  saveColumnSettings()
  syncOrderToTableStorage()
}

function saveColumnSettings() {
  if (!settingsStorageKey.value) return
  localStorage.setItem(settingsStorageKey.value, JSON.stringify(columnSettings.value))
}

// 将当前列顺序同步到 w-table 的本地存储，避免其已保存的顺序覆盖列设置的顺序
function syncOrderToTableStorage() {
  if (!props.storageKey) return
  const order = columnSettings.value.map(s => s.key)
  try {
    const tableKey = `w-table-${props.storageKey}`
    const raw = localStorage.getItem(tableKey)
    const data = raw ? JSON.parse(raw) : {}
    data.order = order
    localStorage.setItem(tableKey, JSON.stringify(data))
  } catch {
    // ignore
  }
}

function resetColumnSettings() {
  const indexMap = new Map(props.columns.map((col, i) => [columnKey(col), i]))
  columnSettings.value = columnSettings.value
    .map(s => ({ ...s, visible: true, fixed: '' as const }))
    .sort((a, b) => (indexMap.get(a.key) ?? 0) - (indexMap.get(b.key) ?? 0))
  if (settingsStorageKey.value) {
    localStorage.removeItem(settingsStorageKey.value)
    localStorage.removeItem(`w-table-${props.storageKey}`)
  }
}

function moveColumn(index: number, offset: number) {
  const target = index + offset
  if (target < 0 || target >= columnSettings.value.length) return
  const list = [...columnSettings.value]
  const [moved] = list.splice(index, 1)
  list.splice(target, 0, moved)
  columnSettings.value = list
  persistColumnSettings()
}

// 表头拖拽排序后同步回列设置，保证弹窗中的顺序与表格一致
function handleColumnOrderChange(order: string[]) {
  const indexMap = new Map(order.map((k, i) => [k, i]))
  columnSettings.value = [...columnSettings.value].sort((a, b) =>
    (indexMap.get(a.key) ?? Number.MAX_SAFE_INTEGER) - (indexMap.get(b.key) ?? Number.MAX_SAFE_INTEGER)
  )
  persistColumnSettings()
  emit('column-order-change', order)
}

// 应用列设置后的实际渲染列：固定列/勾选列/展开列保持原位，其余列按设置排序并过滤隐藏列
const displayColumns = computed<ColumnItem[]>(() => {
  const settings = columnSettings.value
  const settingMap = new Map(settings.map(s => [s.key, s]))
  const indexMap = new Map(settings.map((s, i) => [s.key, i]))
  const visibleMovable = props.columns
    .filter(isConfigurable)
    .filter(c => settingMap.get(columnKey(c))?.visible !== false)
    .sort((a, b) => (indexMap.get(columnKey(a)) ?? 0) - (indexMap.get(columnKey(b)) ?? 0))
    .map(c => {
      const fixed = settingMap.get(columnKey(c))?.fixed
      return fixed ? { ...c, fixed } : c
    })
  const result: ColumnItem[] = []
  let mi = 0
  props.columns.forEach(col => {
    if (!isConfigurable(col)) {
      result.push(col)
      return
    }
    if (settingMap.get(columnKey(col))?.visible === false) return
    result.push(visibleMovable[mi++])
  })
  return result
})
</script>

<style scoped>
.w-crud-table { }
.w-crud-table__toolbar { margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.w-crud-table__toolbar-left { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.w-crud-table__toolbar-right { margin-left: auto; display: flex; align-items: center; }
.w-crud-table__pagination { margin-top: 12px; display: flex; justify-content: flex-end; }

.w-crud-table__column-setting-trigger { padding: 4px 8px; line-height: 1; }
.w-crud-table__column-setting-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.w-crud-table__column-setting-reset {
  background: none; border: none; padding: 0; cursor: pointer;
  font-size: var(--w-font-size-small); color: var(--w-color-primary); font-family: inherit;
}
.w-crud-table__column-setting-list { max-height: 100%; overflow-y: auto; }
.w-crud-table__column-setting-table { font-size: var(--w-font-size-small); }
.w-crud-table__column-setting-table :deep(.w-checkbox__label) { display: none; }
.w-crud-table__column-setting-fixed {
  font-family: inherit; font-size: var(--w-font-size-small); color: var(--w-text-color-regular);
  background: var(--w-bg-color); border: 1px solid #d4d0c8; padding: 1px 2px; cursor: pointer;
}
.w-crud-table__column-setting-move { display: inline-flex; gap: 2px; }
.w-crud-table__column-setting-move-btn {
  background: none; border: 1px solid transparent; padding: 0 4px; cursor: pointer;
  font-size: var(--w-font-size-small); color: var(--w-text-color-regular); line-height: 1.6;
  font-family: inherit;
}
.w-crud-table__column-setting-move-btn:hover:not(:disabled) { border-color: #d4d0c8; background: var(--w-bg-color); }
.w-crud-table__column-setting-move-btn:disabled { color: #b0b0b0; cursor: not-allowed; }

@media (max-width: 768px) {
  .w-crud-table__toolbar { flex-wrap: wrap; }
  .w-crud-table__pagination { justify-content: center; }
}
</style>

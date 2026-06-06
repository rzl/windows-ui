<template>
  <div :class="tableClasses" :style="tableStyle">
    <table>
      <colgroup>
        <col
          v-for="col in normalizedColumns"
          :key="col.__key"
          :style="{ width: (typeof col.width === 'number' ? `${col.width}px` : (col.width || `${colContentWidthPx(col)}px`)) }"
        />
      </colgroup>
      <thead>
        <tr>
          <th
            v-for="col in columnsWithOffset"
            :key="col.__key"
            :class="[headerCellClass(col), stickyClass(col)]"
            :style="[headerCellStyle(col), stickyStyle(col)]"
          >
            <div class="w-table__cell-content">
              <template v-if="col.type === 'selection'">
                <w-checkbox
                  :model-value="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleAllSelection"
                />
              </template>
              <template v-else>
                <slot :name="'header-' + col.prop" :column="col">
                  {{ col.label }}
                </slot>
                <span
                  v-if="col.sortable"
                  class="w-table__sort"
                  @click.stop="handleSort(col)"
                >
                  <w-icon
                    name="arrowUp"
                    size="small"
                    :class="{ 'is-active': sortState.prop === col.prop && sortState.order === 'ascending' }"
                  />
                  <w-icon
                    name="arrowDown"
                    size="small"
                    :class="{ 'is-active': sortState.prop === col.prop && sortState.order === 'descending' }"
                  />
                </span>
                <span
                  v-if="col.filters?.length"
                  class="w-table__filter"
                  @click.stop="toggleFilter(col)"
                >
                  <w-icon
                    name="arrowDown"
                    size="small"
                    :class="{ 'is-active': !!filterState[col.prop]?.length }"
                  />
                  <div
                    v-if="activeFilter === col.prop"
                    class="w-table__filter-panel"
                    @click.stop
                  >
                    <div class="w-table__filter-list">
                      <w-checkbox
                        v-for="f in col.filters"
                        :key="f.value"
                        v-model="filterTempValues"
                        :label="f.value"
                      >
                        {{ f.text }}
                      </w-checkbox>
                    </div>
                    <div class="w-table__filter-actions">
                      <w-button size="small" @click="confirmFilter(col)">
                        确定
                      </w-button>
                      <w-button size="small" @click="resetFilter(col)">
                        重置
                      </w-button>
                    </div>
                  </div>
                </span>
              </template>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(row, ri) in computedData"
          :key="rowKey(row, ri)"
        >
          <tr
            :class="rowClass(row, ri)"
            @click="handleRowClick(row, ri)"
            @dblclick="handleRowDblclick(row, ri)"
          >
            <td
              v-for="col in columnsWithOffset"
              :key="col.__key"
              :class="[cellClass(col), stickyClass(col)]"
              :style="[cellStyle(col), stickyStyle(col)]"
              @click="handleCellClick(row, col, ri)"
            >
              <template v-if="col.type === 'selection'">
                <w-checkbox
                  :model-value="isRowSelected(row, ri)"
                  @change="(v: boolean) => toggleRowSelection(row, ri, v)"
                />
              </template>
              <template v-else-if="col.type === 'expand'">
                <span
                  class="w-table__expand-icon"
                  @click.stop="toggleExpand(row, ri)"
                >
                  {{ isExpanded(row, ri) ? '▼' : '▶' }}
                </span>
              </template>
              <template v-else>
                <slot :name="col.prop" :row="row" :$index="ri">
                  {{ row[col.prop] }}
                </slot>
              </template>
            </td>
          </tr>
          <tr
            v-if="hasExpandColumn && isExpanded(row, ri)"
            :key="'expand-' + rowKey(row, ri)"
            class="w-table__expanded-row"
          >
            <td :colspan="normalizedColumns.length">
              <div class="w-table__expanded-cell">
                <slot
                  name="expand"
                  :row="row"
                  :$index="ri"
                />
              </div>
            </td>
          </tr>
        </template>
        <tr v-if="!computedData.length">
          <td :colspan="normalizedColumns.length" class="w-table__empty">
            <slot name="empty">
              <w-empty :description="emptyText || '暂无数据'" />
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, type PropType } from 'vue'
import WEmpty from '../empty/empty.vue'
import WCheckbox from '../checkbox/checkbox.vue'
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'

defineOptions({ name: 'WTable' })

export interface ColumnItem {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  className?: string
  sortable?: boolean | 'custom'
  filters?: { text: string; value: any }[]
  filterMethod?: (value: any[], row: any) => boolean
  type?: 'selection' | 'expand' | 'default'
  fixed?: 'left' | 'right'
}

const props = defineProps({
  data: { type: Array as () => any[], default: () => [] },
  columns: { type: Array as () => ColumnItem[], default: () => [] },
  stripe: Boolean,
  border: Boolean,
  size: { type: String as () => 'large' | 'default' | 'small', default: 'default' },
  highlightCurrentRow: { type: Boolean, default: true },
  rowClassName: { type: [String, Function] as PropType<string | ((row: any, index: number) => string)>, default: '' },
  emptyText: { type: String, default: '' },
  maxHeight: { type: [String, Number] as PropType<string | number>, default: '' },
  expandRowKeys: { type: Array as () => (string | number)[], default: () => [] }
})

const emit = defineEmits([
  'row-click',
  'row-dblclick',
  'cell-click',
  'selection-change',
  'select',
  'select-all',
  'sort-change',
  'filter-change',
  'current-change',
  'expand-change'
])

// ----- 内部状态 -----
const selectedKeys = ref<(string | number)[]>([])
const currentRow = ref<any>(null)
const currentRowKey = ref<string | number | null>(null)
const sortState = ref<{ prop: string; order: 'ascending' | 'descending' | null }>({ prop: '', order: null })
const filterState = ref<Record<string, any[]>>({})
const activeFilter = ref<string | null>(null)
const filterTempValues = ref<any[]>([])
const expandedKeys = ref<Set<string | number>>(new Set(props.expandRowKeys))

watch(() => props.expandRowKeys, (val) => {
  expandedKeys.value = new Set(val)
})

// ----- 列规范化 -----
const normalizedColumns = computed(() => {
  return props.columns.map((col, i) => ({
    ...col,
    __key: col.type === 'selection' || col.type === 'expand' ? `__${col.type}__${i}` : col.prop,
    type: col.type || 'default',
    align: col.align || 'left'
  }))
})

const hasExpandColumn = computed(() => normalizedColumns.value.some(c => c.type === 'expand'))

// ----- 列宽辅助 -----
// 内容宽度（cellStyle / colgroup 用）
const colContentWidthPx = (col: any): number => {
  if (typeof col.width === 'number') return col.width
  if (typeof col.width === 'string' && col.width.endsWith('px')) return parseInt(col.width)
  if (col.type === 'selection' || col.type === 'expand') return 48
  return 80
}

// 实际占据宽度（固定列偏移量计算用）
const colActualWidthPx = (col: any): number => {
  const w = colContentWidthPx(col)
  const padH = { small: 16, default: 20, large: 24 }[props.size] || 20
  const borderH = props.border ? 2 : 0
  return w + padH + borderH
}

// ----- 固定列偏移计算 -----
const columnsWithOffset = computed(() => {
  const cols = normalizedColumns.value
  const n = cols.length
  let leftAccum = 0
  const leftOffsets: (number | null)[] = new Array(n).fill(null)
  for (let i = 0; i < n; i++) {
    if (cols[i].fixed === 'left') {
      leftOffsets[i] = leftAccum
      leftAccum += colActualWidthPx(cols[i])
    }
  }

  let rightAccum = 0
  const rightOffsets: (number | null)[] = new Array(n).fill(null)
  for (let i = n - 1; i >= 0; i--) {
    if (cols[i].fixed === 'right') {
      rightOffsets[i] = rightAccum
      rightAccum += colActualWidthPx(cols[i])
    }
  }

  const lastLeftIndex = cols.findLastIndex((c: any) => c.fixed === 'left')
  const firstRightIndex = cols.findIndex((c: any) => c.fixed === 'right')

  return cols.map((col, i) => ({
    ...col,
    __leftOffset: leftOffsets[i],
    __rightOffset: rightOffsets[i],
    __isLastLeft: i === lastLeftIndex,
    __isFirstRight: i === firstRightIndex
  }))
})

// ----- 行 key -----
const rowKey = (row: any, index: number) => {
  return row.id ?? row.key ?? row.value ?? index
}

// ----- 展开行 -----
const isExpanded = (row: any, index: number) => {
  return expandedKeys.value.has(rowKey(row, index))
}

const toggleExpand = (row: any, index: number) => {
  const key = rowKey(row, index)
  const newSet = new Set(expandedKeys.value)
  if (newSet.has(key)) newSet.delete(key)
  else newSet.add(key)
  expandedKeys.value = newSet
  emit('expand-change', row, Array.from(newSet))
}

// ----- 表格类名与样式 -----
const hasFixedColumn = computed(() => normalizedColumns.value.some((c: any) => c.fixed === 'left' || c.fixed === 'right'))

const tableClasses = computed(() => {
  return [
    'w-table',
    `w-table--${props.size}`,
    {
      'is-border': props.border,
      'is-stripe': props.stripe,
      'is-scrollable': !!props.maxHeight,
      'has-fixed-column': hasFixedColumn.value
    }
  ]
})

const tableStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    style.overflowY = 'auto'
  }
  return style
})

// ----- 排序处理 -----
const handleSort = (col: ColumnItem) => {
  if (!col.sortable || col.type === 'selection' || col.type === 'expand') return
  const currentOrder = sortState.value.prop === col.prop ? sortState.value.order : null
  let nextOrder: 'ascending' | 'descending' | null = null
  if (currentOrder === null) nextOrder = 'ascending'
  else if (currentOrder === 'ascending') nextOrder = 'descending'
  else nextOrder = null

  sortState.value = { prop: col.prop, order: nextOrder }
  emit('sort-change', { prop: col.prop, order: nextOrder })
}

// ----- 筛选处理 -----
const toggleFilter = (col: ColumnItem) => {
  if (activeFilter.value === col.prop) {
    activeFilter.value = null
  } else {
    activeFilter.value = col.prop
    filterTempValues.value = filterState.value[col.prop] ? [...filterState.value[col.prop]] : []
  }
}

const confirmFilter = (col: ColumnItem) => {
  filterState.value = { ...filterState.value, [col.prop]: [...filterTempValues.value] }
  activeFilter.value = null
  emit('filter-change', { prop: col.prop, values: filterState.value[col.prop] })
}

const resetFilter = (col: ColumnItem) => {
  filterTempValues.value = []
  filterState.value = { ...filterState.value, [col.prop]: [] }
  activeFilter.value = null
  emit('filter-change', { prop: col.prop, values: [] })
}

const closeFilterPanel = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.w-table__filter')) {
    activeFilter.value = null
  }
}

onMounted(() => { document.addEventListener('click', closeFilterPanel) })
onBeforeUnmount(() => { document.removeEventListener('click', closeFilterPanel) })

// ----- 选择处理 -----
const isRowSelected = (row: any, index: number) => {
  return selectedKeys.value.includes(rowKey(row, index))
}

const isAllSelected = computed(() => {
  if (!props.data.length) return false
  return props.data.every((row, i) => selectedKeys.value.includes(rowKey(row, i)))
})

const isIndeterminate = computed(() => {
  if (!props.data.length) return false
  const selectedCount = props.data.filter((row, i) => selectedKeys.value.includes(rowKey(row, i))).length
  return selectedCount > 0 && selectedCount < props.data.length
})

const toggleRowSelection = (row: any, index: number, checked: boolean) => {
  const key = rowKey(row, index)
  const arr = [...selectedKeys.value]
  const idx = arr.indexOf(key)
  if (checked && idx === -1) arr.push(key)
  else if (!checked && idx > -1) arr.splice(idx, 1)
  selectedKeys.value = arr
  const selection = props.data.filter((r, i) => arr.includes(rowKey(r, i)))
  emit('select', selection, row)
  emit('selection-change', selection)
}

const toggleAllSelection = (checked: boolean) => {
  if (checked) {
    const allKeys = props.data.map((row, i) => rowKey(row, i))
    selectedKeys.value = allKeys
    emit('select-all', [...props.data])
    emit('selection-change', [...props.data])
  } else {
    selectedKeys.value = []
    emit('select-all', [])
    emit('selection-change', [])
  }
}

// ----- 行点击 -----
const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
  if (props.highlightCurrentRow) {
    const oldRow = currentRow.value
    currentRow.value = row
    currentRowKey.value = rowKey(row, index)
    emit('current-change', row, oldRow)
  }
}

const handleRowDblclick = (row: any, index: number) => {
  emit('row-dblclick', row, index)
}

const handleCellClick = (row: any, col: ColumnItem, index: number) => {
  emit('cell-click', row, col, row[col.prop], index)
}

// ----- 行样式 -----
const rowClass = (row: any, index: number) => {
  const classes: string[] = []
  if (props.stripe && index % 2 === 1) classes.push('is-striped')
  const key = rowKey(row, index)
  if (props.highlightCurrentRow && currentRowKey.value !== null && currentRowKey.value === key) {
    classes.push('is-current-row')
  }
  if (selectedKeys.value.includes(key)) classes.push('is-selected')
  if (typeof props.rowClassName === 'string' && props.rowClassName) classes.push(props.rowClassName)
  else if (typeof props.rowClassName === 'function') {
    const cls = props.rowClassName(row, index)
    if (cls) classes.push(cls)
  }
  return classes
}

// ----- 单元格样式 -----
const headerCellClass = (col: any) => {
  const classes: string[] = ['w-table__cell']
  if (col.className) classes.push(col.className)
  if (col.align) classes.push(`is-align-${col.align}`)
  return classes
}

const headerCellStyle = (col: any) => {
  const style: Record<string, string> = {}
  if (col.width) {
    const w = typeof col.width === 'number' ? `${col.width}px` : col.width
    style.width = w
    style.minWidth = w
  }
  if (col.minWidth) style.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth
  return style
}

const cellClass = (col: any) => {
  const classes: string[] = ['w-table__cell']
  if (col.className) classes.push(col.className)
  if (col.align) classes.push(`is-align-${col.align}`)
  return classes
}

const cellStyle = (col: any) => {
  const style: Record<string, string> = {}
  if (col.width) {
    const w = typeof col.width === 'number' ? `${col.width}px` : col.width
    style.width = w
    style.minWidth = w
  }
  if (col.minWidth) style.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth
  return style
}

const stickyClass = (col: any) => {
  if (!col.fixed) return []
  const classes: string[] = [`is-fixed-${col.fixed}`]
  if (col.__isLastLeft) classes.push('is-last-fixed-left')
  if (col.__isFirstRight) classes.push('is-first-fixed-right')
  return classes
}

const stickyStyle = (col: any) => {
  const style: Record<string, string> = {}
  if (col.fixed) {
    style.position = 'sticky'
    if (col.fixed === 'left' && col.__leftOffset !== null) {
      style.left = `${col.__leftOffset}px`
    }
    if (col.fixed === 'right' && col.__rightOffset !== null) {
      style.right = `${col.__rightOffset}px`
    }
  }
  return style
}

// ----- 数据计算（筛选 + 排序） -----
const computedData = computed(() => {
  let result = [...props.data]

  // 筛选
  Object.entries(filterState.value).forEach(([prop, values]) => {
    if (!values?.length) return
    const col = props.columns.find(c => c.prop === prop)
    if (!col || !col.filters?.length) return
    result = result.filter(row => {
      if (col.filterMethod) return col.filterMethod(values, row)
      return values.includes(row[prop])
    })
  })

  // 排序
  if (sortState.value.order && sortState.value.prop) {
    const { prop, order } = sortState.value
    const isCustom = props.columns.find(c => c.prop === prop)?.sortable === 'custom'
    if (!isCustom) {
      result.sort((a, b) => {
        const av = a[prop], bv = b[prop]
        if (av === bv) return 0
        if (av == null) return 1
        if (bv == null) return -1
        const r = av > bv ? 1 : -1
        return order === 'ascending' ? r : -r
      })
    }
  }

  return result
})
</script>

<style scoped>
.w-table { border: 1px solid #919b9c; background: #fff; font-family: var(--w-font-family); overflow-x: auto; }
.w-table table { width: auto; min-width: 100%; border-collapse: separate; border-spacing: 0; font-size: var(--w-font-size-base); }
.w-table.has-fixed-column table { table-layout: fixed !important; }
.w-table th { background: linear-gradient(180deg, #f8f8f8, #e0e0e0); padding: 6px 10px; text-align: left; border-bottom: 1px solid #d4d0c8; font-weight: bold; }
.w-table td { padding: 6px 10px; border-bottom: 1px solid #e8e8e8; }
.w-table tr:hover td { background: #f0f8ff; }

/* scrollable / sticky header */
.w-table.is-scrollable { overflow: auto; }
.w-table.is-scrollable th { position: sticky; top: 0; z-index: 2; }

/* size */
.w-table--small th, .w-table--small td { padding: 4px 8px; font-size: 11px; }
.w-table--large th, .w-table--large td { padding: 8px 12px; font-size: 13px; }

/* border */
.w-table.is-border { border: 2px solid #919b9c; }
.w-table.is-border th, .w-table.is-border td { border: 1px solid #d4d0c8; }

/* stripe */
.w-table.is-stripe tr.is-striped td { background: #faf9f6; }
.w-table.is-stripe tr.is-striped:hover td { background: #f0f8ff; }

/* current row */
.w-table tr.is-current-row td { background: var(--w-table-current-row-bg) !important; }
.w-table tr.is-current-row:hover td { background: var(--w-table-current-row-bg) !important; }

/* cell align */
.w-table__cell.is-align-left { text-align: left; }
.w-table__cell.is-align-center { text-align: center; }
.w-table__cell.is-align-right { text-align: right; }

/* cell content wrapper */
.w-table__cell-content { display: inline-flex; align-items: center; gap: 4px; position: relative; }

/* sort */
.w-table__sort { display: inline-flex; flex-direction: column; align-items: center; cursor: pointer; margin-left: 2px; line-height: 1; }
.w-table__sort .w-icon { opacity: 0.35; width: 10px; height: 10px; }
.w-table__sort .w-icon.is-active { opacity: 1; color: var(--w-color-primary); }

/* filter */
.w-table__filter { display: inline-flex; align-items: center; cursor: pointer; margin-left: 2px; position: relative; }
.w-table__filter .w-icon { opacity: 0.35; width: 10px; height: 10px; }
.w-table__filter .w-icon.is-active { opacity: 1; color: var(--w-color-primary); }

.w-table__filter-panel { position: absolute; top: 100%; left: 0; z-index: var(--w-index-popper, 2000); min-width: 120px; background: var(--w-bg-color, #ece9d8); border: 1px solid #808080; box-shadow: 2px 2px 4px rgba(0,0,0,0.2); padding: 8px; margin-top: 4px; }
.w-table__filter-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.w-table__filter-list .w-checkbox { margin-right: 0; }
.w-table__filter-actions { display: flex; gap: 4px; justify-content: flex-end; }

/* expand */
.w-table__expand-icon { cursor: pointer; font-size: 10px; color: #666; display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
.w-table__expand-icon:hover { color: var(--w-color-primary); }
.w-table__expanded-row td { background: #f5f5f5; border-bottom: 1px solid #e0e0e0; padding: 12px 16px; }
.w-table__expanded-cell { padding: 4px 8px; }

/* fixed columns */
.w-table th.is-fixed-left,
.w-table td.is-fixed-left,
.w-table th.is-fixed-right,
.w-table td.is-fixed-right { position: sticky; z-index: 2; background: #fff; }

.w-table th.is-fixed-left,
.w-table th.is-fixed-right { z-index: 3; background: linear-gradient(180deg, #f8f8f8, #e0e0e0); }

/* fixed + hover */
.w-table tr:hover td.is-fixed-left,
.w-table tr:hover td.is-fixed-right { background: #f0f8ff; }

/* fixed + stripe */
.w-table.is-stripe tr.is-striped td.is-fixed-left,
.w-table.is-stripe tr.is-striped td.is-fixed-right { background: #faf9f6; }
.w-table.is-stripe tr.is-striped:hover td.is-fixed-left,
.w-table.is-stripe tr.is-striped:hover td.is-fixed-right { background: #f0f8ff; }

/* fixed + current row */
.w-table tr.is-current-row td.is-fixed-left,
.w-table tr.is-current-row td.is-fixed-right { background: var(--w-table-current-row-bg) !important; }

/* fixed + row status */
.w-table tr.is-warning td.is-fixed-left,
.w-table tr.is-warning td.is-fixed-right { background: #fff8e1; }
.w-table tr.is-danger td.is-fixed-left,
.w-table tr.is-danger td.is-fixed-right { background: #ffebee; }
.w-table tr.is-success td.is-fixed-left,
.w-table tr.is-success td.is-fixed-right { background: #e8f5e9; }

/* fixed column shadow */
.w-table td.is-last-fixed-left { box-shadow: 2px 0 4px rgba(0,0,0,0.08); }
.w-table td.is-first-fixed-right { box-shadow: -2px 0 4px rgba(0,0,0,0.08); }
.w-table th.is-last-fixed-left { box-shadow: 2px 0 4px rgba(0,0,0,0.08); }
.w-table th.is-first-fixed-right { box-shadow: -2px 0 4px rgba(0,0,0,0.08); }

/* empty */
.w-table__empty { text-align: center; padding: 24px; }

/* row status helpers */
.w-table tr.is-warning td { background: #fff8e1; }
.w-table tr.is-danger td { background: #ffebee; }
.w-table tr.is-success td { background: #e8f5e9; }
</style>

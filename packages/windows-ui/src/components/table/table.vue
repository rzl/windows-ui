<template>
  <div ref="tableRef" :class="tableClasses" :style="tableStyle" @scroll="handleTableScroll">
    <table>
      <colgroup>
        <col
          v-for="(col, i) in renderColumns"
          :key="col.__key"
          :style="colStyleForRender(col, i)"
        />
      </colgroup>
      <thead>
        <template v-if="headerRowCount > 1">
          <tr v-for="rowIdx in headerRowCount" :key="rowIdx">
            <th
              v-for="node in collectLevelNodes(headerNodes, rowIdx - 1)"
              :key="node.__key + '-' + rowIdx"
              :colspan="node.__isLeaf ? undefined : node.__leafCount"
              :rowspan="node.__isLeaf ? headerRowCount - node.__level : undefined"
              :class="[headerCellClass(node), stickyClass(node)]"
              :style="[node.__isLeaf ? leafHeaderCellStyle(node, -1) : {}, stickyStyle(node)]"
            >
              <div class="w-table__cell-content">
                <template v-if="node.type === 'selection' && node.__isLeaf">
                  <w-checkbox
                    :model-value="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @change="toggleAllSelection"
                  />
                </template>
                <template v-else-if="node.__isLeaf">
                  <slot :name="'header-' + node.prop" :column="node">
                    {{ node.label }}
                  </slot>
                  <span
                    v-if="node.sortable"
                    class="w-table__sort"
                    @click.stop="handleSort(node)"
                  >
                    <w-icon
                      name="arrowUp"
                      :size="size"
                      :class="{ 'is-active': node.prop && sortState.prop === node.prop && sortState.order === 'ascending' }"
                    />
                    <w-icon
                      name="arrowDown"
                      :size="size"
                      :class="{ 'is-active': node.prop && sortState.prop === node.prop && sortState.order === 'descending' }"
                    />
                  </span>
                  <span
                    v-if="node.filters?.length"
                    class="w-table__filter"
                    @click.stop="toggleFilter(node)"
                  >
                    <w-icon
                      name="arrowDown"
                      :size="size"
                      :class="{ 'is-active': node.prop && !!filterState[node.prop]?.length }"
                    />
                    <div
                      v-if="node.prop && activeFilter === node.prop"
                      class="w-table__filter-panel"
                      @click.stop
                    >
                      <div class="w-table__filter-list">
                        <w-checkbox
                          v-for="f in node.filters"
                          :key="f.value"
                          v-model="filterTempValues"
                          :label="f.value"
                        >
                          {{ f.text }}
                        </w-checkbox>
                      </div>
                      <div class="w-table__filter-actions">
                        <w-button :size="size" @click="confirmFilter(node)">
                          确定
                        </w-button>
                        <w-button :size="size" @click="resetFilter(node)">
                          重置
                        </w-button>
                      </div>
                    </div>
                  </span>
                </template>
                <template v-else>
                  {{ node.label }}
                </template>
              </div>
              <span
                v-if="node.__isLeaf"
                class="w-table__resize-handle"
                @mousedown.stop="(e: MouseEvent) => startResize(e, node)"
                @touchstart.stop.prevent="(e: TouchEvent) => startResize(e, node)"
              />
            </th>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th
              v-for="(col, ci) in renderColumns"
              :key="col.__key"
              :class="[headerCellClass(col), stickyClass(col)]"
              :style="[leafHeaderCellStyle(col, ci), stickyStyle(col)]"
            >
              <template v-if="!col.__isPadding">
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
                        :size="size"
                        :class="{ 'is-active': col.prop && sortState.prop === col.prop && sortState.order === 'ascending' }"
                      />
                      <w-icon
                        name="arrowDown"
                        :size="size"
                        :class="{ 'is-active': col.prop && sortState.prop === col.prop && sortState.order === 'descending' }"
                      />
                    </span>
                    <span
                      v-if="col.filters?.length"
                      class="w-table__filter"
                      @click.stop="toggleFilter(col)"
                    >
                      <w-icon
                        name="arrowDown"
                        :size="size"
                        :class="{ 'is-active': col.prop && !!filterState[col.prop]?.length }"
                      />
                      <div
                        v-if="col.prop && activeFilter === col.prop"
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
                          <w-button :size="size" @click="confirmFilter(col)">
                            确定
                          </w-button>
                          <w-button :size="size" @click="resetFilter(col)">
                            重置
                          </w-button>
                        </div>
                      </div>
                    </span>
                  </template>
                </div>
                <span
                  v-if="!col.__isPadding"
                  class="w-table__resize-handle"
                  @mousedown.stop="(e: MouseEvent) => startResize(e, col)"
                  @touchstart.stop.prevent="(e: TouchEvent) => startResize(e, col)"
                />
              </template>
            </th>
          </tr>
        </template>
      </thead>
      <tbody>
        <tr v-if="topPaddingHeight > 0" :style="{ height: `${topPaddingHeight}px` }">
          <td :colspan="totalColSpan" style="padding: 0; border: none;" />
        </tr>
        <template
          v-for="(item, ri) in visibleFlatRows"
          :key="item.key"
        >
          <tr
            :class="rowClass(item.row, virtualStartIndex + ri)"
            @click="handleRowClick(item.row, virtualStartIndex + ri)"
            @dblclick="handleRowDblclick(item.row, virtualStartIndex + ri)"
          >
            <td
              v-for="(col, ci) in renderColumns"
              :key="col.__key"
              :class="[cellClass(col), stickyClass(col)]"
              :style="[cellStyle(col, ci), stickyStyle(col)]"
              @click="handleCellClick(item.row, col, virtualStartIndex + ri)"
            >
              <template v-if="!col.__isPadding">
                <template v-if="col.type === 'selection'">
                  <w-checkbox
                    :model-value="isRowSelected(item.row, virtualStartIndex + ri)"
                    :indeterminate="isTreeTable && isRowIndeterminate(item)"
                    @change="(v: boolean) => toggleRowSelection(item.row, virtualStartIndex + ri, v)"
                  />
                </template>
                <template v-else-if="col.type === 'expand'">
                  <span
                    class="w-table__expand-icon"
                    @click.stop="toggleExpand(item.row, virtualStartIndex + ri)"
                  >
                    {{ isExpanded(item.row, virtualStartIndex + ri) ? '▼' : '▶' }}
                  </span>
                </template>
                <template v-else>
                  <div class="w-table__cell-content">
                    <template v-if="ci === firstDataColumnIndex && isTreeTable">
                      <span
                        v-for="n in item.level"
                        :key="n"
                        class="w-table__tree-indent"
                        :style="{ width: `${props.indent}px` }"
                      />
                      <span
                        v-if="item.treeNode"
                        class="w-table__tree-expand-icon"
                        :class="{ 'is-loading': isTreeLoading(item) }"
                        @click.stop="toggleTreeExpand(item)"
                      >
                        <template v-if="isTreeLoading(item)">⏳</template>
                        <template v-else>{{ isTreeExpanded(item) ? '▼' : '▶' }}</template>
                      </span>
                      <span v-else class="w-table__tree-expand-icon is-leaf" />
                    </template>
                    <slot :name="col.prop" :row="item.row" :$index="virtualStartIndex + ri">
                      {{ col.prop !== undefined ? item.row[col.prop] : '' }}
                    </slot>
                  </div>
                </template>
              </template>
            </td>
          </tr>
          <tr
            v-if="hasExpandColumn && isExpanded(item.row, virtualStartIndex + ri)"
            :key="'expand-' + item.key"
            class="w-table__expanded-row"
          >
            <td :colspan="totalColSpan">
              <div class="w-table__expanded-cell">
                <slot
                  name="expand"
                  :row="item.row"
                  :$index="virtualStartIndex + ri"
                />
              </div>
            </td>
          </tr>
        </template>
        <tr v-if="bottomPaddingHeight > 0" :style="{ height: `${bottomPaddingHeight}px` }">
          <td :colspan="totalColSpan" style="padding: 0; border: none;" />
        </tr>
        <tr v-if="!computedFlatRows.length">
          <td :colspan="totalColSpan" class="w-table__empty">
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
import { computed, ref, watch, onMounted, onBeforeUnmount, type PropType } from 'vue'
import WEmpty from '../empty/empty.vue'
import WCheckbox from '../checkbox/checkbox.vue'
import WIcon from '../icon/icon.vue'
import WButton from '../button/button.vue'
import { useGlobalSize } from '../../utils/prefix'

defineOptions({ name: 'WTable' })

export interface ColumnItem {
  prop?: string
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
  children?: ColumnItem[]
}

interface HeaderNode extends ColumnItem {
  __level: number
  __isLeaf: boolean
  __leafCount: number
  __key: string
  children?: HeaderNode[]
}

interface TreeNodeInfo {
  level: number
  parent: any | null
  parentKey: string | number | null
  children: any[]
  loaded: boolean
  loading: boolean
  hasChildren: boolean
  expanded: boolean
}

const props = defineProps({
  data: { type: Array as () => any[], default: () => [] },
  columns: { type: Array as () => ColumnItem[], default: () => [] },
  stripe: Boolean,
  border: Boolean,
  size: { type: String as () => 'large' | 'default' | 'small', default: undefined },
  highlightCurrentRow: { type: Boolean, default: true },
  rowClassName: { type: [String, Function] as PropType<string | ((row: any, index: number) => string)>, default: '' },
  emptyText: { type: String, default: '' },
  maxHeight: { type: [String, Number] as PropType<string | number>, default: '' },
  expandRowKeys: { type: Array as () => (string | number)[], default: () => [] },
  rowKey: { type: [String, Function] as PropType<string | ((row: any) => string | number)>, default: 'id' },
  treeProps: { type: Object as () => { children?: string; hasChildren?: string }, default: () => ({ children: 'children', hasChildren: 'hasChildren' }) },
  defaultExpandAll: Boolean,
  lazy: Boolean,
  load: { type: Function as PropType<(row: any, treeNode: any, resolve: (data: any[]) => void) => void>, default: null },
  indent: { type: Number, default: 16 },
  virtualized: Boolean,
  rowHeight: { type: Number, default: 40 },
  height: { type: [String, Number] as PropType<string | number>, default: '' },
  virtualX: Boolean
})
const globalSize = useGlobalSize()
const size = computed(() => props.size || globalSize.value)

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

// ----- 多级表头辅助函数 -----
const analyzeColumns = (columns: ColumnItem[], level: number = 0): HeaderNode[] => {
  return columns.map((col, i) => {
    const hasChildren = col.children && col.children.length > 0
    const baseKey = col.type === 'selection' || col.type === 'expand'
      ? `__${col.type}__${level}__${i}`
      : (col.prop || `__group__${level}__${i}`)
    if (hasChildren) {
      const childNodes = analyzeColumns(col.children!, level + 1)
      const leafCount = childNodes.reduce((sum, c) => sum + c.__leafCount, 0)
      const { children: _c, ...rest } = col
      return {
        ...rest,
        __level: level,
        __isLeaf: false,
        __leafCount: leafCount,
        __key: baseKey,
        children: childNodes,
        type: col.type || 'default',
        align: col.align || 'left'
      } as HeaderNode
    }
    return {
      ...col,
      __level: level,
      __isLeaf: true,
      __leafCount: 1,
      __key: baseKey,
      type: col.type || 'default',
      align: col.align || 'left'
    } as HeaderNode
  })
}

const getMaxDepth = (nodes: HeaderNode[]): number => {
  let max = 0
  const dfs = (node: HeaderNode, depth: number) => {
    if (node.__isLeaf) {
      max = Math.max(max, depth)
    } else if (node.children) {
      node.children.forEach(c => dfs(c, depth + 1))
    }
  }
  nodes.forEach(n => dfs(n, 1))
  return max
}

const collectLevelNodes = (nodes: HeaderNode[], level: number): HeaderNode[] => {
  const result: HeaderNode[] = []
  const walk = (nodeList: HeaderNode[]) => {
    nodeList.forEach(node => {
      if (node.__level === level) {
        result.push(node)
      } else if (!node.__isLeaf && node.children) {
        walk(node.children)
      }
    })
  }
  walk(nodes)
  return result
}

const findLeafColumn = (prop: string): ColumnItem | undefined => {
  const find = (cols: ColumnItem[]): ColumnItem | undefined => {
    for (const col of cols) {
      if (col.prop === prop) return col
      if (col.children) {
        const found = find(col.children)
        if (found) return found
      }
    }
    return undefined
  }
  return find(props.columns)
}

// ----- 虚拟滚动 -----
const tableRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const scrollLeft = ref(0)
const viewportHeight = ref(0)
const viewportWidth = ref(0)

const virtualStartIndex = computed(() => {
  if (!props.virtualized) return 0
  return Math.floor(scrollTop.value / props.rowHeight)
})

const virtualVisibleCount = computed(() => {
  if (!props.virtualized) return computedFlatRows.value.length
  return Math.ceil(viewportHeight.value / props.rowHeight) + 2
})

const virtualEndIndex = computed(() => {
  if (!props.virtualized) return computedFlatRows.value.length
  return Math.min(virtualStartIndex.value + virtualVisibleCount.value, computedFlatRows.value.length)
})

const visibleFlatRows = computed(() => {
  if (!props.virtualized) return computedFlatRows.value
  return computedFlatRows.value.slice(virtualStartIndex.value, virtualEndIndex.value)
})

const topPaddingHeight = computed(() => {
  if (!props.virtualized) return 0
  return virtualStartIndex.value * props.rowHeight
})

const bottomPaddingHeight = computed(() => {
  if (!props.virtualized) return 0
  return (computedFlatRows.value.length - virtualEndIndex.value) * props.rowHeight
})

const handleTableScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
  scrollLeft.value = target.scrollLeft
}

const updateViewport = () => {
  if (tableRef.value) {
    viewportHeight.value = tableRef.value.clientHeight
    viewportWidth.value = tableRef.value.clientWidth
  }
}

onMounted(() => {
  if (props.virtualized) {
    updateViewport()
    window.addEventListener('resize', updateViewport)
  }
})

onBeforeUnmount(() => {
  if (props.virtualized) {
    window.removeEventListener('resize', updateViewport)
  }
})

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

// ----- 树形表格状态 -----
const treeNodeMap = ref<Map<string | number, TreeNodeInfo>>(new Map())
const expandedTreeKeys = ref<Set<string | number>>(new Set())
const flatRows = ref<{ row: any; key: string | number; level: number; treeNode: boolean; parentKey: string | number | null }[]>([])

const isTreeTable = computed(() => {
  return props.data.some(row => {
    const childrenKey = props.treeProps.children || 'children'
    return Array.isArray(row[childrenKey]) && row[childrenKey].length > 0
  }) || props.lazy
})

const firstDataColumnIndex = computed(() => {
  return normalizedColumns.value.findIndex(c => c.type !== 'selection' && c.type !== 'expand')
})

// ----- 行 key -----
const getRowKey = (row: any, index?: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row) ?? index
  }
  if (typeof props.rowKey === 'string') {
    return row[props.rowKey] ?? index
  }
  return row.id ?? row.key ?? row.value ?? index
}

// ----- 扁平化树形数据 -----
const buildTreeNodeMap = (
  rows: any[],
  parent: any | null,
  parentKey: string | number | null,
  level: number,
  newMap: Map<string | number, TreeNodeInfo>
) => {
  const childrenKey = props.treeProps.children || 'children'
  const hasChildrenKey = props.treeProps.hasChildren || 'hasChildren'

  rows.forEach((row, index) => {
    const key = getRowKey(row, index)
    const rawChildren = row[childrenKey]
    const hasChildren = props.lazy
      ? !!row[hasChildrenKey]
      : Array.isArray(rawChildren) && rawChildren.length > 0

    const existing = treeNodeMap.value.get(key)
    let expanded = false
    if (existing) {
      expanded = existing.expanded
    } else if (props.defaultExpandAll) {
      expanded = true
    } else {
      expanded = expandedTreeKeys.value.has(key)
    }

    const nodeInfo: TreeNodeInfo = {
      level,
      parent,
      parentKey,
      children: Array.isArray(rawChildren) ? [...rawChildren] : [],
      loaded: existing ? existing.loaded : (!props.lazy || (Array.isArray(rawChildren) && rawChildren.length > 0)),
      loading: existing ? existing.loading : false,
      hasChildren,
      expanded
    }

    if (existing && existing.loaded && existing.children.length > 0) {
      nodeInfo.children = existing.children
    }

    newMap.set(key, nodeInfo)

    // 递归构建所有子节点的 map（即使未展开）
    if (hasChildren || (Array.isArray(rawChildren) && rawChildren.length > 0)) {
      buildTreeNodeMap(nodeInfo.children, row, key, level + 1, newMap)
    }
  })
}

const rebuildFlatRows = () => {
  const newMap = new Map<string | number, TreeNodeInfo>()
  buildTreeNodeMap(props.data, null, null, 0, newMap)
  treeNodeMap.value = newMap

  const result: typeof flatRows.value = []
  const flattenVisible = (rows: any[], level: number) => {
    rows.forEach((row, index) => {
      const key = getRowKey(row, index)
      const node = newMap.get(key)
      if (!node) return

      const hasChildren = node.hasChildren

      result.push({ row, key, level, treeNode: hasChildren, parentKey: node.parentKey })

      if (node.expanded && node.loaded) {
        flattenVisible(node.children, level + 1)
      }
    })
  }

  flattenVisible(props.data, 0)
  flatRows.value = result
}

watch(() => props.data, rebuildFlatRows, { deep: true, immediate: true })
watch(expandedTreeKeys, rebuildFlatRows, { deep: true })
watch(() => props.defaultExpandAll, rebuildFlatRows)

// ----- 多级表头 computed -----
const headerNodes = computed(() => analyzeColumns(props.columns))
const leafColumns = computed(() => {
  const leaves: HeaderNode[] = []
  const collect = (nodes: HeaderNode[]) => {
    nodes.forEach(node => {
      if (node.__isLeaf) leaves.push(node)
      else if (node.children) collect(node.children)
    })
  }
  collect(headerNodes.value)
  return leaves
})
const headerRowCount = computed(() => getMaxDepth(headerNodes.value))

// ----- 列宽拖拽 -----
const columnWidths = ref<Record<string, number>>({})
const normalizedColumns = computed(() => leafColumns.value)

const hasExpandColumn = computed(() => normalizedColumns.value.some(c => c.type === 'expand'))

// ----- 列宽辅助 -----
const colContentWidthPx = (col: any): number => {
  const key = col.__key || col.prop || String(col.type)
  if (columnWidths.value[key] !== undefined) return columnWidths.value[key]
  if (typeof col.width === 'number') return col.width
  if (typeof col.width === 'string' && col.width.endsWith('px')) return parseInt(col.width)
  if (col.type === 'selection' || col.type === 'expand') return 48
  return 80
}

const colActualWidthPx = (col: any): number => {
  return colContentWidthPx(col)
}

const initColumnWidths = () => {
  const widths: Record<string, number> = {}
  const walk = (cols: ColumnItem[]) => {
    cols.forEach(col => {
      if (col.children && col.children.length > 0) {
        walk(col.children)
      } else {
        const key = col.prop || String(col.type)
        let w = 0
        if (typeof col.width === 'number') w = col.width
        else if (typeof col.width === 'string' && col.width.endsWith('px')) w = parseInt(col.width)
        else if (col.type === 'selection' || col.type === 'expand') w = 48
        else w = 80
        widths[key] = w
      }
    })
  }
  walk(props.columns)
  columnWidths.value = widths
}
watch(() => props.columns, initColumnWidths, { deep: true, immediate: true })

// ----- 列宽拖拽事件 -----
const resizingCol = ref<string | null>(null)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)
const resizedCols = ref<Set<string>>(new Set())

const getClientX = (e: MouseEvent | TouchEvent): number => {
  if ('touches' in e) return e.touches[0]?.clientX ?? 0
  return e.clientX
}

const startResize = (e: MouseEvent | TouchEvent, col: any) => {
  if (col.__isPadding) return
  e.preventDefault()
  const key = col.__key || col.prop || String(col.type)
  resizingCol.value = key
  resizedCols.value.add(key)
  resizeStartX.value = getClientX(e)
  resizeStartWidth.value = colContentWidthPx(col)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize, { passive: false })
  document.addEventListener('touchend', stopResize)
}

const handleResize = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  if (!resizingCol.value) return
  const delta = getClientX(e) - resizeStartX.value
  const newWidth = Math.max(30, resizeStartWidth.value + delta)
  columnWidths.value[resizingCol.value] = newWidth
}

const stopResize = () => {
  resizingCol.value = null
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
}

// ----- 固定列偏移计算 -----
const columnsWithOffset = computed(() => {
  columnWidths.value // 建立响应依赖，拖拽后重新计算偏移量
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

  let lastLeftIndex = -1
  for (let i = n - 1; i >= 0; i--) {
    if (cols[i].fixed === 'left') { lastLeftIndex = i; break }
  }
  const firstRightIndex = cols.findIndex((c: any) => c.fixed === 'right')

  return cols.map((col, i) => ({
    ...col,
    __leftOffset: leftOffsets[i],
    __rightOffset: rightOffsets[i],
    __isLastLeft: i === lastLeftIndex,
    __isFirstRight: i === firstRightIndex
  }))
})

// ----- 横向虚拟滚动 -----
const canVirtualX = computed(() => {
  return props.virtualized && props.virtualX && headerRowCount.value === 1 && !isTreeTable.value && !hasExpandColumn.value
})

const leftFixedCols = computed(() => canVirtualX.value ? columnsWithOffset.value.filter(c => c.fixed === 'left') : [])
const rightFixedCols = computed(() => canVirtualX.value ? columnsWithOffset.value.filter(c => c.fixed === 'right') : [])
const middleCols = computed(() => canVirtualX.value ? columnsWithOffset.value.filter(c => !c.fixed) : [])

const middleStartIndex = computed(() => {
  if (!canVirtualX.value) return 0
  let acc = 0
  for (let i = 0; i < middleCols.value.length; i++) {
    const w = colContentWidthPx(middleCols.value[i])
    if (acc + w > scrollLeft.value) return i
    acc += w
  }
  return middleCols.value.length
})

const middleEndIndex = computed(() => {
  if (!canVirtualX.value) return middleCols.value.length
  let acc = 0
  for (let i = 0; i < middleStartIndex.value; i++) acc += colContentWidthPx(middleCols.value[i])
  for (let i = middleStartIndex.value; i < middleCols.value.length; i++) {
    acc += colContentWidthPx(middleCols.value[i])
    if (acc > scrollLeft.value + viewportWidth.value) return i + 1
  }
  return middleCols.value.length
})

const visibleMiddleCols = computed(() => {
  if (!canVirtualX.value) return []
  return middleCols.value.slice(middleStartIndex.value, middleEndIndex.value)
})

const leftPaddingWidth = computed(() => {
  if (!canVirtualX.value) return 0
  let w = 0
  for (let i = 0; i < middleStartIndex.value; i++) w += colContentWidthPx(middleCols.value[i])
  return w
})

const rightPaddingWidth = computed(() => {
  if (!canVirtualX.value) return 0
  let w = 0
  for (let i = middleEndIndex.value; i < middleCols.value.length; i++) w += colContentWidthPx(middleCols.value[i])
  return w
})

const renderColumns = computed(() => {
  if (!canVirtualX.value) return columnsWithOffset.value
  const result: any[] = []
  leftFixedCols.value.forEach(c => result.push({ ...c, __isPadding: false }))
  if (leftPaddingWidth.value > 0) result.push({ __isPadding: true, __paddingWidth: leftPaddingWidth.value, __key: '__left_padding__' })
  visibleMiddleCols.value.forEach(c => result.push({ ...c, __isPadding: false }))
  if (rightPaddingWidth.value > 0) result.push({ __isPadding: true, __paddingWidth: rightPaddingWidth.value, __key: '__right_padding__' })
  rightFixedCols.value.forEach(c => result.push({ ...c, __isPadding: false }))
  return result
})

const totalColSpan = computed(() => canVirtualX.value ? renderColumns.value.length : normalizedColumns.value.length)

const renderLastFlexibleColIndex = computed(() => {
  const cols = renderColumns.value
  for (let i = cols.length - 1; i >= 0; i--) {
    const c = cols[i]
    if (!c.__isPadding && !c.width && c.type !== 'selection' && c.type !== 'expand') return i
  }
  return -1
})

const colStyleForRender = (col: any, index: number): Record<string, string> => {
  if (col.__isPadding) {
    return { width: `${col.__paddingWidth}px`, minWidth: `${col.__paddingWidth}px` }
  }
  const isFlexible = index === renderLastFlexibleColIndex.value
  if (!isFlexible) {
    const wpx = `${colContentWidthPx(col)}px`
    return { width: wpx, minWidth: wpx, maxWidth: wpx }
  }
  return { minWidth: `${colContentWidthPx(col)}px` }
}

// ----- 展开行 -----
const isExpanded = (row: any, index: number) => {
  return expandedKeys.value.has(getRowKey(row, index))
}

const toggleExpand = (row: any, index: number) => {
  const key = getRowKey(row, index)
  const newSet = new Set(expandedKeys.value)
  if (newSet.has(key)) newSet.delete(key)
  else newSet.add(key)
  expandedKeys.value = newSet
  emit('expand-change', row, Array.from(newSet))
}

// ----- 表格类名与样式 -----
const hasFixedColumn = computed(() => normalizedColumns.value.some((c: any) => c.fixed === 'left' || c.fixed === 'right' || c.width))

const tableClasses = computed(() => {
  return [
    'w-table',
    `w-table--${size.value}`,
    {
      'is-border': props.border,
      'is-stripe': props.stripe,
      'is-scrollable': !!props.maxHeight || props.virtualized,
      'has-fixed-column': hasFixedColumn.value,
      'is-tree-table': isTreeTable.value,
      'is-virtualized': props.virtualized
    }
  ]
})

const tableStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    style.overflowY = 'auto'
  } else if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    style.overflowY = 'auto'
  }
  return style
})

// ----- 排序处理 -----
const handleSort = (col: ColumnItem) => {
  if (!col.sortable || col.type === 'selection' || col.type === 'expand' || !col.prop) return
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
  if (!col.prop) return
  if (activeFilter.value === col.prop) {
    activeFilter.value = null
  } else {
    activeFilter.value = col.prop
    filterTempValues.value = filterState.value[col.prop] ? [...filterState.value[col.prop]] : []
  }
}

const confirmFilter = (col: ColumnItem) => {
  if (!col.prop) return
  filterState.value = { ...filterState.value, [col.prop]: [...filterTempValues.value] }
  activeFilter.value = null
  emit('filter-change', { prop: col.prop, values: filterState.value[col.prop] })
}

const resetFilter = (col: ColumnItem) => {
  if (!col.prop) return
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

// ----- 树形展开 -----
const isTreeExpanded = (item: any) => {
  const node = treeNodeMap.value.get(item.key)
  return node ? node.expanded : false
}

const isTreeLoading = (item: any) => {
  const node = treeNodeMap.value.get(item.key)
  return node ? node.loading : false
}

const toggleTreeExpand = (item: any) => {
  const key = item.key
  const node = treeNodeMap.value.get(key)
  if (!node) return

  if (node.hasChildren && !node.loaded && props.lazy && props.load) {
    node.loading = true
    treeNodeMap.value = new Map(treeNodeMap.value)

    props.load(item.row, node, (children: any[]) => {
      node.children = children
      node.loaded = true
      node.loading = false
      node.expanded = true
      expandedTreeKeys.value = new Set([...expandedTreeKeys.value, key])
      treeNodeMap.value = new Map(treeNodeMap.value)
      rebuildFlatRows()
    })
    return
  }

  node.expanded = !node.expanded
  const newSet = new Set(expandedTreeKeys.value)
  if (node.expanded) newSet.add(key)
  else newSet.delete(key)
  expandedTreeKeys.value = newSet
  treeNodeMap.value = new Map(treeNodeMap.value)
  rebuildFlatRows()
}

// ----- 选择处理 -----
const isRowSelected = (row: any, index: number) => {
  return selectedKeys.value.includes(getRowKey(row, index))
}

const isRowIndeterminate = (item: any) => {
  if (!isTreeTable.value) return false
  const node = treeNodeMap.value.get(item.key)
  if (!node || !node.children.length) return false
  const childKeys = node.children.map((child: any) => getRowKey(child))
  const selectedChildren = childKeys.filter((k: string | number) => selectedKeys.value.includes(k))
  return selectedChildren.length > 0 && selectedChildren.length < childKeys.length
}

const getDescendantKeys = (row: any): (string | number)[] => {
  const key = getRowKey(row)
  const node = treeNodeMap.value.get(key)
  if (!node || !node.children.length) return []
  const result: (string | number)[] = []
  const collect = (children: any[]) => {
    children.forEach(child => {
      const childKey = getRowKey(child)
      result.push(childKey)
      const childNode = treeNodeMap.value.get(childKey)
      if (childNode && childNode.children.length) {
        collect(childNode.children)
      }
    })
  }
  collect(node.children)
  return result
}

const updateParentSelections = (row: any, selectedArr: (string | number)[]) => {
  const key = getRowKey(row)
  const node = treeNodeMap.value.get(key)
  if (!node || !node.parentKey) return

  const parentKey = node.parentKey
  const parentNode = treeNodeMap.value.get(parentKey)
  if (!parentNode) return

  const siblingKeys = parentNode.children.map((child: any) => getRowKey(child))
  const selectedSiblings = siblingKeys.filter((k: string | number) => selectedArr.includes(k))
  const parentIdx = selectedArr.indexOf(parentKey)

  if (selectedSiblings.length === siblingKeys.length && siblingKeys.length > 0) {
    if (parentIdx === -1) selectedArr.push(parentKey)
  } else {
    if (parentIdx > -1) selectedArr.splice(parentIdx, 1)
  }

  if (parentNode.parent) {
    updateParentSelections(parentNode.parent, selectedArr)
  }
}

const isAllSelected = computed(() => {
  if (!computedFlatRows.value.length) return false
  return computedFlatRows.value.every(item => selectedKeys.value.includes(item.key))
})

const isIndeterminate = computed(() => {
  if (!computedFlatRows.value.length) return false
  const selectedCount = computedFlatRows.value.filter(item => selectedKeys.value.includes(item.key)).length
  return selectedCount > 0 && selectedCount < computedFlatRows.value.length
})

const toggleRowSelection = (row: any, index: number, checked: boolean) => {
  const key = getRowKey(row, index)
  const arr = [...selectedKeys.value]
  const idx = arr.indexOf(key)

  if (checked && idx === -1) arr.push(key)
  else if (!checked && idx > -1) arr.splice(idx, 1)

  if (isTreeTable.value) {
    if (checked) {
      const descendants = getDescendantKeys(row)
      descendants.forEach(dk => {
        if (!arr.includes(dk)) arr.push(dk)
      })
    } else {
      const descendants = getDescendantKeys(row)
      descendants.forEach(dk => {
        const dIdx = arr.indexOf(dk)
        if (dIdx > -1) arr.splice(dIdx, 1)
      })
    }

    updateParentSelections(row, arr)
  }

  selectedKeys.value = arr
  const selection = flatRows.value.filter(item => arr.includes(item.key)).map(item => item.row)
  emit('select', selection, row)
  emit('selection-change', selection)
}

const toggleAllSelection = (checked: boolean) => {
  if (checked) {
    const allKeys = computedFlatRows.value.map(item => item.key)
    selectedKeys.value = allKeys
    const selection = computedFlatRows.value.map(item => item.row)
    emit('select-all', selection)
    emit('selection-change', selection)
  } else {
    selectedKeys.value = []
    emit('select-all', [] )
    emit('selection-change', [])
  }
}

// ----- 行点击 -----
const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
  if (props.highlightCurrentRow) {
    const oldRow = currentRow.value
    currentRow.value = row
    currentRowKey.value = getRowKey(row, index)
    emit('current-change', row, oldRow)
  }
}

const handleRowDblclick = (row: any, index: number) => {
  emit('row-dblclick', row, index)
}

const handleCellClick = (row: any, col: ColumnItem, index: number) => {
  if ((col as any).__isPadding) return
  emit('cell-click', row, col, col.prop !== undefined ? row[col.prop] : undefined, index)
}

// ----- 行样式 -----
const rowClass = (row: any, index: number) => {
  const classes: string[] = []
  if (props.stripe && index % 2 === 1) classes.push('is-striped')
  const key = getRowKey(row, index)
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
  if (col.__isPadding) return []
  const classes: string[] = ['w-table__cell']
  if (col.className) classes.push(col.className)
  if (col.align) classes.push(`is-align-${col.align}`)
  return classes
}

const leafHeaderCellStyle = (col: any, index: number) => {
  if (col.__isPadding) return {}
  const style: Record<string, string> = {}
  const isFlexible = index === renderLastFlexibleColIndex.value
  if (!isFlexible) {
    const wpx = `${colContentWidthPx(col)}px`
    style.width = wpx
    style.minWidth = wpx
    style.maxWidth = wpx
  } else {
    style.minWidth = `${colContentWidthPx(col)}px`
  }
  if (col.minWidth) style.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth
  return style
}

const cellClass = (col: any) => {
  if (col.__isPadding) return []
  const classes: string[] = ['w-table__cell']
  if (col.className) classes.push(col.className)
  if (col.align) classes.push(`is-align-${col.align}`)
  return classes
}

const cellStyle = (col: any, index: number) => {
  if (col.__isPadding) return {}
  const style: Record<string, string> = {}
  const isFlexible = index === renderLastFlexibleColIndex.value
  if (!isFlexible) {
    const wpx = `${colContentWidthPx(col)}px`
    style.width = wpx
    style.minWidth = wpx
    style.maxWidth = wpx
  } else {
    style.minWidth = `${colContentWidthPx(col)}px`
  }
  if (col.minWidth) style.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth
  return style
}

const stickyClass = (col: any) => {
  if (!col.fixed || col.__isLeaf === false || col.__isPadding) return []
  const classes: string[] = [`is-fixed-${col.fixed}`]
  if (col.__isLastLeft) classes.push('is-last-fixed-left')
  if (col.__isFirstRight) classes.push('is-first-fixed-right')
  return classes
}

const stickyStyle = (col: any) => {
  const style: Record<string, string> = {}
  if (col.fixed && col.__isLeaf !== false && !col.__isPadding) {
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

// ----- 数据计算（筛选 + 排序）-----
const computedFlatRows = computed(() => {
  let result = [...flatRows.value]

  // 筛选
  Object.entries(filterState.value).forEach(([prop, values]) => {
    if (!values?.length) return
    const col = findLeafColumn(prop)
    if (!col || !col.filters?.length) return
    result = result.filter(item => {
      if (col.filterMethod) return col.filterMethod(values, item.row)
      return values.includes(item.row[prop])
    })
  })

  // 排序
  if (sortState.value.order && sortState.value.prop) {
    const { prop, order } = sortState.value
    const isCustom = findLeafColumn(prop)?.sortable === 'custom'
    if (!isCustom) {
      result.sort((a, b) => {
        const av = a.row[prop], bv = b.row[prop]
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
.w-table { border: 1px solid #919b9c; background: #fff; font-family: var(--w-font-family); overflow-x: auto; box-sizing: border-box; }
.w-table table { width: auto; border-collapse: separate; border-spacing: 0; font-size: var(--w-font-size-base); }

.w-table th { background: linear-gradient(180deg, #f8f8f8, #e0e0e0); padding: 6px 10px; text-align: left; border-bottom: 1px solid #d4d0c8; font-weight: bold; }
.w-table td { padding: 6px 10px; border-bottom: 1px solid #e8e8e8; }
.w-table tr:hover td { background: #f0f8ff; }

/* scrollable / sticky header */
.w-table.is-scrollable { overflow: auto; }
.w-table.is-scrollable th { position: sticky; top: 0; z-index: 2; }

/* size */
.w-table--small th, .w-table--small td { padding: 4px 8px; font-size: var(--w-font-size-small); }
.w-table--large th, .w-table--large td { padding: 8px 12px; font-size: var(--w-font-size-base); }

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

/* tree */
.w-table__tree-indent { display: inline-block; flex-shrink: 0; }
.w-table__tree-expand-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; cursor: pointer; font-size: 10px; color: #666; flex-shrink: 0; margin-right: 2px; }
.w-table__tree-expand-icon:hover { color: var(--w-color-primary); }
.w-table__tree-expand-icon.is-leaf { cursor: default; visibility: hidden; }
.w-table__tree-expand-icon.is-loading { cursor: default; }

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

/* resize handle */
.w-table th { position: relative; }
.w-table__resize-handle { position: absolute; right: 0; top: 0; bottom: 0; width: 5px; cursor: col-resize; z-index: 10; }
.w-table__resize-handle:hover { background: var(--w-color-primary); opacity: 0.4; }

/* table layout */
.w-table table { width: 100%; }
.w-table th, .w-table td { box-sizing: border-box; }
</style>

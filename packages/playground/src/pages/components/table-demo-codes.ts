const endTag = '<' + '/script>'

export const codeBasic = `<template>
  <w-table :data="tableData" :columns="tableColumns" />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'department', label: '部门' },
  { prop: 'status', label: '状态' },
  { prop: 'action', label: '操作' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部', status: '在职' },
  { name: '李四', age: 32, department: '产品部', status: '在职' },
  { name: '王五', age: 24, department: '设计部', status: '实习' }
]
${endTag}`

export const codeSlot = `<template>
  <w-table :data="tableData" :columns="tableColumns">
    <template #status="{ row }">
      <w-tag :type="row.status === '在职' ? 'success' : 'info'">
        {{ row.status }}
      </w-tag>
    </template>
    <template #action="{ row, $index }">
      <w-space>
        <w-button type="text" size="small" @click="handleEdit(row)">编辑</w-button>
        <w-button type="text" size="small" @click="handleDelete(row, $index)">删除</w-button>
      </w-space>
    </template>
  </w-table>
</template>

<script setup>
import { WTable, WTag, WButton, WSpace } from '@windows-ui/core'
const handleEdit = (row) => console.log('编辑', row.name)
const handleDelete = (row, index) => console.log('删除第', index + 1, '行:', row.name)
${endTag}`

export const codeEmpty = `<template>
  <w-table :data="[]" :columns="tableColumns" />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' }
]
${endTag}`

export const codeVirtualScroll = `<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    virtualized
    :height="300"
    border
  />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'name', label: '姓名' },
  { prop: 'department', label: '部门' },
  { prop: 'address', label: '地址' }
]
const tableData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  address: ['北京市', '上海市', '广州市', '深圳市', '杭州市'][i % 5]
}))
${endTag}`

export const codeVirtual = `<template>
  <w-virtualized-table :data="virtualData" :columns="virtualColumns" :height="300" />
</template>

<script setup>
import { WVirtualizedTable } from '@windows-ui/core'
const virtualColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  { prop: 'department', label: '部门' }
]
const virtualData = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  email: 'user' + (i + 1) + '@example.com',
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4]
}))
${endTag}`

export const codeBorderStripe = `<template>
  <w-table :data="tableData" :columns="tableColumns" border stripe />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'department', label: '部门', minWidth: 120 },
  { prop: 'salary', label: '薪资', align: 'right' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部', salary: '18,000' },
  { name: '李四', age: 32, department: '产品部', salary: '22,000' },
  { name: '王五', age: 24, department: '设计部', salary: '15,000' },
  { name: '赵六', age: 35, department: '技术部', salary: '28,000' },
  { name: '孙七', age: 29, department: '运营部', salary: '16,000' }
]
${endTag}`

export const codeSelection = `<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    @selection-change="handleSelectionChange"
  />
  <p style="margin-top:8px;font-size:12px;color:#666;">
    已选 {{ selected.length }} 项：{{ selected.map(s => s.name).join('、') || '无' }}
  </p>
</template>

<script setup>
import { ref } from 'vue'
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { type: 'selection', prop: 'selection', label: ' ' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'department', label: '部门' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部' },
  { name: '李四', age: 32, department: '产品部' },
  { name: '王五', age: 24, department: '设计部' },
  { name: '赵六', age: 35, department: '技术部' }
]
const selected = ref([])
const handleSelectionChange = (val) => { selected.value = val }
${endTag}`

export const codeHighlight = `<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    highlight-current-row
    @current-change="handleCurrentChange"
  />
  <p style="margin-top:8px;font-size:12px;color:#666;">
    当前选中：{{ current?.name || '无' }}
  </p>
</template>

<script setup>
import { ref } from 'vue'
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'department', label: '部门' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部' },
  { name: '李四', age: 32, department: '产品部' },
  { name: '王五', age: 24, department: '设计部' }
]
const current = ref(null)
const handleCurrentChange = (val) => { current.value = val }
${endTag}`

export const codeSort = `<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    @sort-change="handleSortChange"
  />
  <p style="margin-top:8px;font-size:12px;color:#666;">
    当前排序：{{ sortInfo.prop }} {{ sortInfo.order }}
  </p>
</template>

<script setup>
import { ref } from 'vue'
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名', sortable: true },
  { prop: 'age', label: '年龄', sortable: true },
  { prop: 'salary', label: '薪资', sortable: 'custom' }
]
const tableData = [
  { name: '张三', age: 28, salary: 18000 },
  { name: '李四', age: 32, salary: 22000 },
  { name: '王五', age: 24, salary: 15000 },
  { name: '赵六', age: 35, salary: 28000 }
]
const sortInfo = ref({ prop: '', order: null })
const handleSortChange = ({ prop, order }) => { sortInfo.value = { prop, order } }
${endTag}`

export const codeFilter = `<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    @filter-change="handleFilterChange"
  />
  <p style="margin-top:8px;font-size:12px;color:#666;">
    当前筛选：{{ filterInfo.prop }} = {{ filterInfo.values.join('、') || '无' }}
  </p>
</template>

<script setup>
import { ref } from 'vue'
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  {
    prop: 'department',
    label: '部门',
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' }
    ]
  }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部' },
  { name: '李四', age: 32, department: '产品部' },
  { name: '王五', age: 24, department: '设计部' },
  { name: '赵六', age: 35, department: '技术部' },
  { name: '孙七', age: 29, department: '运营部' }
]
const filterInfo = ref({ prop: '', values: [] })
const handleFilterChange = ({ prop, values }) => { filterInfo.value = { prop, values } }
${endTag}`

export const codeSize = `<template>
  <w-space direction="vertical">
    <w-table :data="tableData" :columns="tableColumns" size="small" />
    <w-table :data="tableData" :columns="tableColumns" size="default" />
    <w-table :data="tableData" :columns="tableColumns" size="large" />
  </w-space>
</template>

<script setup>
import { WTable, WSpace } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'department', label: '部门' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部' },
  { name: '李四', age: 32, department: '产品部' },
  { name: '王五', age: 24, department: '设计部' }
]
${endTag}`

export const codeRowClass = `<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    :row-class-name="rowClassName"
  />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'center' },
  { prop: 'department', label: '部门' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部' },
  { name: '李四', age: 32, department: '产品部' },
  { name: '王五', age: 24, department: '设计部' },
  { name: '赵六', age: 35, department: '技术部' }
]
const rowClassName = (row) => row.age >= 30 ? 'is-warning' : ''
${endTag}`

export const codePagination = `<template>
  <w-table :data="pagedData" :columns="tableColumns" border />
  <div style="margin-top:12px;">
    <w-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="tableData.length"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { WTable, WPagination } from '@windows-ui/core'
const tableColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' },
  { prop: 'name', label: '姓名' },
  { prop: 'department', label: '部门' }
]
const tableData = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4]
}))
const currentPage = ref(1)
const pageSize = 5
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return tableData.slice(start, start + pageSize)
})
${endTag}`

export const codeResize = `<template>
  <div style="max-width: 480px; border: 1px solid #919b9c;">
    <w-table :data="tableData" :columns="tableColumns" border />
  </div>
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'address', label: '地址', width: 150 }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部', address: '北京市' },
  { name: '李四', age: 32, department: '产品部', address: '上海市' },
  { name: '王五', age: 24, department: '设计部', address: '广州市' },
  { name: '赵六', age: 35, department: '技术部', address: '深圳市' }
]
${endTag}`

export const codeFixedHeader = `<template>
  <w-table :data="tableData" :columns="tableColumns" :max-height="300" border />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'department', label: '部门' },
  { prop: 'address', label: '地址' }
]
const tableData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  age: 22 + (i % 15),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  address: ['北京市', '上海市', '广州市', '深圳市', '杭州市'][i % 5]
}))
${endTag}`

export const codeFixedColumn = `<template>
  <div style="max-width: 480px; border: 1px solid #919b9c;">
    <w-table :data="tableData" :columns="tableColumns" border>
      <template #action="{ row }">
        <w-button type="text" size="small" @click="handleEdit(row)">编辑</w-button>
      </template>
    </w-table>
  </div>
</template>

<script setup>
import { WTable, WButton } from '@windows-ui/core'
const tableColumns = [
  { type: 'selection', prop: 'selection', label: ' ', width: 48, fixed: 'left' },
  { prop: 'id', label: 'ID', width: 60, align: 'center', fixed: 'left' },
  { prop: 'name', label: '姓名', width: 100, fixed: 'left' },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'address', label: '地址', width: 150 },
  { prop: 'action', label: '操作', width: 80, fixed: 'right' }
]
const tableData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  age: 22 + (i % 15),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  address: ['北京市', '上海市', '广州市', '深圳市', '杭州市'][i % 5]
}))
const handleEdit = (row) => console.log('编辑', row.name)
${endTag}`

export const codeMultiHeader = `<template>
  <w-table :data="tableData" :columns="tableColumns" border />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  {
    label: '基本信息',
    children: [
      { prop: 'name', label: '姓名', width: 100 },
      { prop: 'age', label: '年龄', width: 80, align: 'center' }
    ]
  },
  {
    label: '工作信息',
    children: [
      { prop: 'department', label: '部门', width: 120 },
      {
        label: '薪资',
        children: [
          { prop: 'baseSalary', label: '基本工资', align: 'right' },
          { prop: 'bonus', label: '奖金', align: 'right' }
        ]
      }
    ]
  },
  { prop: 'status', label: '状态', width: 100, align: 'center' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部', baseSalary: '15,000', bonus: '3,000', status: '在职' },
  { name: '李四', age: 32, department: '产品部', baseSalary: '18,000', bonus: '4,000', status: '在职' },
  { name: '王五', age: 24, department: '设计部', baseSalary: '12,000', bonus: '2,000', status: '实习' }
]
${endTag}`

export const codeTree = `<template>
  <w-table
    :data="treeData"
    :columns="treeColumns"
    row-key="id"
    default-expand-all
  />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const treeColumns = [
  { prop: 'name', label: '名称' },
  { prop: 'type', label: '类型', width: 100, align: 'center' },
  { prop: 'count', label: '人数', width: 80, align: 'center' },
  { prop: 'leader', label: '负责人' }
]
const treeData = [
  {
    id: 1, name: '总部', type: '公司', count: 120, leader: '张总',
    children: [
      {
        id: 2, name: '技术部', type: '部门', count: 45, leader: '李总监',
        children: [
          { id: 5, name: '前端组', type: '小组', count: 12, leader: '王组长' },
          { id: 6, name: '后端组', type: '小组', count: 18, leader: '赵组长' },
          { id: 7, name: '测试组', type: '小组', count: 8, leader: '孙组长' }
        ]
      },
      {
        id: 3, name: '产品部', type: '部门', count: 20, leader: '周总监',
        children: [
          { id: 8, name: '产品一组', type: '小组', count: 10, leader: '吴组长' },
          { id: 9, name: '产品二组', type: '小组', count: 10, leader: '郑组长' }
        ]
      },
      { id: 4, name: '设计部', type: '部门', count: 15, leader: '钱总监' }
    ]
  }
]
${endTag}`

export const codeTreeSelection = `<template>
  <w-table
    :data="treeData"
    :columns="treeColumns"
    row-key="id"
    default-expand-all
    @selection-change="handleSelectionChange"
  />
  <p style="margin-top:8px;font-size:12px;color:#666;">
    已选 {{ selected.length }} 项
  </p>
</template>

<script setup>
import { ref } from 'vue'
import { WTable } from '@windows-ui/core'
const treeColumns = [
  { type: 'selection', prop: 'selection', label: ' ' },
  { prop: 'name', label: '名称' },
  { prop: 'type', label: '类型', width: 100, align: 'center' },
  { prop: 'count', label: '人数', width: 80, align: 'center' }
]
const treeData = [
  {
    id: 1, name: '总部', type: '公司', count: 120,
    children: [
      {
        id: 2, name: '技术部', type: '部门', count: 45,
        children: [
          { id: 5, name: '前端组', type: '小组', count: 12 },
          { id: 6, name: '后端组', type: '小组', count: 18 }
        ]
      },
      { id: 3, name: '产品部', type: '部门', count: 20 }
    ]
  }
]
const selected = ref([])
const handleSelectionChange = (val) => { selected.value = val }
${endTag}`

export const codeTreeLazy = `<template>
  <w-table
    :data="lazyData"
    :columns="treeColumns"
    row-key="id"
    lazy
    :load="load"
  />
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const treeColumns = [
  { prop: 'name', label: '名称' },
  { prop: 'date', label: '日期', width: 120, align: 'center' }
]
const lazyData = [
  { id: 1, name: '项目 A', date: '2024-01', hasChildren: true },
  { id: 2, name: '项目 B', date: '2024-03', hasChildren: true },
  { id: 3, name: '项目 C', date: '2024-06', hasChildren: false }
]
const load = (row, treeNode, resolve) => {
  setTimeout(() => {
    resolve([
      { id: row.id * 10 + 1, name: row.name + '-阶段1', date: row.date, hasChildren: false },
      { id: row.id * 10 + 2, name: row.name + '-阶段2', date: row.date, hasChildren: false }
    ])
  }, 400)
}
${endTag}`

export const codeExpandRow = `<template>
  <w-table :data="tableData" :columns="tableColumns">
    <template #expand="{ row }">
      <div style="padding: 8px;">
        <p><strong>详细地址：</strong>{{ row.address }}</p>
        <p><strong>入职日期：</strong>{{ row.joinDate }}</p>
        <p><strong>备注：</strong>{{ row.remark }}</p>
      </div>
    </template>
  </w-table>
</template>

<script setup>
import { WTable } from '@windows-ui/core'
const tableColumns = [
  { type: 'expand', prop: 'expand', label: ' ', width: 48 },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'center' },
  { prop: 'department', label: '部门' }
]
const tableData = [
  { name: '张三', age: 28, department: '技术部', address: '北京市海淀区', joinDate: '2020-03-15', remark: '前端专家' },
  { name: '李四', age: 32, department: '产品部', address: '上海市浦东新区', joinDate: '2019-07-01', remark: '高级产品经理' },
  { name: '王五', age: 24, department: '设计部', address: '广州市天河区', joinDate: '2022-01-10', remark: 'UI 设计师' },
  { name: '赵六', age: 35, department: '技术部', address: '深圳市南山区', joinDate: '2018-05-20', remark: '架构师' }
]
${endTag}`

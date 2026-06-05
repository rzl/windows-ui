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

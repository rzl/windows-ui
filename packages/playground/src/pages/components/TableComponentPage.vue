<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" description="数据表格" id="table" doc="table">

      <demo-block title="基础表格" :code="codeBasic"><w-table :data="tableData" :columns="tableColumns" /></demo-block>

      <demo-block title="自定义列模板" :code="codeSlot"><w-table :data="tableData" :columns="tableColumns">
        <template #status="{ row }">
          <w-tag :type="row.status === '在职' ? 'success' : 'info'">{{ row.status }}</w-tag>
        </template>
        <template #action="{ row, $index }">
          <w-space>
            <w-button type="text" size="small" @click="handleEdit(row)">编辑</w-button>
            <w-button type="text" size="small" @click="handleDelete(row, $index)">删除</w-button>
          </w-space>
        </template>
      </w-table></demo-block>

      <demo-block title="空数据表格" :code="codeEmpty"><w-table :data="[]" :columns="tableColumns" /></demo-block>

      <demo-block title="虚拟化表格" :code="codeVirtual"><w-virtualized-table :data="virtualData" :columns="virtualColumns" :height="300" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { codeBasic, codeSlot, codeEmpty, codeVirtual } from './table-demo-codes'

const title = 'Table 表格'

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
  { name: '王五', age: 24, department: '设计部', status: '实习' },
  { name: '赵六', age: 35, department: '技术部', status: '在职' },
  { name: '孙七', age: 29, department: '运营部', status: '休假' }
]

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

const handleEdit = (row: any) => alert('编辑: ' + row.name)
const handleDelete = (row: any, index: number) => alert('删除第 ' + (index + 1) + ' 行: ' + row.name)
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
</style>

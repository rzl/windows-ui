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

      <demo-block title="带边框 + 斑马纹 + 列宽" :code="codeBorderStripe">
        <w-table :data="stripeData" :columns="stripeColumns" border stripe />
      </demo-block>

      <demo-block title="多选行" :code="codeSelection">
        <w-table :data="tableData" :columns="selectionColumns" @selection-change="handleSelectionChange" />
        <p class="demo-note">已选 {{ selected.length }} 项：{{ selected.map(s => s.name).join('、') || '无' }}</p>
      </demo-block>

      <demo-block title="单选高亮" :code="codeHighlight">
        <w-table :data="tableData" :columns="tableColumns" highlight-current-row @current-change="handleCurrentChange" />
        <p class="demo-note">当前选中：{{ current?.name || '无' }}</p>
      </demo-block>

      <demo-block title="排序" :code="codeSort">
        <w-table :data="sortData" :columns="sortColumns" @sort-change="handleSortChange" />
        <p class="demo-note">当前排序：{{ sortInfo.prop }} {{ sortInfo.order }}</p>
      </demo-block>

      <demo-block title="筛选" :code="codeFilter">
        <w-table :data="filterData" :columns="filterColumns" @filter-change="handleFilterChange" />
        <p class="demo-note">当前筛选：{{ filterInfo.prop }} = {{ filterInfo.values.join('、') || '无' }}</p>
      </demo-block>

      <demo-block title="尺寸规格" :code="codeSize">
        <w-space direction="vertical">
          <w-table :data="tableData" :columns="tableColumns" size="small" />
          <w-table :data="tableData" :columns="tableColumns" size="default" />
          <w-table :data="tableData" :columns="tableColumns" size="large" />
        </w-space>
      </demo-block>

      <demo-block title="行样式自定义" :code="codeRowClass">
        <w-table :data="rowClassData" :columns="tableColumns" :row-class-name="rowClassName" />
      </demo-block>

      <demo-block title="分页联动" :code="codePagination">
        <w-table :data="pagedData" :columns="pageColumns" border />
        <div style="margin-top: 12px;">
          <w-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="pageData.length" />
        </div>
      </demo-block>

      <demo-block title="列宽拖拽" :code="codeResize">
        <div style="max-width: 480px; border: 1px solid #919b9c;">
          <w-table :data="tableData" :columns="resizeColumns" border />
        </div>
        <p class="demo-note">拖动表头右侧分割线调整列宽，超出容器会产生横向滚动条</p>
      </demo-block>

      <demo-block title="固定表头" :code="codeFixedHeader">
        <w-table :data="fixedHeaderData" :columns="fixedHeaderColumns" :max-height="300" border />
      </demo-block>

      <demo-block title="固定列" :code="codeFixedColumn">
        <div style="max-width: 480px; border: 1px solid #919b9c;">
          <w-table :data="fixedColumnData" :columns="fixedColumnColumns" border>
            <template #action="{ row }">
              <w-button type="text" size="small" @click="handleEdit(row)">编辑</w-button>
            </template>
          </w-table>
        </div>
      </demo-block>

      <demo-block title="树形表格" :code="codeTree">
        <w-table :data="treeData" :columns="treeColumns" row-key="id" default-expand-all />
      </demo-block>

      <demo-block title="树形表格 + 多选" :code="codeTreeSelection">
        <w-table :data="treeData" :columns="treeSelectionColumns" row-key="id" default-expand-all @selection-change="handleTreeSelectionChange" />
        <p class="demo-note">已选 {{ treeSelected.length }} 项</p>
      </demo-block>

      <demo-block title="懒加载树形" :code="codeTreeLazy">
        <w-table :data="lazyData" :columns="treeColumns" row-key="id" lazy :load="loadTree" />
      </demo-block>

      <demo-block title="多级表头" :code="codeMultiHeader">
        <w-table :data="multiHeaderData" :columns="multiHeaderColumns" border />
      </demo-block>

      <demo-block title="展开行" :code="codeExpandRow">
        <w-table :data="expandData" :columns="expandColumns">
          <template #expand="{ row }">
            <div style="padding: 8px;">
              <p><strong>详细地址：</strong>{{ row.address }}</p>
              <p><strong>入职日期：</strong>{{ row.joinDate }}</p>
              <p><strong>备注：</strong>{{ row.remark }}</p>
            </div>
          </template>
        </w-table>
      </demo-block>

      <demo-block title="虚拟滚动" :code="codeVirtualScroll">
        <w-table :data="virtualScrollData" :columns="virtualScrollColumns" virtualized :height="300" border />
        <p class="demo-note">大数据量下仅渲染可视区域行，滚动流畅</p>
      </demo-block>

      <demo-block title="虚拟化表格" :code="codeVirtual"><w-virtualized-table :data="virtualData" :columns="virtualColumns" :height="300" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DemoSection from '../../components/DemoSection.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import {
  codeBasic,
  codeSlot,
  codeEmpty,
  codeVirtual,
  codeBorderStripe,
  codeSelection,
  codeHighlight,
  codeSort,
  codeFilter,
  codeSize,
  codeRowClass,
  codePagination,
  codeFixedHeader,
  codeFixedColumn,
  codeExpandRow,
  codeResize,
  codeTree,
  codeTreeSelection,
  codeTreeLazy,
  codeMultiHeader,
  codeVirtualScroll
} from './table-demo-codes'

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

const stripeColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' as const },
  { prop: 'department', label: '部门', minWidth: 120 },
  { prop: 'salary', label: '薪资', align: 'right' as const }
]

const stripeData = [
  { name: '张三', age: 28, department: '技术部', salary: '18,000' },
  { name: '李四', age: 32, department: '产品部', salary: '22,000' },
  { name: '王五', age: 24, department: '设计部', salary: '15,000' },
  { name: '赵六', age: 35, department: '技术部', salary: '28,000' },
  { name: '孙七', age: 29, department: '运营部', salary: '16,000' }
]

const selectionColumns = [
  { type: 'selection' as const, prop: 'selection', label: ' ' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'department', label: '部门' }
]

const selected = ref<any[]>([])
const handleSelectionChange = (val: any[]) => { selected.value = val }

const current = ref<any>(null)
const handleCurrentChange = (val: any) => { current.value = val }

const sortColumns = [
  { prop: 'name', label: '姓名', sortable: true },
  { prop: 'age', label: '年龄', sortable: true },
  { prop: 'salary', label: '薪资', sortable: 'custom' as const }
]

const sortData = [
  { name: '张三', age: 28, salary: 18000 },
  { name: '李四', age: 32, salary: 22000 },
  { name: '王五', age: 24, salary: 15000 },
  { name: '赵六', age: 35, salary: 28000 }
]

const sortInfo = ref({ prop: '', order: null as string | null })
const handleSortChange = ({ prop, order }: any) => { sortInfo.value = { prop, order } }

const filterColumns = [
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

const filterData = [
  { name: '张三', age: 28, department: '技术部' },
  { name: '李四', age: 32, department: '产品部' },
  { name: '王五', age: 24, department: '设计部' },
  { name: '赵六', age: 35, department: '技术部' },
  { name: '孙七', age: 29, department: '运营部' }
]

const filterInfo = ref({ prop: '', values: [] as string[] })
const handleFilterChange = ({ prop, values }: any) => { filterInfo.value = { prop, values } }

const rowClassData = [
  { name: '张三', age: 28, department: '技术部' },
  { name: '李四', age: 32, department: '产品部' },
  { name: '王五', age: 24, department: '设计部' },
  { name: '赵六', age: 35, department: '技术部' }
]

const rowClassName = (row: any) => row.age >= 30 ? 'is-warning' : ''

const pageColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const },
  { prop: 'name', label: '姓名' },
  { prop: 'department', label: '部门' }
]

const pageData = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4]
}))

const currentPage = ref(1)
const pageSize = 5
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return pageData.slice(start, start + pageSize)
})

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

const virtualScrollColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const },
  { prop: 'name', label: '姓名', width: 100 },
  ...Array.from({ length: 200 }, (_, i) => ({
    prop: 'field' + i,
    label: '字段' + (i + 1),
    width: 80,
    align: 'center' as const
  }))
]

const virtualScrollData = Array.from({ length: 1000 }, (_, i) => {
  const row: Record<string, any> = {
    id: i + 1,
    name: '用户 ' + (i + 1)
  }
  for (let j = 0; j < 200; j++) {
    row['field' + j] = String(i * 200 + j + 1)
  }
  return row
})

const fixedHeaderColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', width: 80, align: 'center' as const },
  { prop: 'department', label: '部门' },
  { prop: 'address', label: '地址' }
]

const fixedHeaderData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  age: 22 + (i % 15),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  address: ['北京市', '上海市', '广州市', '深圳市', '杭州市'][i % 5]
}))

const resizeColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' as const },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'address', label: '地址', width: 150 }
]

const fixedColumnColumns = [
  { type: 'selection' as const, prop: 'selection', label: ' ', width: 48, fixed: 'left' as const },
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const, fixed: 'left' as const },
  { prop: 'name', label: '姓名', width: 100, fixed: 'left' as const },
  { prop: 'age', label: '年龄', width: 80, align: 'center' as const },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'address', label: '地址', width: 150 },
  { prop: 'action', label: '操作', width: 80, fixed: 'right' as const }
]

const fixedColumnData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  age: 22 + (i % 15),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  address: ['北京市', '上海市', '广州市', '深圳市', '杭州市'][i % 5]
}))

const expandColumns = [
  { type: 'expand' as const, prop: 'expand', label: ' ', width: 48 },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'center' as const },
  { prop: 'department', label: '部门' }
]

const expandData = [
  { name: '张三', age: 28, department: '技术部', address: '北京市海淀区', joinDate: '2020-03-15', remark: '前端专家' },
  { name: '李四', age: 32, department: '产品部', address: '上海市浦东新区', joinDate: '2019-07-01', remark: '高级产品经理' },
  { name: '王五', age: 24, department: '设计部', address: '广州市天河区', joinDate: '2022-01-10', remark: 'UI 设计师' },
  { name: '赵六', age: 35, department: '技术部', address: '深圳市南山区', joinDate: '2018-05-20', remark: '架构师' }
]

const treeColumns = [
  { prop: 'name', label: '名称' },
  { prop: 'type', label: '类型', width: 100, align: 'center' as const },
  { prop: 'count', label: '人数', width: 80, align: 'center' as const },
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

const treeSelectionColumns = [
  { type: 'selection' as const, prop: 'selection', label: ' ' },
  { prop: 'name', label: '名称' },
  { prop: 'type', label: '类型', width: 100, align: 'center' as const },
  { prop: 'count', label: '人数', width: 80, align: 'center' as const }
]

const treeSelected = ref<any[]>([])
const handleTreeSelectionChange = (val: any[]) => { treeSelected.value = val }

const lazyData = [
  { id: 1, name: '项目 A', date: '2024-01', hasChildren: true },
  { id: 2, name: '项目 B', date: '2024-03', hasChildren: true },
  { id: 3, name: '项目 C', date: '2024-06', hasChildren: false }
]

const loadTree = (row: any, treeNode: any, resolve: (data: any[]) => void) => {
  setTimeout(() => {
    resolve([
      { id: row.id * 10 + 1, name: row.name + '-阶段1', date: row.date, hasChildren: false },
      { id: row.id * 10 + 2, name: row.name + '-阶段2', date: row.date, hasChildren: false }
    ])
  }, 400)
}

const multiHeaderColumns = [
  {
    label: '基本信息',
    children: [
      { prop: 'name', label: '姓名', width: 100 },
      { prop: 'age', label: '年龄', width: 80, align: 'center' as const }
    ]
  },
  {
    label: '工作信息',
    children: [
      { prop: 'department', label: '部门', width: 120 },
      {
        label: '薪资',
        children: [
          { prop: 'baseSalary', label: '基本工资', align: 'right' as const },
          { prop: 'bonus', label: '奖金', align: 'right' as const }
        ]
      }
    ]
  },
  { prop: 'status', label: '状态', width: 100, align: 'center' as const }
]

const multiHeaderData = [
  { name: '张三', age: 28, department: '技术部', baseSalary: '15,000', bonus: '3,000', status: '在职' },
  { name: '李四', age: 32, department: '产品部', baseSalary: '18,000', bonus: '4,000', status: '在职' },
  { name: '王五', age: 24, department: '设计部', baseSalary: '12,000', bonus: '2,000', status: '实习' },
  { name: '赵六', age: 35, department: '技术部', baseSalary: '22,000', bonus: '6,000', status: '在职' }
]

const handleEdit = (row: any) => alert('编辑: ' + row.name)
const handleDelete = (row: any, index: number) => alert('删除第 ' + (index + 1) + ' 行: ' + row.name)
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-note { margin-top: 8px; font-size: 12px; color: #666; }
</style>

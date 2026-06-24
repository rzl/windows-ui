<template>
  <div class="demo-page">
    <h1 class="page-title">{{ title }}</h1>
    <demo-section :title="title" :description="t('数据表格')" id="table" doc="table">

      <demo-block :title="t('基础表格')" :code="TableCode1"><w-table :data="tableData" :columns="tableColumns" /></demo-block>

      <demo-block :title="t('自定义列模板')" :code="TableCode2"><w-table :data="tableData" :columns="tableColumns">
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

      <demo-block :title="t('空数据表格')" :code="TableCode3"><w-table :data="[]" :columns="tableColumns" /></demo-block>

      <demo-block :title="t('带边框 + 斑马纹 + 列宽')" :code="TableCode4">
        <w-table :data="stripeData" :columns="stripeColumns" border stripe />
      </demo-block>

      <demo-block :title="t('多选行')" :code="TableCode5">
        <w-table :data="tableData" :columns="selectionColumns" @selection-change="handleSelectionChange" />
        <p class="demo-note">已选 {{ selected.length }} 项：{{ selected.map(s => s.name).join('、') || '无' }}</p>
      </demo-block>

      <demo-block :title="t('单选高亮')" :code="TableCode6">
        <w-table :data="tableData" :columns="tableColumns" highlight-current-row @current-change="handleCurrentChange" />
        <p class="demo-note">当前选中：{{ current?.name || '无' }}</p>
      </demo-block>

      <demo-block :title="t('排序')" :code="TableCode7">
        <w-table :data="sortData" :columns="sortColumns" @sort-change="handleSortChange" />
        <p class="demo-note">当前排序：{{ sortInfo.prop }} {{ sortInfo.order }}</p>
      </demo-block>

      <demo-block :title="t('筛选')" :code="TableCode8">
        <w-table :data="filterData" :columns="filterColumns" @filter-change="handleFilterChange" />
        <p class="demo-note">当前筛选：{{ filterInfo.prop }} = {{ filterInfo.values.join('、') || '无' }}</p>
      </demo-block>

      <demo-block :title="t('尺寸规格')" :code="TableCode9">
        <w-space direction="vertical">
          <w-table :data="tableData" :columns="tableColumns" size="small" />
          <w-table :data="tableData" :columns="tableColumns" size="default" />
          <w-table :data="tableData" :columns="tableColumns" size="large" />
        </w-space>
      </demo-block>

      <demo-block :title="t('行样式自定义')" :code="TableCode10">
        <w-table :data="rowClassData" :columns="tableColumns" :row-class-name="rowClassName" />
      </demo-block>

      <demo-block :title="t('分页联动')" :code="TableCode11">
        <w-table :data="pagedData" :columns="pageColumns" border />
        <div style="margin-top: 12px;">
          <w-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="pageData.length" />
        </div>
      </demo-block>

      <demo-block :title="t('列宽拖拽')" :code="TableCode12">
        <div style="max-width: 480px; border: 1px solid #919b9c;">
          <w-table :data="tableData" :columns="resizeColumns" border />
        </div>
        <p class="demo-note">拖动表头右侧分割线调整列宽，超出容器会产生横向滚动条</p>
      </demo-block>

      <demo-block :title="t('固定表头')" :code="TableCode13">
        <w-table :data="fixedHeaderData" :columns="fixedHeaderColumns" :max-height="300" border />
      </demo-block>

      <demo-block :title="t('固定列')" :code="TableCode14">
        <div style="max-width: 480px; border: 1px solid #919b9c;">
          <w-table :data="fixedColumnData" :columns="fixedColumnColumns" border>
            <template #action="{ row }">
              <w-button type="text" size="small" @click="handleEdit(row)">编辑</w-button>
            </template>
          </w-table>
        </div>
      </demo-block>

      <demo-block :title="t('树形表格')" :code="TableCode15">
        <w-table :data="treeData" :columns="treeColumns" row-key="id" default-expand-all />
      </demo-block>

      <demo-block :title="t('树形表格 + 多选')" :code="TableCode16">
        <w-table :data="treeData" :columns="treeSelectionColumns" row-key="id" default-expand-all @selection-change="handleTreeSelectionChange" />
        <p class="demo-note">已选 {{ treeSelected.length }} 项</p>
      </demo-block>

      <demo-block :title="t('懒加载树形')" :code="TableCode17">
        <w-table :data="lazyData" :columns="treeColumns" row-key="id" lazy :load="loadTree" />
      </demo-block>

      <demo-block :title="t('多级表头')" :code="TableCode18">
        <w-table :data="multiHeaderData" :columns="multiHeaderColumns" border />
      </demo-block>

      <demo-block :title="t('展开行')" :code="TableCode19">
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

      <demo-block :title="t('虚拟滚动')" :code="TableCode20">
        <w-table :data="virtualScrollData" :columns="virtualScrollColumns" virtualized :height="300" border />
        <p class="demo-note">大数据量下仅渲染可视区域行，滚动流畅</p>
      </demo-block>

      <demo-block :title="t('横向虚拟滚动')" :code="TableCode21">
        <w-table :data="virtualXData" :columns="virtualXColumns" virtualized virtual-x :height="300" border />
        <p class="demo-note">200+ 列场景下仅渲染可视区域列，搭配左右固定列更流畅</p>
      </demo-block>

      <demo-block :title="t('虚拟化表格')" :code="TableCode22"><w-virtualized-table :data="virtualData" :columns="virtualColumns" :height="300" /></demo-block>

    </demo-section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
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
  codeVirtualScroll,
  codeVirtualX
} from './table-demo-codes'

const { t } = useI18n()
const title = t('Table 表格')

const tableColumns = [
  { prop: 'name', label: t('姓名') },
  { prop: 'age', label: t('年龄') },
  { prop: 'department', label: t('部门') },
  { prop: 'status', label: t('状态') },
  { prop: 'action', label: t('操作') }
]

const tableData = [
  { name: t('张三'), age: 28, department: t('技术部'), status: t('在职') },
  { name: t('李四'), age: 32, department: t('产品部'), status: t('在职') },
  { name: t('王五'), age: 24, department: t('设计部'), status: t('实习') },
  { name: t('赵六'), age: 35, department: t('技术部'), status: t('在职') },
  { name: t('孙七'), age: 29, department: t('运营部'), status: t('休假') }
]

const stripeColumns = [
  { prop: 'name', label: t('姓名'), width: 120 },
  { prop: 'age', label: t('年龄'), width: 80, align: 'center' as const },
  { prop: 'department', label: t('部门'), minWidth: 120 },
  { prop: 'salary', label: t('薪资'), align: 'right' as const }
]

const stripeData = [
  { name: t('张三'), age: 28, department: t('技术部'), salary: '18,000' },
  { name: t('李四'), age: 32, department: t('产品部'), salary: '22,000' },
  { name: t('王五'), age: 24, department: t('设计部'), salary: '15,000' },
  { name: t('赵六'), age: 35, department: t('技术部'), salary: '28,000' },
  { name: t('孙七'), age: 29, department: t('运营部'), salary: '16,000' }
]

const selectionColumns = [
  { type: 'selection' as const, prop: 'selection', label: ' ' },
  { prop: 'name', label: t('姓名') },
  { prop: 'age', label: t('年龄') },
  { prop: 'department', label: t('部门') }
]

const selected = ref<any[]>([])
const handleSelectionChange = (val: any[]) => { selected.value = val }

const current = ref<any>(null)
const handleCurrentChange = (val: any) => { current.value = val }

const sortColumns = [
  { prop: 'name', label: t('姓名'), sortable: true },
  { prop: 'age', label: t('年龄'), sortable: true },
  { prop: 'salary', label: t('薪资'), sortable: 'custom' as const }
]

const sortData = [
  { name: t('张三'), age: 28, salary: 18000 },
  { name: t('李四'), age: 32, salary: 22000 },
  { name: t('王五'), age: 24, salary: 15000 },
  { name: t('赵六'), age: 35, salary: 28000 }
]

const sortInfo = ref({ prop: '', order: null as string | null })
const handleSortChange = ({ prop, order }: any) => { sortInfo.value = { prop, order } }

const filterColumns = [
  { prop: 'name', label: t('姓名') },
  { prop: 'age', label: t('年龄') },
  {
    prop: 'department',
    label: t('部门'),
    filters: [
      { text: t('技术部'), value: t('技术部') },
      { text: t('产品部'), value: t('产品部') },
      { text: t('设计部'), value: t('设计部') }
    ]
  }
]

const filterData = [
  { name: t('张三'), age: 28, department: t('技术部') },
  { name: t('李四'), age: 32, department: t('产品部') },
  { name: t('王五'), age: 24, department: t('设计部') },
  { name: t('赵六'), age: 35, department: t('技术部') },
  { name: t('孙七'), age: 29, department: t('运营部') }
]

const filterInfo = ref({ prop: '', values: [] as string[] })
const handleFilterChange = ({ prop, values }: any) => { filterInfo.value = { prop, values } }

const rowClassData = [
  { name: t('张三'), age: 28, department: t('技术部') },
  { name: t('李四'), age: 32, department: t('产品部') },
  { name: t('王五'), age: 24, department: t('设计部') },
  { name: t('赵六'), age: 35, department: t('技术部') }
]

const rowClassName = (row: any) => row.age >= 30 ? 'is-warning' : ''

const pageColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const },
  { prop: 'name', label: t('姓名') },
  { prop: 'department', label: t('部门') }
]

const pageData = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: t('用户 ') + (i + 1),
  department: [t('技术部'), t('产品部'), t('设计部'), t('运营部')][i % 4]
}))

const currentPage = ref(1)
const pageSize = 5
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return pageData.slice(start, start + pageSize)
})

const virtualColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: t('姓名') },
  { prop: 'email', label: t('邮箱') },
  { prop: 'department', label: t('部门') }
]

const virtualData = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: t('用户 ') + (i + 1),
  email: 'user' + (i + 1) + '@example.com',
  department: [t('技术部'), t('产品部'), t('设计部'), t('运营部')][i % 4]
}))

const virtualScrollColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const },
  { prop: 'name', label: t('姓名'), width: 100 },
  ...Array.from({ length: 200 }, (_, i) => ({
    prop: 'field' + i,
    label: t('字段') + (i + 1),
    width: 80,
    align: 'center' as const
  }))
]

const virtualScrollData = Array.from({ length: 1000 }, (_, i) => {
  const row: Record<string, any> = {
    id: i + 1,
    name: t('用户 ') + (i + 1)
  }
  for (let j = 0; j < 200; j++) {
    row['field' + j] = String(i * 200 + j + 1)
  }
  return row
})

const virtualXColumns = [
  { type: 'selection' as const, prop: 'selection', label: ' ', width: 48, fixed: 'left' as const },
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const, fixed: 'left' as const },
  { prop: 'name', label: t('姓名'), width: 100, fixed: 'left' as const },
  ...Array.from({ length: 200 }, (_, i) => ({
    prop: 'field' + i,
    label: t('字段') + (i + 1),
    width: 80,
    align: 'center' as const
  })),
  { prop: 'action', label: t('操作'), width: 80, fixed: 'right' as const }
]

const virtualXData = Array.from({ length: 1000 }, (_, i) => {
  const row: Record<string, any> = {
    id: i + 1,
    name: t('用户 ') + (i + 1)
  }
  for (let j = 0; j < 200; j++) {
    row['field' + j] = String(i * 200 + j + 1)
  }
  return row
})

const fixedHeaderColumns = [
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const },
  { prop: 'name', label: t('姓名') },
  { prop: 'age', label: t('年龄'), width: 80, align: 'center' as const },
  { prop: 'department', label: t('部门') },
  { prop: 'address', label: t('地址') }
]

const fixedHeaderData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: t('用户 ') + (i + 1),
  age: 22 + (i % 15),
  department: [t('技术部'), t('产品部'), t('设计部'), t('运营部')][i % 4],
  address: [t('北京市'), t('上海市'), t('广州市'), t('深圳市'), t('杭州市')][i % 5]
}))

const resizeColumns = [
  { prop: 'name', label: t('姓名'), width: 120 },
  { prop: 'age', label: t('年龄'), width: 80, align: 'center' as const },
  { prop: 'department', label: t('部门'), width: 120 },
  { prop: 'address', label: t('地址'), width: 150 }
]

const fixedColumnColumns = [
  { type: 'selection' as const, prop: 'selection', label: ' ', width: 48, fixed: 'left' as const },
  { prop: 'id', label: 'ID', width: 60, align: 'center' as const, fixed: 'left' as const },
  { prop: 'name', label: t('姓名'), width: 100, fixed: 'left' as const },
  { prop: 'age', label: t('年龄'), width: 80, align: 'center' as const },
  { prop: 'department', label: t('部门'), width: 120 },
  { prop: 'address', label: t('地址'), width: 150 },
  { prop: 'action', label: t('操作'), width: 80, fixed: 'right' as const }
]

const fixedColumnData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: t('用户 ') + (i + 1),
  age: 22 + (i % 15),
  department: [t('技术部'), t('产品部'), t('设计部'), t('运营部')][i % 4],
  address: [t('北京市'), t('上海市'), t('广州市'), t('深圳市'), t('杭州市')][i % 5]
}))

const expandColumns = [
  { type: 'expand' as const, prop: 'expand', label: ' ', width: 48 },
  { prop: 'name', label: t('姓名') },
  { prop: 'age', label: t('年龄'), align: 'center' as const },
  { prop: 'department', label: t('部门') }
]

const expandData = [
  { name: t('张三'), age: 28, department: t('技术部'), address: t('北京市海淀区'), joinDate: '2020-03-15', remark: t('前端专家') },
  { name: t('李四'), age: 32, department: t('产品部'), address: t('上海市浦东新区'), joinDate: '2019-07-01', remark: t('高级产品经理') },
  { name: t('王五'), age: 24, department: t('设计部'), address: t('广州市天河区'), joinDate: '2022-01-10', remark: t('UI 设计师') },
  { name: t('赵六'), age: 35, department: t('技术部'), address: t('深圳市南山区'), joinDate: '2018-05-20', remark: t('架构师') }
]

const treeColumns = [
  { prop: 'name', label: t('名称') },
  { prop: 'type', label: t('类型'), width: 100, align: 'center' as const },
  { prop: 'count', label: t('人数'), width: 80, align: 'center' as const },
  { prop: 'leader', label: t('负责人') }
]

const treeData = [
  {
    id: 1, name: t('总部'), type: t('公司'), count: 120, leader: t('张总'),
    children: [
      {
        id: 2, name: t('技术部'), type: t('部门'), count: 45, leader: t('李总监'),
        children: [
          { id: 5, name: t('前端组'), type: t('小组'), count: 12, leader: t('王组长') },
          { id: 6, name: t('后端组'), type: t('小组'), count: 18, leader: t('赵组长') },
          { id: 7, name: t('测试组'), type: t('小组'), count: 8, leader: t('孙组长') }
        ]
      },
      {
        id: 3, name: t('产品部'), type: t('部门'), count: 20, leader: t('周总监'),
        children: [
          { id: 8, name: t('产品一组'), type: t('小组'), count: 10, leader: t('吴组长') },
          { id: 9, name: t('产品二组'), type: t('小组'), count: 10, leader: t('郑组长') }
        ]
      },
      { id: 4, name: t('设计部'), type: t('部门'), count: 15, leader: t('钱总监') }
    ]
  }
]

const treeSelectionColumns = [
  { type: 'selection' as const, prop: 'selection', label: ' ' },
  { prop: 'name', label: t('名称') },
  { prop: 'type', label: t('类型'), width: 100, align: 'center' as const },
  { prop: 'count', label: t('人数'), width: 80, align: 'center' as const }
]

const treeSelected = ref<any[]>([])
const handleTreeSelectionChange = (val: any[]) => { treeSelected.value = val }

const lazyData = [
  { id: 1, name: t('项目 A'), date: '2024-01', hasChildren: true },
  { id: 2, name: t('项目 B'), date: '2024-03', hasChildren: true },
  { id: 3, name: t('项目 C'), date: '2024-06', hasChildren: false }
]

const loadTree = (row: any, _treeNode: any, resolve: (data: any[]) => void) => {
  setTimeout(() => {
    resolve([
      { id: row.id * 10 + 1, name: row.name + t('-阶段1'), date: row.date, hasChildren: false },
      { id: row.id * 10 + 2, name: row.name + t('-阶段2'), date: row.date, hasChildren: false }
    ])
  }, 400)
}

const multiHeaderColumns = [
  {
    label: t('基本信息'),
    children: [
      { prop: 'name', label: t('姓名'), width: 100 },
      { prop: 'age', label: t('年龄'), width: 80, align: 'center' as const }
    ]
  },
  {
    label: t('工作信息'),
    children: [
      { prop: 'department', label: t('部门'), width: 120 },
      {
        label: t('薪资'),
        children: [
          { prop: 'baseSalary', label: t('基本工资'), align: 'right' as const },
          { prop: 'bonus', label: t('奖金'), align: 'right' as const }
        ]
      }
    ]
  },
  { prop: 'status', label: t('状态'), width: 100, align: 'center' as const }
]

const multiHeaderData = [
  { name: t('张三'), age: 28, department: t('技术部'), baseSalary: '15,000', bonus: '3,000', status: t('在职') },
  { name: t('李四'), age: 32, department: t('产品部'), baseSalary: '18,000', bonus: '4,000', status: t('在职') },
  { name: t('王五'), age: 24, department: t('设计部'), baseSalary: '12,000', bonus: '2,000', status: t('实习') },
  { name: t('赵六'), age: 35, department: t('技术部'), baseSalary: '22,000', bonus: '6,000', status: t('在职') }
]

const handleEdit = (row: any) => alert(t('编辑: ') + row.name)
const handleDelete = (row: any, index: number) => alert(t('删除第 ') + (index + 1) + t(' 行: ') + row.name)

const TableCode1 = codeBasic
const TableCode2 = codeSlot
const TableCode3 = codeEmpty
const TableCode4 = codeBorderStripe
const TableCode5 = codeSelection
const TableCode6 = codeHighlight
const TableCode7 = codeSort
const TableCode8 = codeFilter
const TableCode9 = codeSize
const TableCode10 = codeRowClass
const TableCode11 = codePagination
const TableCode12 = codeResize
const TableCode13 = codeFixedHeader
const TableCode14 = codeFixedColumn
const TableCode15 = codeTree
const TableCode16 = codeTreeSelection
const TableCode17 = codeTreeLazy
const TableCode18 = codeMultiHeader
const TableCode19 = codeExpandRow
const TableCode20 = codeVirtualScroll
const TableCode21 = codeVirtualX
const TableCode22 = codeVirtual
</script>

<style scoped>
.page-title { font-size: 24px; color: #245edb; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #d4d0c8; }
.demo-note { margin-top: 8px; font-size: 12px; color: #666; }
</style>

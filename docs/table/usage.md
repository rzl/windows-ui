# Table 表格 - 使用说明

## 基础用法

### 简单表格

最基础的数据展示用法，通过 `data` 传入数据数组，`columns` 定义列配置。

```vue
<template>
  <w-table :data="tableData" :columns="tableColumns" />
</template>

<script setup>
import { WTable } from '@windows-ui/core'

const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'department', label: '部门' },
  { prop: 'address', label: '地址' }
]

const tableData = [
  { name: '张三', age: 28, department: '技术部', address: '北京市' },
  { name: '李四', age: 32, department: '产品部', address: '上海市' },
  { name: '王五', age: 24, department: '设计部', address: '广州市' },
  { name: '赵六', age: 35, department: '技术部', address: '深圳市' },
  { name: '孙七', age: 29, department: '运营部', address: '杭州市' }
]
</script>
```

### 自定义列模板

表格的每一列都支持通过**具名插槽**自定义渲染内容。插槽名为对应列的 `prop` 值，作用域参数为 `{ row, $index }`。

```vue
<template>
  <w-table :data="tableData" :columns="tableColumns">
    <!-- 使用 status 列的插槽自定义标签样式 -->
    <template #status="{ row }">
      <w-tag :type="row.status === '在职' ? 'success' : 'info'">
        {{ row.status }}
      </w-tag>
    </template>

    <!-- 使用 action 列的插槽自定义操作按钮 -->
    <template #action="{ row, $index }">
      <w-space>
        <w-button type="text" size="small" @click="handleEdit(row)">
          编辑
        </w-button>
        <w-button type="text" size="small" @click="handleDelete(row, $index)">
          删除
        </w-button>
      </w-space>
    </template>
  </w-table>
</template>

<script setup>
import { WTable, WTag, WButton, WSpace } from '@windows-ui/core'

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

const handleEdit = (row) => {
  console.log('编辑', row.name)
}

const handleDelete = (row, index) => {
  console.log('删除第', index + 1, '行:', row.name)
}
</script>
```

### 空数据状态

当 `data` 为空数组时，表格会自动展示空状态提示。

```vue
<template>
  <w-table :data="[]" :columns="tableColumns" />
</template>

<script setup>
import { WTable } from '@windows-ui/core'

const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' }
]
</script>
```

## 扩展功能

### 边框与斑马纹

通过 `border` 和 `stripe` 属性开启全边框与斑马纹效果。列配置支持 `width`、`minWidth` 和 `align` 控制列宽与对齐。

```vue
<template>
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
</script>
```

### 多选行

将某一列的 `type` 设为 `'selection'` 即可开启多选功能。表头会自动显示全选复选框，支持半选状态。通过 `selection-change` 事件获取当前选中的行数组。

```vue
<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    @selection-change="handleSelectionChange"
  />
  <p>已选 {{ selected.length }} 项</p>
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
const handleSelectionChange = (val) => {
  selected.value = val
}
</script>
```

### 单选高亮

设置 `highlight-current-row` 后，点击行会高亮当前行，并通过 `current-change` 事件通知当前选中行。

```vue
<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    highlight-current-row
    @current-change="handleCurrentChange"
  />
  <p>当前选中：{{ current?.name || '无' }}</p>
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
const handleCurrentChange = (val) => {
  current.value = val
}
</script>
```

### 排序

列配置中设置 `sortable: true` 开启组件内部自动排序；设置为 `'custom'` 则仅触发 `sort-change` 事件，由外部自行处理排序逻辑。

```vue
<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    @sort-change="handleSortChange"
  />
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

const handleSortChange = ({ prop, order }) => {
  console.log('排序列:', prop, '顺序:', order)
}
</script>
```

### 筛选

列配置中传入 `filters` 数组即可开启该列的筛选面板。可配合 `filterMethod` 自定义匹配逻辑，否则默认使用值相等匹配。

```vue
<template>
  <w-table
    :data="tableData"
    :columns="tableColumns"
    @filter-change="handleFilterChange"
  />
</template>

<script setup>
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

const handleFilterChange = ({ prop, values }) => {
  console.log('筛选列:', prop, '选中值:', values)
}
</script>
```

### 尺寸规格

通过 `size` 属性控制表格整体尺寸，支持 `large`、`default`、`small` 三种规格。

```vue
<template>
  <w-table :data="tableData" :columns="tableColumns" size="small" />
  <w-table :data="tableData" :columns="tableColumns" size="default" />
  <w-table :data="tableData" :columns="tableColumns" size="large" />
</template>

<script setup>
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
</script>
```

### 行样式自定义

通过 `row-class-name` 属性为特定行添加自定义 CSS 类，支持字符串或函数形式。

```vue
<template>
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

const rowClassName = (row) => {
  return row.age >= 30 ? 'is-warning' : ''
}
</script>
```

> 表格内置了几种常用行状态类：`.is-warning`（浅黄）、`.is-danger`（浅红）、`.is-success`（浅绿）。

### 分页联动

表格本身不负责分页计算，可与 `WPagination` 组合使用，由外部控制当前页数据切片。

```vue
<template>
  <w-table :data="pagedData" :columns="tableColumns" border />
  <w-pagination
    v-model:current-page="currentPage"
    :page-size="pageSize"
    :total="tableData.length"
  />
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
</script>
```

### 固定表头

通过 `max-height` 属性限制表格最大高度，当内容超出时表头会自动固定，表格体滚动。

```vue
<template>
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
</script>
```

### 固定列

列配置中设置 `fixed: 'left'` 或 `fixed: 'right'` 可使该列在横向滚动时始终固定在左侧或右侧。多个固定列会自动计算累积偏移量。

```vue
<template>
  <w-table :data="tableData" :columns="tableColumns" border>
    <template #action="{ row }">
      <w-button type="text" size="small" @click="handleEdit(row)">编辑</w-button>
    </template>
  </w-table>
</template>

<script setup>
import { WTable, WButton } from '@windows-ui/core'

const tableColumns = [
  { type: 'selection', prop: 'selection', label: ' ', width: 48, fixed: 'left' },
  { prop: 'id', label: 'ID', width: 60, align: 'center' },
  { prop: 'name', label: '姓名', width: 100, fixed: 'left' },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'department', label: '部门' },
  { prop: 'address', label: '地址' },
  { prop: 'action', label: '操作', width: 80, fixed: 'right' }
]

const tableData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  age: 22 + (i % 15),
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  address: ['北京市', '上海市', '广州市', '深圳市', '杭州市'][i % 5]
}))

const handleEdit = (row) => {
  console.log('编辑', row.name)
}
</script>
```

### 展开行

将某一列的 `type` 设为 `'expand'`，并通过 `#expand` 插槽自定义展开内容。点击行首的展开图标即可展开/收起详情。

```vue
<template>
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
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 表格数据数组 | `Array` | `[]` |
| columns | 列配置数组，详见下方 Column 配置 | `Array<ColumnItem>` | `[]` |
| stripe | 是否显示斑马纹 | `boolean` | `false` |
| border | 是否显示边框 | `boolean` | `false` |
| size | 表格尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| highlightCurrentRow | 是否高亮当前行（点击选中） | `boolean` | `false` |
| rowClassName | 行的自定义类名，可为字符串或函数 | `string \| (row, index) => string` | `''` |
| emptyText | 空数据时显示的文本 | `string` | `'暂无数据'` |
| maxHeight | 表格最大高度，超出后表头固定并滚动 | `number \| string` | — |
| expandRowKeys | 当前已展开行的 key 数组（受控） | `Array<string \| number>` | `[]` |

### Column 配置

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| prop | 字段名 | `string` | — |
| label | 表头显示文本 | `string` | — |
| width | 列宽，支持数字（px）或字符串 | `number \| string` | — |
| minWidth | 最小列宽 | `number \| string` | — |
| align | 对齐方式 | `'left' \| 'center' \| 'right'` | `'left'` |
| className | 列的自定义 CSS 类 | `string` | — |
| sortable | 是否可排序，`true` 为内部排序，`'custom'` 为仅触发事件 | `boolean \| 'custom'` | `false` |
| filters | 筛选选项列表 | `Array<{ text: string; value: any }>` | — |
| filterMethod | 自定义筛选匹配函数，接收当前列已选值数组和行数据 | `(values, row) => boolean` | — |
| type | 列类型，`'selection'` 为选择列，`'expand'` 为展开列 | `'selection' \| 'expand' \| 'default'` | `'default'` |
| fixed | 列是否固定在左侧或右侧 | `'left' \| 'right'` | — |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| row-click | 某一行被点击时触发 | `(row, index)` |
| row-dblclick | 某一行被双击时触发 | `(row, index)` |
| cell-click | 某个单元格被点击时触发 | `(row, column, cellValue, index)` |
| selection-change | 选择项发生变化时触发 | `(selection: any[])` |
| select | 用户手动勾选某一行时触发 | `(selection, row)` |
| select-all | 用户点击全选复选框时触发 | `(selection: any[])` |
| sort-change | 列排序状态变化时触发 | `({ prop, order })` |
| filter-change | 列筛选条件变化时触发 | `({ prop, values })` |
| current-change | 单选高亮行变化时触发 | `(currentRow, oldCurrentRow)` |
| expand-change | 展开行状态变化时触发 | `(row, expandedRowKeys: (string \| number)[])` |

### Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| `[prop]` | 自定义对应列的单元格内容 | `{ row, $index }` |
| `header-[prop]` | 自定义对应列的表头内容 | `{ column }` |
| `empty` | 自定义空状态内容 | — |
| `expand` | 展开行内容 | `{ row, $index }` |

## 主题定制

可通过 CSS 变量自定义主题色：

```css
:root {
  --w-color-primary: #245edb;
  --w-bg-color: #ece9d8;
  --w-text-color-primary: #000;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```

表格内置行状态类也可通过 CSS 覆盖：

```css
.w-table tr.is-warning td { background: #fff8e1; }
.w-table tr.is-danger td { background: #ffebee; }
.w-table tr.is-success td { background: #e8f5e9; }
```

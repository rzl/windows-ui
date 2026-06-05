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

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 表格数据数组 | `Array` | `[]` |
| columns | 列配置数组，每项包含 `prop`（字段名）和 `label`（表头文本） | `Array<{ prop: string; label: string }>` | `[]` |

### Slots

表格的每一列会自动生成对应的**具名插槽**，插槽名与列配置的 `prop` 一致。

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| `[prop]` | 自定义对应列的单元格内容，例如 `prop: 'name'` 对应插槽 `#name` | `{ row, $index }` |

**作用域参数说明：**

| 参数 | 类型 | 说明 |
|------|------|------|
| row | `Object` | 当前行的数据对象 |
| $index | `Number` | 当前行的索引（从 0 开始） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| — | 当前基础表格组件未暴露额外事件，交互通过插槽内的子组件自行处理 | — |

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

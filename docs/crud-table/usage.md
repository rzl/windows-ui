# WCrudTable 高级表格

WCrudTable 是基于 WTable、WPagination、WSearchForm 封装的 CRUD 列表组件，适用于管理后台常见的查询表格场景。

## 基础用法

```vue
<template>
  <w-crud-table
    :data="list"
    :columns="columns"
    :query="query"
    :total="total"
    :current-page="query.page"
    :page-size="query.pageSize"
    @search="handleSearch"
    @reset="handleReset"
    @page-change="handlePageChange"
  >
    <template #search>
      <w-form-item label="关键词">
        <w-input v-model="query.keyword" />
      </w-form-item>
    </template>
    <template #toolbar>
      <w-button type="primary">新增</w-button>
    </template>
    <template #status="{ row }">
      <w-tag>{{ row.status }}</w-tag>
    </template>
  </w-crud-table>
</template>
```

## 列宽记忆与拖拽排序

通过 `storage-key` 开启列宽与列顺序的本地持久化，通过 `column-draggable` 开启表头拖拽排序。

```vue
<template>
  <w-crud-table
    ref="crudRef"
    :data="list"
    :columns="columns"
    :query="query"
    :total="total"
    :current-page="query.page"
    :page-size="query.pageSize"
    storage-key="order-list"
    column-draggable
    @search="handleSearch"
    @page-change="handlePageChange"
  />
  <w-button @click="crudRef?.resetColumnWidths()">重置列宽与顺序</w-button>
</template>

<script setup>
import { ref } from 'vue'

const crudRef = ref(null)
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | any[] | [] | 表格数据 |
| columns | ColumnItem[] | [] | 列配置，同 WTable |
| query | Record<string, any> | {} | 查询条件对象 |
| total | number | 0 | 总条数 |
| currentPage | number | 1 | 当前页 |
| pageSize | number | 10 | 每页条数 |
| searchable | boolean | true | 是否显示查询区域 |
| searchCollapsible | boolean | false | 查询区域是否可折叠 |
| stripe | boolean | true | 是否斑马纹 |
| border | boolean | true | 是否边框 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| search | query | 查询 |
| reset | - | 重置 |
| page-change | page | 页码变化 |
| size-change | size | 每页条数变化 |
| selection-change | rows | 选择变化 |

## Slots

| 名称 | 说明 |
|------|------|
| search | 查询表单内容 |
| toolbar | 工具栏按钮 |
| [column.prop] | 自定义列内容 |

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 数据 | array | [] |
| columns | 列配置 | array | [] |
| query | - | object | {} |
| total | 总条数 | number | 0 |
| currentPage | 当前页 | number | 1 |
| pageSize | 每页条数 | number | 10 |
| searchable | - | boolean | true |
| searchCollapsible | - | boolean | false |
| stripe | 是否斑马纹 | boolean | true |
| border | 是否纵向边框 | boolean | true |
| highlightCurrentRow | 是否高亮当前行 | boolean | true |
| size | 尺寸 | string | default（继承全局 size） |
| storageKey | - | string |  |
| columnDraggable | - | boolean | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| search | - | - |
| reset | - | - |
| page-change | - | - |
| size-change | 每页条数改变时触发 | pageSize |
| selection-change | 选中项改变时触发 | selection |
| row-click | 行点击时触发 | (row, column, event) |
| sort-change | 排序改变时触发 | (column, prop, order) |
| column-order-change | - | - |
| update:current-page | - | - |
| update:page-size | - | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| search | 自定义内容 |
| toolbar | 工具栏插槽 |

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

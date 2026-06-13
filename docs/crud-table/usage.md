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

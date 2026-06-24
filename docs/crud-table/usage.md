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
| update:current-page | - | - |
| update:page-size | - | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| search | 自定义内容 |
| toolbar | 工具栏插槽 |

## 移动端适配

WCrudTable 内部集成的 `dialog`、`table`、`form` / `form-item`、`search-form`、`query-builder`、`dynamic-form`、`pagination` 等子组件均已针对移动端（视口宽度 ≤768px）做响应式处理，无需额外配置即可自动生效：

- **工具栏**：移动端自动换行，按钮不再挤在同一行，避免溢出。
- **表格**：移动端支持横向滚动，单元格内容保持不换行，防止列宽被压缩变形。
- **搜索区域**：搜索字段垂直排列，操作按钮换行展示，便于触控操作。
- **弹窗编辑**：移动端弹窗打开时自动切换为全屏，可通过全屏按钮退出；退出全屏后支持拖拽，切回桌面端时自动恢复之前的状态。
- **分页**：移动端隐藏总条数文字，分页组件允许换行并居中显示。

### 使用注意事项

- 组件通过 CSS 媒体查询 `@media (max-width: 768px)` 检测移动端，无需调用方手动切换布局。
- 若查询区使用了 `dynamic-form` 字段布局，移动端 grid 会自动降为 1 列，也可通过 `dynamic-form` 的 `mobileColumns` prop 自定义移动端列数。
- 在移动端使用自定义列插槽时，建议控制单元格内容宽度，避免单个单元格过宽导致横向滚动条过长。

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

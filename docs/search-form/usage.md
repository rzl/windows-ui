# SearchForm 查询表单 - 使用说明

## 基础用法

```vue
<template>
  <w-search-form :model="query" @search="handleSearch" @reset="handleReset">
    <w-input v-model="query.name" placeholder="名称" />
    <w-select v-model="query.status" :options="statusOpts" placeholder="状态" />
    <w-date-picker v-model="query.date" placeholder="日期" />
  </w-search-form>
</template>

<script setup>
import { reactive } from 'vue'
const query = reactive({ name: '', status: '', date: '' })
const statusOpts = [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]
const handleSearch = (model) => console.log('search', model)
const handleReset = () => console.log('reset')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model | 查询条件对象 | object | {} |
| collapsible | 是否可展开/收起 | boolean | false |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| search | 点击查询时触发 | model |
| reset | 点击重置时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 查询字段 |

## 主题定制

```css
:root {
  --w-bg-color: #ece9d8;
}
```

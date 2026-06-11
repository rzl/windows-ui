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
| model | - | object | {} |
| collapsible | - | boolean | false |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| search | - | - |
| reset | - | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

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

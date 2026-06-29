# Virtualized Table 虚拟表格 - 使用说明

## 基础用法

```vue
<template>
  <w-virtualized-table :data="data" :columns="columns" :height="400" />
</template>

<script setup>
import { WVirtualizedTable } from '@windows-ui/core'
const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '名称' },
  { prop: 'date', label: '日期' }
]
const data = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: '用户 ' + (i + 1),
  date: '2024-01-01'
}))
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 数据 | array | [] |
| columns | 列配置 | array | [] |
| rowHeight | - | number | 32 |
| visibleCount | - | number | 10 |
| height | 高度 | - | - |

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

# Table 表格 - 使用说明

## 基础用法

```vue
<template>
  <w-table :data="tableData" :columns="columns">
    <template #name="{ row }">
      <w-tag>{{ row.name }}</w-tag>
    </template>
  </w-table>
</template>

<script setup>
import { WTable, WTag } from '@windows-ui/core'
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'date', label: '日期' },
  { prop: 'address', label: '地址' }
]
const tableData = [
  { name: '张三', date: '2024-01-01', address: '北京市' },
  { name: '李四', date: '2024-01-02', address: '上海市' }
]
</script>
```

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

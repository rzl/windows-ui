# Pagination 分页 - 使用说明

## 基础用法

```vue
<template>
  <w-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="100"
    layout="total, prev, pager, next"
  />
</template>

<script setup>
import { ref } from 'vue'
import { WPagination } from '@windows-ui/core'
const currentPage = ref(1)
const pageSize = ref(10)
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| currentPage | 当前页 | number | 1 |
| pageSize | 每页条数 | number | 10 |
| total | 总条数 | number | 0 |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:currentPage | 当前页更新时触发 | currentPage |
| change | 值改变时触发 | value |

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

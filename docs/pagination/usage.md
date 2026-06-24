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
| update:current-page | - | - |
| change | 值改变时触发 | value |
| update:page-size | - | - |

## 移动端适配

在屏幕宽度 ≤768px 的移动端环境下，分页组件会自动进入响应式模式：

- 隐藏总条数文字，为页码与操作按钮留出更多横向空间。
- 允许整体内容换行，避免控件被挤压导致无法点击。

无需额外配置，组件内部通过媒体查询自动判断并生效。若业务需要始终展示总条数，可通过自定义 slot 或覆盖样式实现。

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

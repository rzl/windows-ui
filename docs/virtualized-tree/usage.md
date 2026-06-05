# Virtualized Tree 虚拟树 - 使用说明

## 基础用法

```vue
<template>
  <w-virtualized-tree />
</template>

<script setup>
import { WVirtualizedTree } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 数据 | array | [] |
| rowHeight | - | number | 28 |
| visibleCount | - | number | 10 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| node-click | 节点点击时触发 | (data, node) |

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

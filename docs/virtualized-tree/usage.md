# Virtualized Tree 虚拟树 - 使用说明

## 基础用法

```vue
<template>
  <w-virtualized-tree :data="data" :props="defaultProps" :height="400" />
</template>

<script setup>
import { WVirtualizedTree } from '@windows-ui/core'
const defaultProps = { children: 'children', label: 'label' }
const data = Array.from({ length: 100 }, (_, i) => ({
  label: '节点 ' + (i + 1),
  children: Array.from({ length: 10 }, (_, j) => ({ label: '子节点 ' + (i + 1) + '-' + (j + 1) }))
}))
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 数据 | array | [] |
| rowHeight | - | number | 28 |
| visibleCount | - | number | 10 |
| size | 尺寸 | string | default（继承全局 size） |

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

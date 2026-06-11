# Tree 树形控件 - 使用说明

## 基础用法

```vue
<template>
  <w-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
</template>

<script setup>
import { WTree } from '@windows-ui/core'
const defaultProps = { children: 'children', label: 'label' }
const data = [
  { label: '一级 1', children: [{ label: '二级 1-1' }] },
  { label: '一级 2', children: [{ label: '二级 2-1' }, { label: '二级 2-2' }] }
]
const handleNodeClick = (data) => console.log(data)
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| data | 数据 | array | [] |
| expandAll | - | boolean | - |
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

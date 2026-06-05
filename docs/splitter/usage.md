# Splitter 分割面板 - 使用说明

## 基础用法

```vue
<template>
  <w-splitter style="height: 200px">
    <w-splitter-pane>左侧面板</w-splitter-pane>
    <w-splitter-pane>右侧面板</w-splitter-pane>
  </w-splitter>
</template>

<script setup>
import { WSplitter, WSplitterPane } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| split | - | number | 50 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| left | 左侧内容 |
| right | 右侧内容 |

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

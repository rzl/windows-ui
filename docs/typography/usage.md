# Typography 排版 - 使用说明

## 基础用法

```vue
<template>
  <w-typography>
    <h1>标题一</h1>
    <h2>标题二</h2>
    <p>这是一段普通文本，包含 <strong>加粗</strong> 和 <em>斜体</em> 样式。</p>
    <p>代码片段：<code>const a = 1</code></p>
  </w-typography>
</template>

<script setup>
import { WTypography } from '@windows-ui/core'
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

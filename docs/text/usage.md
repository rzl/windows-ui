# Text 文本 - 使用说明

## 基础用法

```vue
<template>
  <w-space direction="vertical">
    <w-text>默认文本</w-text>
    <w-text type="primary">主要文本</w-text>
    <w-text type="success">成功文本</w-text>
    <w-text type="warning">警告文本</w-text>
    <w-text type="danger">危险文本</w-text>
    <w-text size="large">大号文本</w-text>
    <w-text size="small">小号文本</w-text>
    <w-text truncated>这是一段会被截断的文本内容...</w-text>
    <w-text tag="b">加粗文本</w-text>
  </w-space>
</template>

<script setup>
import { WText, WSpace } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| tag | - | string | span |
| size | 尺寸 | string | default（继承全局 size） |
| type | 类型 | string | default |

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

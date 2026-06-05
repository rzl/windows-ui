# Watermark 水印 - 使用说明

## 基础用法

```vue
<template>
  <w-watermark content="Windows UI" :font="{ color: 'rgba(0,0,0,0.1)' }">
    <div style="height: 300px;">内容区域</div>
  </w-watermark>
</template>

<script setup>
import { WWatermark } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| content | 内容 | string | Watermark |
| fontSize | - | number | 14 |
| color | 文字颜色 | string | rgba(0,0,0,0.1) |
| rotate | - | number | -30 |

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

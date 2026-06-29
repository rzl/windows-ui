# Tooltip 文字提示 - 使用说明

## 基础用法

```vue
<template>
  <w-tooltip content="Top center" placement="top">
    <w-button>上方提示</w-button>
  </w-tooltip>
</template>

<script setup>
import { WTooltip, WButton } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| content | 内容 | string | - |
| placement | 弹出位置 | string | top |
| size | 尺寸 | string | default（继承全局 size） |

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

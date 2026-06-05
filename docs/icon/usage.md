# Icon 图标 - 使用说明

## 基础用法

```vue
<template>
  <w-space>
    <w-icon name="search" />
    <w-icon name="edit" />
    <w-icon name="delete" />
    <w-icon name="share" />
    <w-icon name="arrow-up" />
    <w-icon name="arrow-down" />
    <w-icon name="close" />
    <w-icon name="check" />
    <w-icon name="info" />
    <w-icon name="warning" />
  </w-space>
</template>

<script setup>
import { WIcon, WSpace } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| name | 名称 | string | - |
| size | 尺寸 | string | default |
| color | 文字颜色 | string | - |

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

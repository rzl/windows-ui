# Timeline 时间线 - 使用说明

## 基础用法

```vue
<template>
  <w-timeline />
</template>

<script setup>
import { WTimeline } from '@windows-ui/core'
</script>
```

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

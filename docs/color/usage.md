# Color 颜色 - 使用说明

## 基础用法

```vue
<template>
  <w-color @select="handleSelect" />
</template>

<script setup>
import { WColor } from '@windows-ui/core'
const handleSelect = (color) => console.log(color)
</script>
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| select | 选中时触发 | (selection, row) |

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

# Color Picker Panel 颜色面板 - 使用说明

## 基础用法

```vue
<template>
  <w-color-picker-panel @change="handleChange" />
</template>

<script setup>
import { WColorPickerPanel } from '@windows-ui/core'
const handleChange = (color) => console.log(color)
</script>
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 用户确认选定的值时触发 | value |

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

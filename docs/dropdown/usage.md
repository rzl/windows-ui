# Dropdown 下拉菜单 - 使用说明

## 基础用法

```vue
<template>
  <w-dropdown />
</template>

<script setup>
import { WDropdown } from '@windows-ui/core'
</script>
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| command | 菜单项点击时触发 | command |

### Slots

| 插槽名 | 说明 |
|--------|------|
| trigger | 触发元素插槽 |

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

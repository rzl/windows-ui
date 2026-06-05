# Result 结果 - 使用说明

## 基础用法

```vue
<template>
  <w-result />
</template>

<script setup>
import { WResult } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| icon | 图标名称 | string | info |
| title | 标题 | string | - |
| subtitle | - | string | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| extra | 自定义内容 |

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

# Progress 进度条 - 使用说明

## 基础用法

```vue
<template>
  <w-progress />
</template>

<script setup>
import { WProgress } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| percentage | 百分比 | number | 0 |
| status | 状态 | string |  |
| width | 宽度 | number | 200 |
| showText | - | boolean | true |

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

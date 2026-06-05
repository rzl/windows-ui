# Tour 漫游引导 - 使用说明

## 基础用法

```vue
<template>
  <w-tour />
</template>

<script setup>
import { WTour } from '@windows-ui/core'
</script>
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 可见性更新时触发 | visible |
| finish | - | - |

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

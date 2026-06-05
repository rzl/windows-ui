# Notification 通知 - 使用说明

## 基础用法

```vue
<template>
  <w-notification />
</template>

<script setup>
import { WNotification } from '@windows-ui/core'
</script>
```

### Methods

| 方法名 | 说明 |
|--------|------|
| show | 组件暴露的方法 |
| remove | 组件暴露的方法 |

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

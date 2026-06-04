# Message 消息提示 - 使用说明

## 基础用法

```vue
<template>
  <w-message />
</template>

<script setup>
import { Wmessage } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| - | - | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| - | - | - |

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
}
```

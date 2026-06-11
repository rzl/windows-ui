# Message Box 消息框 - 使用说明

## 基础用法

```vue
<template>
  <w-space>
    <w-button @click="openMsgBox">打开消息框</w-button>
    <w-button @click="openConfirm">确认框</w-button>
  </w-space>
</template>

<script setup>
import { WButton, WSpace } from '@windows-ui/core'
const openMsgBox = () => {}
const openConfirm = () => {}
</script>
```

## API

### Slots

| 插槽名 | 说明 |
|--------|------|
| action | 操作区内容 |
| header | 头部内容 |

### Methods

| 方法名 | 说明 |
|--------|------|
| open | 组件暴露的方法 |
| confirm | 组件暴露的方法 |
| cancel | 组件暴露的方法 |

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

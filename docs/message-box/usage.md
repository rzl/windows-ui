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

### Methods

| 方法名 | 说明 |
|--------|------|
| open | 组件暴露的方法 |
| confirm | 组件暴露的方法 |
| cancel | 组件暴露的方法 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| header | 替换标题栏内容，默认显示 title |
| action | 关闭按钮左侧的自定义操作区 |

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

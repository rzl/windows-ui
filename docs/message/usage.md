# Message 消息提示 - 使用说明

## 基础用法

```vue
<template>
  <w-space>
    <w-button @click="$message.info('这是一条消息')">消息</w-button>
    <w-button @click="$message.success('成功消息')">成功</w-button>
    <w-button @click="$message.warning('警告消息')">警告</w-button>
    <w-button @click="$message.error('错误消息')">错误</w-button>
  </w-space>
</template>

<script setup>
import { WButton, WSpace } from '@windows-ui/core'
</script>
```

### Methods

| 方法名 | 说明 |
|--------|------|
| info | 组件暴露的方法 |
| success | 组件暴露的方法 |
| warning | 组件暴露的方法 |
| error | 组件暴露的方法 |
| show | 组件暴露的方法 |

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

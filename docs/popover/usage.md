# Popover 弹出框 - 使用说明

## 基础用法

```vue
<template>
  <w-popover title="标题" content="这是一段内容" placement="top">
    <w-button>hover 激活</w-button>
  </w-popover>
</template>

<script setup>
import { WPopover, WButton } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | - |
| content | 内容 | string | - |
| placement | 弹出位置 | string | bottom |
| trigger | 触发方式 | string | click |
| width | 宽度 | - |  |

### Slots

| 插槽名 | 说明 |
|--------|------|
| action | 操作区内容 |
| content | 内容插槽 |
| default | 默认内容 |
| header | 头部内容 |

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

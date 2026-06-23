# Button 按钮 - 使用说明

## 基础用法

```vue
<template>
  <w-space wrap>
    <w-button>默认按钮</w-button>
    <w-button type="primary">主要按钮</w-button>
    <w-button type="success">成功按钮</w-button>
    <w-button type="warning">警告按钮</w-button>
    <w-button type="danger">危险按钮</w-button>
    <w-button type="info">信息按钮</w-button>
    <w-button plain>朴素按钮</w-button>
    <w-button round>圆角按钮</w-button>
    <w-button icon="search" />
    <w-button type="primary" disabled>禁用状态</w-button>
  </w-space>
</template>

<script setup>
import { WButton, WSpace } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 类型 | string | default |
| size | 尺寸 | string | default（继承全局 size） |
| plain | 是否朴素样式 | boolean | - |
| round | 是否圆角 | boolean | - |
| disabled | 是否禁用 | boolean | - |
| loading | 是否加载中 | boolean | - |
| icon | 图标名称 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击时触发 | event |

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
  --w-text-color-primary: #000;
  --w-border-radius-base: 3px;
  --w-font-family: 'Tahoma', 'Microsoft YaHei', sans-serif;
}
```

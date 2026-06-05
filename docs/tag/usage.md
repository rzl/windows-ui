# Tag 标签 - 使用说明

## 基础用法

```vue
<template>
  <w-space>
    <w-tag>默认标签</w-tag>
    <w-tag type="success">成功</w-tag>
    <w-tag type="warning">警告</w-tag>
    <w-tag type="danger">危险</w-tag>
    <w-tag type="info">信息</w-tag>
    <w-tag closable @close="handleClose">可关闭</w-tag>
  </w-space>
</template>

<script setup>
import { WTag, WSpace } from '@windows-ui/core'
const handleClose = () => console.log('关闭标签')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 类型 | string | default |
| size | 尺寸 | string | default |
| closable | 是否可关闭 | boolean | - |
| hit | - | boolean | - |
| color | 文字颜色 | string | - |
| bgColor | 背景颜色 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| close | 关闭时触发 | - |

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

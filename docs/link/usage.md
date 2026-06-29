# Link 链接 - 使用说明

## 基础用法

```vue
<template>
  <w-space>
    <w-link href="https://example.com" target="_blank">默认链接</w-link>
    <w-link type="primary">主要链接</w-link>
    <w-link type="success">成功链接</w-link>
    <w-link type="warning">警告链接</w-link>
    <w-link type="danger">危险链接</w-link>
    <w-link :underline="false">无下划线</w-link>
    <w-link disabled>禁用状态</w-link>
  </w-space>
</template>

<script setup>
import { WLink, WSpace } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 类型 | string | default |
| underline | 是否下划线 | boolean | true |
| disabled | 是否禁用 | boolean | - |
| href | 链接地址 | string | - |
| target | 打开方式 | string | - |
| icon | 图标名称 | string | - |
| size | 尺寸 | string | default（继承全局 size） |

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

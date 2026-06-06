# Alert 警告 - 使用说明

## 基础用法

```vue
<template>
  <w-alert title="成功提示" description="这是一条成功的提示信息" type="success" show-icon />
  <w-alert title="警告提示" description="这是一条警告的提示信息" type="warning" show-icon closable />
  <w-alert title="错误提示" type="error" center />
</template>

<script setup>
import { WAlert } from '@windows-ui/core'
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | - |
| description | 描述文本 | string | - |
| type | 类型 | string | info |
| closable | 是否可关闭 | boolean | - |
| center | 是否居中 | boolean | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| close | 关闭时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| title | 替换标题文本 |
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

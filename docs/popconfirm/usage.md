# Popconfirm 确认弹出框 - 使用说明

## 基础用法

```vue
<template>
  <w-popconfirm title="确定删除吗？" @confirm="handleConfirm">
    <w-button>删除</w-button>
  </w-popconfirm>
</template>

<script setup>
import { WPopconfirm, WButton } from '@windows-ui/core'
const handleConfirm = () => console.log('确认删除')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | 确认操作？ |
| type | 类型 | string | warning |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| confirm | 确认时触发 | - |
| cancel | 取消时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| title | 替换内容区标题文本与图标 |
| action | 替换底部操作按钮区 |

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

# Dialog 对话框 - 使用说明

## 基础用法

```vue
<template>
  <w-dialog v-model="value" />
</template>

<script setup>
import { WDialog } from '@windows-ui/core'
import { ref } from 'vue'
const value = ref('')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | boolean | - |
| title | 标题 | string | 提示 |
| width | 宽度 | number | 420 |
| closeOnClickModal | 点击遮罩是否关闭 | boolean | true |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新时触发 | value |
| close | 关闭时触发 | - |
| confirm | 确认时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| footer | 底部内容 |

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

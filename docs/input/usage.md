# Input 输入框 - 使用说明

## 基础用法

```vue
<template>
  <w-space direction="vertical">
    <w-input v-model="value" placeholder="请输入内容" />
    <w-input v-model="value" clearable placeholder="可清空" />
    <w-input v-model="value" prefix-icon="search" placeholder="带前缀图标" />
    <w-input v-model="value" suffix-icon="calendar" placeholder="带后缀图标" />
    <w-input v-model="value" disabled placeholder="禁用状态" />
    <w-input v-model="value" size="small" placeholder="小尺寸" />
    <w-input v-model="value" size="large" placeholder="大尺寸" />
  </w-space>
</template>

<script setup>
import { ref } from 'vue'
import { WInput, WSpace } from '@windows-ui/core'
const value = ref('')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string | - |
| type | 类型 | string | text |
| placeholder | 占位提示文本 | string | - |
| size | 尺寸 | string | default |
| disabled | 是否禁用 | boolean | - |
| readonly | 是否只读 | boolean | - |
| clearable | 是否可清空 | boolean | - |
| prefixIcon | 前缀图标 | string | - |
| suffixIcon | 后缀图标 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新时触发 | value |
| input | 输入时触发 | value |
| focus | 获取焦点时触发 | event |
| blur | 失去焦点时触发 | event |
| clear | 清空时触发 | - |

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

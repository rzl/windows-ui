# Date Picker 日期选择器 - 使用说明

## 基础用法

```vue
<template>
  <w-date-picker v-model="value" placeholder="选择日期" />
  <w-date-picker v-model="valueRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
</template>

<script setup>
import { ref } from 'vue'
import { WDatePicker } from '@windows-ui/core'
const value = ref('')
const valueRange = ref('')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string | - |
| placeholder | 占位提示文本 | string | 选择日期 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新时触发 | value |
| change | 用户确认选定的值时触发 | value |

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

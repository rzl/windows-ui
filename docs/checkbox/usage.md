# Checkbox 复选框 - 使用说明

## 基础用法

```vue
<template>
  <w-checkbox-group v-model="checked">
    <w-checkbox label="选项一" />
    <w-checkbox label="选项二" />
    <w-checkbox label="选项三" />
  </w-checkbox-group>
</template>

<script setup>
import { ref } from 'vue'
import { WCheckboxGroup, WCheckbox } from '@windows-ui/core'
const checked = ref(['选项一'])
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | - | false |
| label | 标签文本 | string/number | - |
| disabled | 是否禁用 | boolean | - |
| indeterminate | 是否不确定状态 | boolean | - |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |

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

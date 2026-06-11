# Radio 单选框 - 使用说明

## 基础用法

```vue
<template>
  <w-radio-group v-model="radio">
    <w-radio label="1">选项一</w-radio>
    <w-radio label="2">选项二</w-radio>
    <w-radio label="3">选项三</w-radio>
  </w-radio-group>
</template>

<script setup>
import { ref } from 'vue'
import { WRadioGroup, WRadio } from '@windows-ui/core'
const radio = ref('1')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string/number/boolean | - |
| label | 标签文本 | string/number/boolean | - |
| disabled | 是否禁用 | boolean | - |
| name | 名称 | string | - |
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

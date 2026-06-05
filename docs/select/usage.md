# Select 选择器 - 使用说明

## 基础用法

```vue
<template>
  <w-select v-model="value" placeholder="请选择">
    <w-option label="选项一" value="1" />
    <w-option label="选项二" value="2" />
    <w-option label="选项三" value="3" />
  </w-select>
</template>

<script setup>
import { ref } from 'vue'
import { WSelect, WOption } from '@windows-ui/core'
const value = ref('')
</script>
```

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

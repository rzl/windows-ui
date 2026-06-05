# Transfer 穿梭框 - 使用说明

## 基础用法

```vue
<template>
  <w-transfer v-model="value" :data="data" />
</template>

<script setup>
import { ref } from 'vue'
import { WTransfer } from '@windows-ui/core'
const data = Array.from({ length: 15 }, (_, i) => ({ key: i + 1, label: '备选项 ' + (i + 1) }))
const value = ref([1, 4])
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

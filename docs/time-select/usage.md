# Time Select 时间选择 - 使用说明

## 基础用法

```vue
<template>
  <w-time-select v-model="value" start="08:30" step="00:15" end="18:30" placeholder="选择时间" />
</template>

<script setup>
import { ref } from 'vue'
import { WTimeSelect } from '@windows-ui/core'
const value = ref('')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string | - |
| placeholder | 占位提示文本 | string | 选择时间 |
| start | 开始时间 | string | 00:00 |
| end | 结束时间 | string | 23:59 |
| step | 步长 | string | 00:30 |

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

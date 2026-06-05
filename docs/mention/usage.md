# Mention 提及 - 使用说明

## 基础用法

```vue
<template>
  <w-mention v-model="text" :options="options" placeholder="输入 @ 提及用户" />
</template>

<script setup>
import { ref } from 'vue'
import { WMention } from '@windows-ui/core'
const text = ref('')
const options = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' }
]
</script>
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新时触发 | value |
| select | 选中时触发 | (selection, row) |

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

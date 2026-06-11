# Segmented 分段控制器 - 使用说明

## 基础用法

```vue
<template>
  <w-segmented v-model="value" :options="options" />
</template>

<script setup>
import { ref } from 'vue'
import { WSegmented } from '@windows-ui/core'
const value = ref('Mon')
const options = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string/number | - |
| options | 选项数据 | array | [] |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |

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

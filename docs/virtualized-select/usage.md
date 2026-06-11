# Virtualized Select 虚拟选择器 - 使用说明

## 基础用法

```vue
<template>
  <w-virtualized-select v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
import { WVirtualizedSelect } from '@windows-ui/core'
const value = ref('')
const options = Array.from({ length: 1000 }, (_, i) => ({ label: '选项 ' + (i + 1), value: String(i + 1) }))
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string/number | - |
| options | 选项数据 | array | [] |
| placeholder | 占位提示文本 | string | 请选择 |
| itemHeight | 项高度 | number | - |
| visibleCount | - | number | 8 |
| clearable | 是否可清空 | boolean | true |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |
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

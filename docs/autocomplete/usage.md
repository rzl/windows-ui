# Autocomplete 自动补全 - 使用说明

## 基础用法

```vue
<template>
  <w-autocomplete
    v-model="state"
    :options="restaurants"
    placeholder="请输入内容"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import { WAutocomplete } from '@windows-ui/core'
const state = ref('')
const restaurants = [
  { value: '三全鲜食（北新泾店）', label: '三全鲜食（北新泾店）' },
  { value: 'Hot honey 首尔炸鸡（仙霞路）', label: 'Hot honey 首尔炸鸡（仙霞路）' }
]
const handleSelect = (item) => console.log(item)
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | string | - |
| placeholder | 占位提示文本 | string | - |
| options | 选项数据 | array | [] |
| clearable | 是否可清空 | boolean | true |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| select | 选中时触发 | (selection, row) |
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

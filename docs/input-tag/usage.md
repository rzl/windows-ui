# Input Tag 标签输入框 - 使用说明

## 基础用法

```vue
<template>
  <w-input-tag v-model="tags" placeholder="输入后按回车添加标签" />
</template>

<script setup>
import { ref } from 'vue'
import { WInputTag } from '@windows-ui/core'
const tags = ref(['标签一', '标签二'])
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | array | [] |
| placeholder | 占位提示文本 | string | - |
| disabled | 是否禁用 | boolean | - |
| max | 最大值 | number | - |
| clearable | 是否可清空 | boolean | true |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
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

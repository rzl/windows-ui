# Tour 漫游引导 - 使用说明

## 基础用法

```vue
<template>
  <w-button ref="ref1">上传文件</w-button>
  <w-button ref="ref2">保存</w-button>
  <w-tour :steps="steps" />
</template>

<script setup>
import { ref } from 'vue'
import { WTour, WButton } from '@windows-ui/core'
const ref1 = ref()
const ref2 = ref()
const steps = [
  { title: '上传文件', description: '将文件上传到服务器', target: () => ref1.value?.$el },
  { title: '保存', description: '保存当前更改', target: () => ref2.value?.$el }
]
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| visible | 是否可见 | boolean | - |
| steps | - | array | [] |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 可见性更新时触发 | visible |
| finish | - | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| action | 操作区内容 |
| header | 头部内容 |

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

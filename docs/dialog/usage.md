# Dialog 对话框 - 使用说明

## 基础用法

```vue
<template>
  <w-button @click="visible = true">打开对话框</w-button>
  <w-dialog v-model="visible" title="提示" width="400px">
    <span>这是一段信息</span>
    <template #footer>
      <w-button @click="visible = false">取消</w-button>
      <w-button type="primary" @click="visible = false">确定</w-button>
    </template>
  </w-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { WDialog, WButton } from '@windows-ui/core'
const visible = ref(false)
</script>
```

## 禁止拖动

默认情况下对话框头部可拖动，可通过 `draggable` 属性禁用：

```vue
<template>
  <w-dialog v-model="visible" title="不可拖动" :draggable="false">
    <p>该对话框头部不可拖动</p>
  </w-dialog>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | boolean | - |
| title | 标题 | string | 提示 |
| width | 宽度 | number | 420 |
| closeOnClickModal | 点击遮罩是否关闭 | boolean | true |
| draggable | 头部是否允许拖动 | boolean | true |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新时触发 | value |
| close | 关闭时触发 | - |
| confirm | 确认时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |
| footer | 底部内容 |

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

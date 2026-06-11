# Drawer 抽屉 - 使用说明

## 基础用法

```vue
<template>
  <w-button @click="visible = true">打开抽屉</w-button>
  <w-drawer v-model="visible" title="标题" direction="rtl">
    <p>抽屉内容区域</p>
  </w-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { WDrawer, WButton } from '@windows-ui/core'
const visible = ref(false)
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值（支持 v-model） | boolean | - |
| title | 标题 | string |  |
| direction | 方向 | string | right |
| size | 尺寸 | - | 300px |
| closeOnClickModal | 点击遮罩是否关闭 | boolean | true |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| close | 关闭时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| action | 操作区内容 |
| default | 默认内容 |
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

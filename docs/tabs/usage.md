# Tabs 标签页 - 使用说明

## 基础用法

```vue
<template>
  <w-tabs v-model="activeName">
    <w-tab-pane label="用户管理" name="first">用户管理内容</w-tab-pane>
    <w-tab-pane label="配置管理" name="second">配置管理内容</w-tab-pane>
    <w-tab-pane label="角色管理" name="third">角色管理内容</w-tab-pane>
  </w-tabs>
</template>

<script setup>
import { ref } from 'vue'
import { WTabs, WTabPane } from '@windows-ui/core'
const activeName = ref('first')
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| tabs | - | array | [] |
| modelValue | 绑定值（支持 v-model） | number | 0 |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

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

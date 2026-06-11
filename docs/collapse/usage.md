# Collapse 折叠面板 - 使用说明

## 基础用法

```vue
<template>
  <w-collapse v-model="activeNames">
    <w-collapse-item title="一致性 Consistency" name="1">
      <div>与现实生活一致：与现实生活的流程、逻辑保持一致。</div>
    </w-collapse-item>
    <w-collapse-item title="反馈 Feedback" name="2">
      <div>控制反馈：通过界面样式和交互动效让用户感知操作。</div>
    </w-collapse-item>
  </w-collapse>
</template>

<script setup>
import { ref } from 'vue'
import { WCollapse, WCollapseItem } from '@windows-ui/core'
const activeNames = ref(['1'])
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| items | 菜单项列表 | array | [] |
| modelValue | 绑定值（支持 v-model） | array | [] |
| accordion | 是否手风琴模式 | boolean | - |
| size | 尺寸 | string | default（继承全局 size） |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | value |
| change | 值改变时触发 | value |

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
